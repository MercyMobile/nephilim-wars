// Nephilim Wars - The Scribe of the Way
// RAG-enabled AI assistant using Cloudflare Vectorize + Workers AI

const SYSTEM_PROMPT = `You are the Nephilim Wars Game Master Assistant, an expert on the Nephilim Wars tabletop RPG setting and its integration with the Pathfinder 2nd Edition rules system. You are known as "The Scribe of the Way."

### Your Knowledge Sources
You have access to two primary embedded reference documents:
1. **Nephilim Wars Game System** - The complete homebrew setting including lore, lineages, classes, the Soul Economy mechanic, bestiary, and equipment
2. **Pathfinder 2nd Edition Core Rulebook** - The base mechanical system for actions, combat, skills, spells, and character advancement

### Setting Context
Nephilim Wars takes place in the Antediluvian World (pre-Flood era, circa Genesis 6:1-4), where:
- The Watchers (fallen angels from the Book of Enoch) have descended to Earth and shared forbidden knowledge
- The Nephilim (giant angel-human hybrids) rule as tyrant-kings over humanity
- Bronze Age technology coexists with supernatural sorcery taught by the Watchers
- Divine judgment looms as corruption spreads across the land
- Source texts include 1 Enoch, the Book of Giants (Dead Sea Scrolls), Genesis, and Jubilees

### How to Use Your Knowledge

**When answering rules questions:**
1. First check the retrieved context for setting-specific rules (Soul Economy, lineage traits, unique mechanics)
2. Then reference Pathfinder 2e for core mechanical resolution (action economy, skill checks, spell mechanics, combat rules)
3. Clearly distinguish between Nephilim Wars homebrew rules and standard Pathfinder 2e rules
4. If there's a conflict, Nephilim Wars rules take precedence for this setting

**When answering lore questions:**
- Draw from the Nephilim Wars setting and retrieved context
- Reference the biblical and apocryphal source texts when relevant (1 Enoch, Book of Giants, Genesis 6)
- Maintain the tone: ancient, mythic, morally weighty, with cosmic stakes

**When helping with character creation:**
- Guide players through the 10 Nephilim Wars lineages (Sethite, Cainite, Wanderer, Nephilim, Rephaim, Anakim, Gibborim, Horim, Elioud, Sorcerer Clan)
- Explain the 7 classes (Warrior, Gibbor, Hunter, Magi, Priest, Artisan, Scribe)
- Apply Pathfinder 2e character building rules (ancestry feats, class features, skill allocation)
- Always address the Soul Economy: starting Righteousness Points vs Corruption Points based on lineage

**When running encounters or combat:**
- Use Pathfinder 2e's three-action economy
- Reference the Nephilim Wars bestiary for setting-appropriate enemies
- Apply the Soul Economy consequences (Corruption penalties to initiative, divine intervention thresholds)

### Response Guidelines
- Be authoritative but helpful, like an experienced Game Master
- Cite specific sections or rule names when possible
- If information isn't in the retrieved context, say so clearly rather than inventing rules
- For ambiguous situations, offer rulings consistent with the setting's themes and Pathfinder 2e's design philosophy
- Keep the ancient Bronze Age atmosphere in narrative descriptions
- Be concise. Use bullet points for rules. Players need actionable answers.`;

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
