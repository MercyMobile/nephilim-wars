#!/usr/bin/env node

/**
 * Nephilim Wars — Scribe Knowledge Base Ingestion
 *
 * Reads all texts from docs/scribe-texts/, chunks them, generates
 * embeddings via Cloudflare Workers AI, and uploads to Vectorize.
 *
 * Supported file formats: .md, .txt, .json, .html
 *
 * Prerequisites:
 *   - npx wrangler login
 *   - Vectorize index exists:
 *     npx wrangler vectorize create nephilim-knowledge-base --dimensions=768 --metric=cosine
 *
 * Usage:
 *   npm run ingest
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { basename, dirname, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEXTS_DIR = resolve(ROOT, 'docs/scribe-texts');

// --- Configuration ---
const CHUNK_SIZE = 800;       // ~800 chars per chunk
const CHUNK_OVERLAP = 100;    // overlap between chunks for context continuity
const BATCH_SIZE = 20;        // vectors per upsert batch
const INDEX_NAME = 'nephilim-knowledge-base';

// --- File Discovery ---

function discoverTexts() {
  const supported = ['.md', '.txt', '.json', '.html'];
  const files = readdirSync(TEXTS_DIR);
  return files
    .filter(f => supported.includes(extname(f).toLowerCase()))
    .map(f => ({
      path: resolve(TEXTS_DIR, f),
      filename: f,
      source: basename(f, extname(f)), // e.g. "1-enoch" from "1-enoch.txt"
    }));
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
      // Try to extract text content from JSON structures
      const data = JSON.parse(raw);
      return flattenJson(data);
    }

    case '.html': {
      // Strip HTML tags, keep text content
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
        // Include the key as a heading for context
        return depth < 3 ? `${key}: ${text}` : text;
      })
      .join('\n');
  }
  return String(obj);
}

// --- Chunking ---

/**
 * Split a document into overlapping chunks, preserving section headings.
 */
function chunkDocument(text, source) {
  const lines = text.split('\n');
  const chunks = [];
  let currentHeading = '';
  let currentChunk = '';
  let chunkIndex = 0;

  for (const line of lines) {
    // Track the nearest markdown heading for metadata
    if (/^#{1,4}\s/.test(line)) {
      currentHeading = line.replace(/^#+\s*/, '').trim();
    }

    const candidate = currentChunk + line + '\n';

    if (candidate.length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        metadata: {
          source,
          section: currentHeading,
          chunkIndex: chunkIndex++,
        },
      });
      // Start next chunk with overlap from end of previous
      const overlapStart = Math.max(0, currentChunk.length - CHUNK_OVERLAP);
      currentChunk = currentChunk.slice(overlapStart) + line + '\n';
    } else {
      currentChunk = candidate;
    }
  }

  // Final chunk
  if (currentChunk.trim().length > 50) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: {
        source,
        section: currentHeading,
        chunkIndex: chunkIndex++,
      },
    });
  }

  return chunks;
}

/**
 * Deterministic ID so re-runs update rather than duplicate.
 */
function chunkId(source, index) {
  const hash = createHash('md5').update(`${source}:${index}`).digest('hex').slice(0, 12);
  return `${source}-${index}-${hash}`;
}

// --- Embedding via Workers AI ---

async function generateEmbeddings(texts) {
  const tempInput = resolve(ROOT, 'scripts/.temp-embed-input.json');
  writeFileSync(tempInput, JSON.stringify({ text: texts }));

  const curlCmd = `npx wrangler ai run @cf/baai/bge-base-en-v1.5 --file=${tempInput}`;

  try {
    const result = execSync(curlCmd, {
      cwd: ROOT,
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
    });
    const parsed = JSON.parse(result);
    return parsed.data || parsed;
  } catch (error) {
    console.error('Embedding API call failed:', error.message);
    throw error;
  }
}

// --- Vectorize Upsert ---

async function upsertVectors(vectors) {
  const tempFile = resolve(ROOT, 'scripts/.temp-vectors.ndjson');
  const ndjson = vectors
    .map(v => JSON.stringify({ id: v.id, values: v.values, metadata: v.metadata }))
    .join('\n');
  writeFileSync(tempFile, ndjson);

  try {
    const result = execSync(
      `npx wrangler vectorize insert ${INDEX_NAME} --file=${tempFile}`,
      { cwd: ROOT, encoding: 'utf-8', timeout: 60000 }
    );
    console.log(`  Upserted ${vectors.length} vectors`);
    return result;
  } catch (error) {
    console.error('Vectorize upsert failed:', error.message);
    throw error;
  }
}

// --- Main ---

async function main() {
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

    if (i + BATCH_SIZE < allChunks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\nDone.');
  console.log(`  Index: ${INDEX_NAME}`);
  console.log(`  Total vectors: ${allChunks.length}`);

  // Cleanup temp files
  try {
    execSync('rm -f scripts/.temp-embed-input.json scripts/.temp-vectors.ndjson', { cwd: ROOT });
  } catch { /* ignore */ }
}

main().catch(err => {
  console.error('\nIngestion failed:', err.message);
  process.exit(1);
});
