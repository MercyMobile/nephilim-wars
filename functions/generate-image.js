export async function onRequest(context) {
  return new Response(JSON.stringify({
    message: "generate-image function works!",
    method: context.request.method,
    hasBody: !!context.request.body
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
