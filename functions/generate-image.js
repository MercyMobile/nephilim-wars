export async function onRequest(context) {
  const { request } = context;

  // 1. Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  // 2. Validate Method
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt' }),
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

    // --- FIX STARTS HERE ---
    
    // 3. Define Model URL directly
    // The raw API requires the model ID to be in the URL, not the body.
    const MODEL_ID = 'black-forest-labs/FLUX.1-schnell';
    const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;

    // 4. Call the API
    const hfResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'false' // Optional: Forces a new generation rather than a cached one
      },
      // Raw API expects "inputs" as the key for the prompt
      body: JSON.stringify({
        inputs: prompt
      })
    });
    // --- FIX ENDS HERE ---

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return new Response(
        JSON.stringify({ 
          error: 'HF API error', 
          status: hfResponse.status,
          details: errorText 
        }),
        { status: hfResponse.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // 5. Handle Image Response
    // The API returns the raw binary image (blob), not JSON.
    const imageBlob = await hfResponse.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBlob)));

    return new Response(
      JSON.stringify({ success: true, image: base64 }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}