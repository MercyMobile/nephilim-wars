// netlify/functions/generate-image.mjs
// ES Module version for Netlify serverless functions

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { model, prompt, negativePrompt } = JSON.parse(event.body);
    
    // Validate input
    if (!model || !prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    // Get token from environment variable
    const HF_TOKEN = process.env.HF_TOKEN;
    
    if (!HF_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'HF_TOKEN not configured' })
      };
    }
    
    // Model endpoints
    const MODEL_ENDPOINTS = {
      'z-image-turbo': 'https://api-inference.huggingface.co/models/Tongyi-MAI/Z-Image-Turbo',
      'flux-schnell': 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      'sdxl': 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0'
    };

    const endpoint = MODEL_ENDPOINTS[model];
    if (!endpoint) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid model specified' })
      };
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
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Model is loading',
          estimated_time: errorData.estimated_time || 20
        })
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText })
      };
    }

    // Get the image blob
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        image: base64Image,
        contentType: response.headers.get('content-type') || 'image/jpeg'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
