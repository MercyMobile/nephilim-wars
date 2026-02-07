#!/usr/bin/env node

/**
 * Nephilim Wars — Scribe Knowledge Base Ingestion
 *
 * Reads all texts from docs/scribe-texts/, chunks them, generates
 * embeddings via Cloudflare Workers AI REST API, and uploads to Vectorize.
 *
 * Supported file formats: .md, .txt, .json, .html
 *
 * Prerequisites:
 *   1. Create a .env file in the project root with:
 *        CLOUDFLARE_ACCOUNT_ID=your_account_id
 *        CLOUDFLARE_API_TOKEN=your_api_token
 *
 *      To get these:
 *        - Account ID: Cloudflare dashboard → any zone → right sidebar → "Account ID"
 *        - API Token: https://dash.cloudflare.com/profile/api-tokens → Create Token
 *          Use the "Edit Cloudflare Workers" template (needs Workers AI + Vectorize permissions)
 *
 *   2. Vectorize index "nephilim-knowledge-base" must exist (768 dimensions, cosine metric)
 *
 * Usage:
 *   npm run ingest
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { basename, dirname, extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEXTS_DIR = resolve(ROOT, 'docs/scribe-texts');

// --- Load .env ---
function loadEnv() {
  const envPath = resolve(ROOT, '.env');
  if (!existsSync(envPath)) {
    console.error('Missing .env file in project root.');
    console.error('Create one with:');
    console.error('  CLOUDFLARE_ACCOUNT_ID=your_account_id');
    console.error('  CLOUDFLARE_API_TOKEN=your_api_token');
    process.exit(1);
  }
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*([\w]+)\s*=\s*(.+?)\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
}

// --- Configuration ---
const CHUNK_SIZE = 800;       // ~800 chars per chunk
const CHUNK_OVERLAP = 100;    // overlap between chunks for context continuity
const BATCH_SIZE = 20;        // vectors per upsert batch (API max is 100)
const INDEX_NAME = 'nephilim-knowledge-base';

// --- File Discovery ---

function discoverTexts(dir = TEXTS_DIR) {
  const supported = ['.md', '.txt', '.json', '.html'];
  const results = [];

  for (const entry of readdirSync(dir)) {
    if (entry === 'README.txt') continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Recurse into subdirectories (alc/, bib/, jud/, etc.)
      results.push(...discoverTexts(fullPath));
    } else if (supported.includes(extname(entry).toLowerCase())) {
      // Use subfolder/filename as source label, e.g. "bib/genesis" or "jud/1-enoch"
      const relPath = relative(TEXTS_DIR, fullPath);
      const source = relPath.replace(/\\/g, '/').replace(extname(entry), '');
      results.push({
        path: fullPath,
        filename: relPath.replace(/\\/g, '/'),
        source,
      });
    }
  }

  return results;
}

/**
 * Extract plain text from different file formats.
 */
function extractText(filePath) {
  const ext = extname(filePath).toLowerCase();
  const raw = readFileSync(filePath, 'utf-8');

  switch (ext) {
    case '.md':
    case '.txt':
      return raw;

    case '.json': {
      const data = JSON.parse(raw);
      return flattenJson(data);
    }

    case '.html': {
      return raw
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    default:
      return raw;
  }
}

/**
 * Recursively extract string values from a JSON structure.
 */
function flattenJson(obj, depth = 0) {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(item => flattenJson(item, depth + 1)).join('\n');
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .map(([key, val]) => {
        const text = flattenJson(val, depth + 1);
        return depth < 3 ? `${key}: ${text}` : text;
      })
      .join('\n');
  }
  return String(obj);
}

// --- Chunking ---

function chunkDocument(text, source) {
  const lines = text.split('\n');
  const chunks = [];
  let currentHeading = '';
  let currentChunk = '';
  let chunkIndex = 0;

  for (const line of lines) {
    if (/^#{1,4}\s/.test(line)) {
      currentHeading = line.replace(/^#+\s*/, '').trim();
    }

    const candidate = currentChunk + line + '\n';

    if (candidate.length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: { source, section: currentHeading, chunkIndex: chunkIndex++ },
      });
      const overlapStart = Math.max(0, currentChunk.length - CHUNK_OVERLAP);
      currentChunk = currentChunk.slice(overlapStart) + line + '\n';
    } else {
      currentChunk = candidate;
    }
  }

  if (currentChunk.trim().length > 50) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: { source, section: currentHeading, chunkIndex: chunkIndex++ },
    });
  }

  return chunks;
}

function chunkId(source, index) {
  const hash = createHash('md5').update(`${source}:${index}`).digest('hex').slice(0, 12);
  return `${source}-${index}-${hash}`;
}

// --- Cloudflare REST API ---

function getApiConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in .env');
    process.exit(1);
  }

  return { accountId, apiToken };
}

/**
 * Generate embeddings via Cloudflare Workers AI REST API.
 */
async function generateEmbeddings(texts) {
  const { accountId, apiToken } = getApiConfig();
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/baai/bge-base-en-v1.5`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: texts }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error (${response.status}): ${err}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(`Embedding API failed: ${JSON.stringify(json.errors)}`);
  }

  return json.result.data;
}

/**
 * Upsert vectors to Vectorize via wrangler CLI (which handles auth via login).
 */
async function upsertVectors(vectors) {
  const tempFile = resolve(ROOT, 'scripts/.temp-vectors.ndjson');
  const ndjson = vectors
    .map(v => JSON.stringify({ id: v.id, values: v.values, metadata: v.metadata }))
    .join('\n');
  writeFileSync(tempFile, ndjson);

  try {
    execSync(
      `npx wrangler vectorize insert ${INDEX_NAME} --file="${tempFile}"`,
      { cwd: ROOT, encoding: 'utf-8', timeout: 60000 }
    );
    console.log(`  Upserted ${vectors.length} vectors`);
  } catch (error) {
    console.error('Vectorize upsert failed:', error.message);
    throw error;
  }
}

// --- Main ---

async function main() {
  loadEnv();

  console.log('=== The Scribe — Knowledge Base Ingestion ===\n');
  console.log(`Texts directory: docs/scribe-texts/\n`);

  // 1. Discover files
  const docs = discoverTexts();

  if (docs.length === 0) {
    console.error('No text files found in docs/scribe-texts/');
    console.error('Add your biblical and apocryphal texts there (.md, .txt, .json, .html)');
    process.exit(1);
  }

  console.log(`Found ${docs.length} text(s):`);
  docs.forEach(d => console.log(`  - ${d.filename}`));
  console.log();

  // 2. Read, extract, and chunk all documents
  const allChunks = [];
  for (const doc of docs) {
    console.log(`Processing ${doc.filename}...`);
    const text = extractText(doc.path);
    const chunks = chunkDocument(text, doc.source);
    console.log(`  → ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  console.log(`\nTotal chunks: ${allChunks.length}\n`);

  // 3. Generate embeddings and upsert in batches
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allChunks.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches} (${batch.length} chunks)...`);

    const texts = batch.map(c => c.text);
    const embeddings = await generateEmbeddings(texts);

    const vectors = batch.map((chunk, j) => ({
      id: chunkId(chunk.metadata.source, chunk.metadata.chunkIndex),
      values: embeddings[j],
      metadata: {
        ...chunk.metadata,
        text: chunk.text,
      },
    }));

    await upsertVectors(vectors);

    // Small delay to avoid rate limits
    if (i + BATCH_SIZE < allChunks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\nDone.');
  console.log(`  Index: ${INDEX_NAME}`);
  console.log(`  Total vectors: ${allChunks.length}`);

  // Cleanup temp files
  try {
    execSync('rm -f scripts/.temp-vectors.ndjson', { cwd: ROOT });
  } catch { /* ignore */ }
}

main().catch(err => {
  console.error('\nIngestion failed:', err.message);
  process.exit(1);
});
