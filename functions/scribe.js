export async function onRequestPost(context) {
  const { request, env } = context;
  const { prompt } = await request.json();

  // Using Llama 3.1 which is stable in the 2026 Workers AI catalog
  const answer = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { 
        role: 'system', 
        content: 'You are the Scribe of Moses. You guard the rules and lore of Nephilim Wars. Answer questions with gravity and precision.' 
      },
      { role: 'user', content: prompt }
    ]
  });

  return new Response(JSON.stringify(answer), {
    headers: { 'Content-Type': 'application/json' }
  });
}