// Shared text-model call for the Scribe (/scribe) and the Rules Oracle (/api/oracle).
//
// Why a chain: Cloudflare retires Workers AI models on its own schedule. On 2026-05-30 it
// retired @cf/meta/llama-3.1-8b-instruct, and both endpoints went to HTTP 500 with
// "5028: ... was deprecated". Now, if the first model is gone or erroring, we try the next
// one instead of going silent. All three are Llama instruct models with the same
// { messages } in / { response } out shape.
export const TEXT_MODELS = [
  { id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', label: 'llama-3.3-70b' },
  { id: '@cf/meta/llama-4-scout-17b-16e-instruct', label: 'llama-4-scout' },
  { id: '@cf/meta/llama-3.1-8b-instruct-fp8', label: 'llama-3.1-8b-fp8' },
];

function replyText(out) {
  if (typeof out === 'string') return out;
  if (!out) return '';
  if (typeof out.response === 'string') return out.response;
  if (typeof out.result === 'string') return out.result;
  if (out.result && typeof out.result.response === 'string') return out.result.response;
  const choice = out.choices && out.choices[0];
  if (choice && choice.message && typeof choice.message.content === 'string') return choice.message.content;
  return '';
}

export async function runTextModel(env, messages, { max_tokens = 1024, temperature = 0.7 } = {}) {
  const failures = [];
  for (const model of TEXT_MODELS) {
    try {
      const out = await env.AI.run(model.id, { messages, max_tokens, temperature });
      const text = replyText(out).trim();
      if (text) return { text, model: model.label, failures };
      failures.push(`${model.label}: empty reply`);
    } catch (error) {
      failures.push(`${model.label}: ${error.message}`);
      console.error(`Text model ${model.id} failed:`, error.message);
    }
  }
  throw new Error(`All text models failed. ${failures.join(' | ')}`);
}
