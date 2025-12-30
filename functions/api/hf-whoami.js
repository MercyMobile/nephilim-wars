export async function onRequest(context) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HF_TOKEN = context.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HF_TOKEN not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const response = await fetch("https://huggingface.co/api/whoami-v2", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Auth failed: ${response.statusText}` }),
        { status: response.status, headers: corsHeaders }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ name: data.name, success: true }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
