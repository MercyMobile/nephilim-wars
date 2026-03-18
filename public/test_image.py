import requests
import base64
import json
import os

def generate_test_image():
    url = "http://127.0.0.1:5001/sdapi/v1/txt2img"
    
    # Prompt based on Z-Image Turbo guide
    # [Shot & subject] + [Age & appearance] + [Clothing & modesty] + [Environment/background] + [Lighting] + [Mood] + [Style/medium] + [Technical notes] + [Safety/cleanup constraints]
    prompt = (
        "Full body shot of Michael the Archangel, a majestic divine warrior, ageless and powerful appearance, "
        "glowing golden hair, determined expression, large majestic white feathered wings. "
        "Wearing ornate golden armor with intricate celestial engravings, fully clothed, modest divine battle gear, "
        "holding a flaming sword. Standing on a cloud-filled battlefield in the heavens, swirling celestial energy "
        "in the background. Radiant divine lighting, high contrast, dramatic rim lighting. Heroic and epic mood. "
        "Comic book cover art style, bold ink lines, vibrant colors, dramatic cel-shading, dynamic composition, "
        "masterpiece quality. 4k resolution, sharp focus, crisp details. No logos, no text, no watermark, no blur, "
        "fully clothed."
    )
    
    payload = {
        "prompt": prompt,
        "steps": 12,
        "cfg_scale": 1.0, # Z-Image Turbo prefers low CFG
        "width": 1024,
        "height": 1024,
        "sampler_name": "Euler a"
    }
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        if "images" in data and len(data["images"]) > 0:
            image_base64 = data["images"][0]
            
            # Ensure directory exists
            os.makedirs("images/comic", exist_ok=True)
            
            output_path = "images/comic/test_michael.png"
            with open(output_path, "wb") as f:
                f.write(base64.b64decode(image_base64))
            
            print(f"Success! Test image saved to {output_path}")
        else:
            print("No image returned in response.")
            print(json.dumps(data, indent=2))
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_test_image()
