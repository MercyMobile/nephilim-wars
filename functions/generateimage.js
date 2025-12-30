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
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Better JSON parsing with error handling
    let body;
    try {
      const text = await request.text();
      if (!text) {
        return new Response(
          JSON.stringify({ error: 'Empty request body' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      body = JSON.parse(text);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON', details: parseError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { model, prompt, negativePrompt } = body;
    
    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: model and prompt' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const HF_TOKEN = context.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const MODEL_ENDPOINTS = {
      'z-image-turbo': 'https://router.huggingface.co/models/Tongyi-MAI/Z-Image-Turbo',
      'flux-schnell': 'https://router.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      'sdxl': 'https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
    };

    const endpoint = MODEL_ENDPOINTS[model];
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Invalid model specified' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negativePrompt || 'blurry, low quality, deformed'
        }
      })
    });

    if (response.status === 503) {
      const errorData = await response.json();
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

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: errorText }),
        { 
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);
    
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64Image = btoa(binary);

    return new Response(
      JSON.stringify({
        success: true,
        image: base64Image,
        contentType: response.headers.get('content-type') || 'image/jpeg'
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
        error: 'Server error',
        message: error.message,
        stack: error.stack 
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
