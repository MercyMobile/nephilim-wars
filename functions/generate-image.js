// functions/generate-image.js
// Cloudflare Pages function for Hugging Face image generation

export async function onRequestPost(context) {
  try {
    const { model, prompt, negativePrompt } = await context.request.json();
    
    // Validate input
    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get token from environment variable
    const HF_TOKEN = context.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Model endpoints
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

    // Call Hugging Face API
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

    // Handle model loading status
    if (response.status === 503) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          error: 'Model is loading',
          estimated_time: errorData.estimated_time || 20
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the image blob and convert to base64
    const imageBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);
    
    // Convert to base64 using btoa
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
