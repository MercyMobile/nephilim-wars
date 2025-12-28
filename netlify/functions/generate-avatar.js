// netlify/functions/generate-avatar.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { prompt } = await req.json();

    // Initialize the API with your key (stored in Netlify Dashboard)
    const genAI = new GoogleGenerativeAI(Netlify.env.get("GOOGLE_API_KEY"));
    
    // Using the specific model you mentioned (Nano Banana / Gemini 2.5 Flash Image)
    // Note: Ensure this exact model string matches your API documentation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    // Generate the image
    // Note: The specific syntax for image generation varies by exact SDK version. 
    // This assumes the standard "generateContent" flow for multimodal models.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // We assume the model returns base64 image data
    // If Nano Banana returns a URL, you would send that instead.
    const output = response.text(); 

    return new Response(JSON.stringify({ image: output }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};