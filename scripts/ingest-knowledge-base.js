#!/usr/bin/env node

/**
 * Nephilim Wars Knowledge Base Ingestion Script
 *
 * Chunks the game manual and system docs, generates embeddings via
 * Cloudflare Workers AI, and upserts them into the Vectorize index.
 *
 * Prerequisites:
 *   - `npx wrangler login` (authenticated with Cloudflare)
 *   - Vectorize index "nephilim-knowledge-base" exists
 *     (create with: npx wrangler vectorize create nephilim-knowledge-base --dimensions=768 --metric=cosine)
 *
 * Usage:
 *   node scripts/ingest-knowledge-base.js
 *
 * The script uses wrangler CLI under the hood to interact with Cloudflare APIs.
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Configuration ---
const CHUNK_SIZE = 800;       // ~800 tokens per chunk (chars as rough proxy)
const CHUNK_OVERLAP = 100;    // overlap between chunks for context continuity
const BATCH_SIZE = 20;        // vectors per upsert batch (Vectorize limit: 1000)
const INDEX_NAME = 'nephilim-knowledge-base';

// Docs to ingest
const DOCS = [
  { path: 'docs/manual.md', source: 'game-manual' },
  { path: 'docs/NEPHILIM_WARS_GAME_SYSTEM.md', source: 'game-system' },
];

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
 * Generate a deterministic ID for a chunk so re-runs update rather than duplicate.
 */
function chunkId(source, index) {
  const hash = createHash('md5').update(`${source}:${index}`).digest('hex').slice(0, 12);
  return `${source}-${index}-${hash}`;
}

// --- Embedding via Workers AI (through a temporary Worker) ---

/**
 * Generate embeddings by calling the Cloudflare Workers AI REST API via wrangler.
 * We use the bge-base-en-v1.5 model which outputs 768-dimensional vectors,
 * matching the Vectorize index configuration.
 */
async function generateEmbeddings(texts) {
  // Write texts to a temp file to avoid shell argument limits
  const tempInput = resolve(ROOT, 'scripts/.temp-embed-input.json');
  const tempOutput = resolve(ROOT, 'scripts/.temp-embed-output.json');
  writeFileSync(tempInput, JSON.stringify({ text: texts }));

  // Use the Workers AI REST API via wrangler
  // First, get account ID
  const accountId = execSync('npx wrangler whoami 2>/dev/null | grep -oP "(?<=account )[a-f0-9]+" || npx wrangler whoami 2>&1 | grep -oP "[a-f0-9]{32}"', {
    cwd: ROOT,
    encoding: 'utf-8',
  }).trim();

  if (!accountId) {
    throw new Error('Could not determine Cloudflare account ID. Run `npx wrangler login` first.');
  }

  // Call Workers AI embedding model via REST API
  const curlCmd = `npx wrangler ai run @cf/baai/bge-base-en-v1.5 --file=${tempInput}`;

  try {
    const result = execSync(curlCmd, {
      cwd: ROOT,
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large embedding responses
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
  // Write vectors to NDJSON format that wrangler vectorize expects
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
  console.log('=== Nephilim Wars Knowledge Base Ingestion ===\n');

  // 1. Read and chunk all documents
  const allChunks = [];
  for (const doc of DOCS) {
    const fullPath = resolve(ROOT, doc.path);
    console.log(`Reading ${doc.path}...`);
    const text = readFileSync(fullPath, 'utf-8');
    const chunks = chunkDocument(text, doc.source);
    console.log(`  → ${chunks.length} chunks\n`);
    allChunks.push(...chunks);
  }

  console.log(`Total chunks: ${allChunks.length}\n`);

  // 2. Generate embeddings and upsert in batches
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allChunks.length / BATCH_SIZE);
    console.log(`Processing batch ${batchNum}/${totalBatches} (${batch.length} chunks)...`);

    // Generate embeddings for this batch
    const texts = batch.map(c => c.text);
    const embeddings = await generateEmbeddings(texts);

    // Build vector objects
    const vectors = batch.map((chunk, j) => ({
      id: chunkId(chunk.metadata.source, chunk.metadata.chunkIndex),
      values: embeddings[j],
      metadata: {
        ...chunk.metadata,
        text: chunk.text, // Store text in metadata for retrieval
      },
    }));

    // Upsert to Vectorize
    await upsertVectors(vectors);

    // Small delay to avoid rate limits
    if (i + BATCH_SIZE < allChunks.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n✓ Knowledge base ingestion complete!');
  console.log(`  Index: ${INDEX_NAME}`);
  console.log(`  Total vectors: ${allChunks.length}`);

  // Cleanup temp files
  try {
    execSync('rm -f scripts/.temp-embed-input.json scripts/.temp-embed-output.json scripts/.temp-vectors.ndjson', { cwd: ROOT });
  } catch { /* ignore */ }
}

main().catch(err => {
  console.error('\nIngestion failed:', err.message);
  process.exit(1);
});
