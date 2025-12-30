
export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const body = await request.json();
    const { model, prompt } = body;

    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing model or prompt' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const HF_TOKEN = context.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Use Gradio space
    const spaceUrl = 'https://evalstate-flux1-schnell.hf.space/call/flux1_schnell_infer';
    
    // Start the prediction
    const initResponse = await fetch(spaceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [prompt, 0, true, 1024, 1024, 4]  // prompt, seed, randomize_seed, width, height, steps
      })
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      return new Response(
        JSON.stringify({ error: 'Failed to start generation', details: errorText }),
        { status: initResponse.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const initData = await initResponse.json();
    const eventId = initData.event_id;

    // Poll for result
    const resultUrl = `https://evalstate-flux1-schnell.hf.space/call/flux1_schnell_infer/${eventId}`;
    
    let attempts = 0;
    while (attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const resultResponse = await fetch(resultUrl, {
        headers: { 'Authorization': `Bearer ${HF_TOKEN}` }
      });

      const text = await resultResponse.text();
      const lines = text.trim().split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.msg === 'process_completed') {
            // Get image URL from result
            const imageUrl = data.output.data[0][0].image.url;
            
            // Fetch the image
            const imgResponse = await fetch(imageUrl);
            const imageBlob = await imgResponse.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));

            return new Response(
              JSON.stringify({ success: true, image: base64 }),
              { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
          }
        }
      }
      
      attempts++;
    }

    return new Response(
      JSON.stringify({ error: 'Generation timeout' }),
      { status: 504, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
