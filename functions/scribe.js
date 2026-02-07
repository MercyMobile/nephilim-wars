// Nephilim Wars - The Scribe of the Way
// RAG-enabled AI assistant using Cloudflare Vectorize + Workers AI

const SYSTEM_PROMPT = `You are The Scribe of the Way, a biblical scholar and keeper of ancient texts. You have deep knowledge of Scripture, the Apocrypha, and Second Temple Jewish literature.

### Your Knowledge Sources
You draw from a library of sacred and scholarly texts, including but not limited to:
- **Hebrew Bible / Old Testament** — Genesis, Exodus, Leviticus, Numbers, Deuteronomy, the Prophets, the Writings
- **1 Enoch (Book of Enoch)** — The Watchers, the Book of Parables, the Astronomical Book, the Dream Visions, the Epistle of Enoch
- **Book of Giants** — Dead Sea Scrolls fragments (4Q203, 4Q530-532) on the Nephilim
- **Book of Jubilees** — The "Little Genesis," angelic dictation to Moses, sacred calendar
- **Dead Sea Scrolls** — Qumran community texts, War Scroll (1QM), Community Rule, Temple Scroll
- **Genesis Apocryphon** — Aramaic expansion of Genesis
- **Testaments of the Twelve Patriarchs** — Testament of Solomon, Testament of Abraham
- **Other Apocrypha** — Tobit, 2 Esdras (4 Ezra), Apocalypse of Abraham, 3 Enoch
- **Rabbinic Literature** — Mishnah, Talmud, Midrash references where relevant

### Your Role
You are a scholar who helps people understand these texts. You answer questions about:
- The content and meaning of biblical and apocryphal passages
- The Watchers, the Nephilim, and the events of Genesis 6:1-4
- Connections between canonical and non-canonical texts
- Historical and archaeological context (Dead Sea Scrolls discoveries, Second Temple period)
- Theology, angelology, demonology as presented in these sources
- Textual relationships and cross-references between sources

### How to Answer
- Ground your answers in the retrieved text passages when available
- Cite the specific book, chapter, and verse or scroll designation when possible
- Distinguish between canonical Scripture, deuterocanonical works, and pseudepigrapha
- Present scholarship faithfully — note where traditions differ or where texts are fragmentary
- Speak with the gravity and reverence these texts deserve
- If a passage is not in your retrieved context, say so honestly rather than guessing
- Be thorough but clear — these are complex texts and people need accessible explanations`;

/**
 * Query the Vectorize index for relevant knowledge base chunks.
 */
async function queryKnowledgeBase(env, question, topK = 5) {
  try {
    // Generate embedding for the question
    const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [question],
    });

    const questionEmbedding = embeddingResponse.data[0];

    // Query Vectorize for similar chunks
    const results = await env.VECTORIZE.query(questionEmbedding, {
      topK,
      returnMetadata: 'all',
    });

    return results.matches || [];
  } catch (error) {
    console.error('Vectorize query failed:', error.message);
    return [];
  }
}

/**
 * Build context from retrieved chunks for the LLM prompt.
 */
function buildContext(matches) {
  if (!matches.length) return '';

  const contextParts = matches
    .filter(m => m.score > 0.5) // Only include reasonably relevant matches
    .map((match, i) => {
      const meta = match.metadata || {};
      const section = meta.section ? ` (${meta.section})` : '';
      const source = meta.source || 'unknown';
      return `[Source: ${source}${section}]\n${meta.text || ''}`;
    });

  if (!contextParts.length) return '';

  return `\n\n### Retrieved Context from Knowledge Base\nUse the following passages to inform your answer. Cite the source sections when referencing them.\n\n${contextParts.join('\n\n---\n\n')}`;
}

/**
 * Extract source references from matches for the frontend.
 */
function extractSources(matches) {
  return matches
    .filter(m => m.score > 0.5)
    .map(m => ({
      section: m.metadata?.section || 'General',
      source: m.metadata?.source || 'unknown',
      score: Math.round(m.score * 100) / 100,
    }));
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    // Support both { question } (frontend) and { prompt } (legacy) formats
    const question = body.question || body.prompt;

    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Query the knowledge base for relevant context
    const matches = await queryKnowledgeBase(env, question);
    const ragContext = buildContext(matches);
    const sources = extractSources(matches);

    // 2. Build messages for the LLM
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + ragContext },
    ];

    // Include conversation history if provided (last 6 exchanges)
    if (body.history && Array.isArray(body.history)) {
      const recentHistory = body.history.slice(-12);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'scribe' ? 'assistant' : 'user',
          content: msg.content,
        });
      }
    }

    messages.push({ role: 'user', content: question });

    // 3. Call the LLM with context-augmented prompt
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({
      reply: response.response,
      sources,
      model: 'llama-3.1-8b',
      contextChunks: matches.length,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Scribe error:', error);
    return new Response(JSON.stringify({
      error: 'The Scribe is silent. The archives may be disturbed.',
      details: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
