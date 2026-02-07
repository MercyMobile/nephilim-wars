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
 *   2. Vectorize index "nephilim-knowledge-base" must exist (768 dimensions, cosine metric)
 *
 * Usage:
 *   npm run ingest
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
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
const CHUNK_SIZE = 2000;        // ~2000 chars per chunk (larger = fewer chunks, still good for retrieval)
const CHUNK_OVERLAP = 200;      // overlap between chunks for context continuity
const EMBED_BATCH_SIZE = 100;   // max texts per embedding API call
const VECTORIZE_BATCH_SIZE = 1000; // max vectors per Vectorize insert
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
      results.push(...discoverTexts(fullPath));
    } else if (supported.includes(extname(entry).toLowerCase())) {
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
 * Upsert vectors to Vectorize via REST API (no wrangler subprocess).
 */
async function upsertVectors(vectors) {
  const { accountId, apiToken } = getApiConfig();
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${INDEX_NAME}/insert`;

  // Vectorize REST API expects NDJSON body
  const ndjson = vectors
    .map(v => JSON.stringify({ id: v.id, values: v.values, metadata: v.metadata }))
    .join('\n');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/x-ndjson',
    },
    body: ndjson,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vectorize insert error (${response.status}): ${err}`);
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(`Vectorize insert failed: ${JSON.stringify(json.errors)}`);
  }
}

// --- Main ---

async function main() {
  loadEnv();

  console.log('=== The Scribe — Knowledge Base Ingestion ===\n');
  console.log(`Texts directory: docs/scribe-texts/\n`);

  const docs = discoverTexts();

  if (docs.length === 0) {
    console.error('No text files found in docs/scribe-texts/');
    console.error('Add your biblical and apocryphal texts there (.md, .txt, .json, .html)');
    process.exit(1);
  }

  console.log(`Found ${docs.length} text(s):`);
  docs.forEach(d => console.log(`  - ${d.filename}`));
  console.log();

  // 1. Read, extract, and chunk all documents
  const allChunks = [];
  for (const doc of docs) {
    const text = extractText(doc.path);
    const chunks = chunkDocument(text, doc.source);
    console.log(`  ${doc.filename} → ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  const totalEmbedBatches = Math.ceil(allChunks.length / EMBED_BATCH_SIZE);
  console.log(`Embedding in ${totalEmbedBatches} batches of ${EMBED_BATCH_SIZE}...\n`);

  // 2. Generate all embeddings
  const allVectors = [];
  for (let i = 0; i < allChunks.length; i += EMBED_BATCH_SIZE) {
    const batch = allChunks.slice(i, i + EMBED_BATCH_SIZE);
    const batchNum = Math.floor(i / EMBED_BATCH_SIZE) + 1;

    process.stdout.write(`  Embedding batch ${batchNum}/${totalEmbedBatches}...`);
    const texts = batch.map(c => c.text);
    const embeddings = await generateEmbeddings(texts);

    for (let j = 0; j < batch.length; j++) {
      allVectors.push({
        id: chunkId(batch[j].metadata.source, batch[j].metadata.chunkIndex),
        values: embeddings[j],
        metadata: {
          ...batch[j].metadata,
          text: batch[j].text,
        },
      });
    }

    console.log(` done (${allVectors.length}/${allChunks.length} vectors)`);
  }

  // 3. Upsert all vectors in large batches
  const totalUpsertBatches = Math.ceil(allVectors.length / VECTORIZE_BATCH_SIZE);
  console.log(`\nUpserting in ${totalUpsertBatches} batches of ${VECTORIZE_BATCH_SIZE}...\n`);

  for (let i = 0; i < allVectors.length; i += VECTORIZE_BATCH_SIZE) {
    const batch = allVectors.slice(i, i + VECTORIZE_BATCH_SIZE);
    const batchNum = Math.floor(i / VECTORIZE_BATCH_SIZE) + 1;

    process.stdout.write(`  Upsert batch ${batchNum}/${totalUpsertBatches} (${batch.length} vectors)...`);
    await upsertVectors(batch);
    console.log(' done');
  }

  console.log(`\nDone. ${allVectors.length} vectors in index "${INDEX_NAME}".`);
}

main().catch(err => {
  console.error('\nIngestion failed:', err.message);
  process.exit(1);
});
