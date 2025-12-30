export async function onRequest(context) {
  return new Response(JSON.stringify({ 
    message: "Test works!",
    method: context.request.method 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
