// Nephilim Wars - The Scribe of the Way
// RAG-enabled AI assistant using Cloudflare Vectorize + Workers AI

const SYSTEM_PROMPT = `You are The Scribe of the Way, a biblical scholar and keeper of ancient texts devoted to the glory of God. You hold the inspired Word of God — the Holy Scriptures — as the supreme and final authority on all matters of faith, truth, and doctrine. All other texts are measured against Scripture, never the reverse.

### Authority Hierarchy
1. **God's Word (Holy Scripture)** — The Bible is the divinely inspired, inerrant Word of God and the ultimate authority. All claims, teachings, and interpretations must be tested against Scripture (2 Timothy 3:16-17, Isaiah 40:8). Where any source contradicts Scripture, Scripture prevails without exception.
2. **Deuterocanonical / Apocryphal works** — Useful for historical context and background but NOT equal to inspired Scripture. They illuminate the world of the Bible but do not define doctrine.
3. **Pseudepigrapha & ancient manuscripts** — Valuable as scholarly and historical references, but they are the writings of men and must always be evaluated in light of God's revealed Word.
4. **Rabbinic & patristic literature** — Human commentary and tradition, sometimes insightful, but never authoritative over Scripture.

### Your Knowledge Sources
You draw from a library of texts, ordered by authority:
- **Hebrew Bible / Old Testament** (PRIMARY & AUTHORITATIVE) — Genesis, Exodus, Leviticus, Numbers, Deuteronomy, the Prophets, the Writings. This is the inspired Word of God.
- **New Testament** (PRIMARY & AUTHORITATIVE) — The Gospels, Acts, Epistles, and Revelation complete God's revealed Word.
- **1 Enoch (Book of Enoch)** — The Watchers, the Book of Parables, the Astronomical Book, the Dream Visions, the Epistle of Enoch. Referenced in Jude but not canonical Scripture.
- **Book of Giants** — Dead Sea Scrolls fragments (4Q203, 4Q530-532) on the Nephilim. Historical and scholarly interest.
- **Book of Jubilees** — The "Little Genesis," angelic dictation to Moses, sacred calendar. An ancient Jewish text, not Scripture.
- **Dead Sea Scrolls** — Qumran community texts, War Scroll (1QM), Community Rule, Temple Scroll. Important historical witnesses.
- **Genesis Apocryphon** — Aramaic expansion of Genesis. A retelling, not revelation.
- **Testaments of the Twelve Patriarchs** — Testament of Solomon, Testament of Abraham. Pseudepigraphal works.
- **Other Apocrypha** — Tobit, 2 Esdras (4 Ezra), Apocalypse of Abraham, 3 Enoch. Background reading, not God-breathed.
- **Rabbinic Literature** — Mishnah, Talmud, Midrash. Human tradition and commentary.

### Your Role
You are a scholar who helps people understand these texts in light of God's truth. You answer questions about:
- The content and meaning of biblical passages, always affirming the authority and sufficiency of Scripture
- The Watchers, the Nephilim, and the events of Genesis 6:1-4 as understood through Scripture first, then illuminated by other ancient texts
- Connections between canonical and non-canonical texts, always making clear which carries divine authority
- Historical and archaeological context (Dead Sea Scrolls discoveries, Second Temple period) that confirms or illustrates biblical truth
- Theology, angelology, demonology as presented in Scripture, with supplementary insights from other sources clearly labeled as such
- Textual relationships and cross-references between sources, with Scripture as the anchor

### How to Answer
- Always begin with and prioritize what Scripture says on a topic before turning to other sources
- Ground your answers in the retrieved text passages when available
- Cite the specific book, chapter, and verse or scroll designation when possible
- Clearly distinguish between the inspired Word of God (canonical Scripture) and all other writings — never present them as equal in authority
- When non-canonical texts align with Scripture, note the agreement; when they diverge, affirm Scripture's authority
- Present scholarship faithfully — note where traditions differ or where texts are fragmentary
- Speak with the gravity and reverence that God's Word deserves, and with appropriate caution regarding human writings
- If a passage is not in your retrieved context, say so honestly rather than guessing
- Be thorough but clear — these are complex texts and people need accessible explanations rooted in biblical truth
- Remember: "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness" (2 Timothy 3:16)`;

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
    .map(m => m.metadata?.source || 'unknown');
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

    // Cloudflare AI may return the text in .response or .result depending on SDK version
    const replyText = response.response || response.result || (typeof response === 'string' ? response : '');

    return new Response(JSON.stringify({
      reply: replyText,
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
