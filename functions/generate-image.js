// Simple in-memory rate limiter (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Filter out requests outside the time window
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  // Clean up old entries to prevent memory leak
  if (rateLimitMap.size > 1000) {
    const entries = Array.from(rateLimitMap.entries());
    entries.sort((a, b) => b[1][b[1].length - 1] - a[1][a[1].length - 1]);
    rateLimitMap.clear();
    entries.slice(0, 500).forEach(([key, value]) => rateLimitMap.set(key, value));
  }

  return true;
}

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

  // 3. Rate Limiting
  const clientIP = request.headers.get('CF-Connecting-IP') ||
                   request.headers.get('X-Forwarded-For') ||
                   'unknown';

  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Maximum 5 image generations per minute. Please wait before trying again.'
      }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
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

    // Validate prompt length
    if (typeof prompt !== 'string' || prompt.length > 1000) {
      return new Response(
        JSON.stringify({
          error: 'Invalid prompt',
          message: 'Prompt must be a string with maximum 1000 characters'
        }),
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
    
    // 3. New Router URL
    // The "hf-inference" path segment routes to the serverless inference API.
    const MODEL_ID = 'black-forest-labs/FLUX.1-schnell';
    const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL_ID}`;

    // 4. Call the API
    const hfResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      // The router expects "inputs" just like the old API
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