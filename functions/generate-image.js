
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
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }

  try {
    const body = await request.json();
    const { model, prompt, negativePrompt } = body;

    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing model or prompt' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    const HF_TOKEN = context.env.HF_TOKEN;
    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Use router.huggingface.co (new endpoint)
    const MODEL_ENDPOINTS = {
      'flux-schnell': 'https://router.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      'sdxl': 'https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
    };

    const endpoint = MODEL_ENDPOINTS[model];
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Invalid model' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    const hfResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || 'blurry, low quality'
        }
      })
    });

    if (hfResponse.status === 503) {
      const errorData = await hfResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          error: 'Model is loading',
          estimated_time: errorData.estimated_time || 20
        }),
        { 
          status: 503,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'HF API error', 
          status: hfResponse.status,
          details: errorText 
        }),
        { 
          status: hfResponse.status,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const imageBlob = await hfResponse.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));

    return new Response(
      JSON.stringify({
        success: true,
        image: base64
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal error',
        message: error.message
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
