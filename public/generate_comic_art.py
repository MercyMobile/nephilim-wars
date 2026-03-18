import os
import json
import base64
import requests
import re

API_URL = "http://127.0.0.1:5001/sdapi/v1/txt2img"
OUTPUT_DIR = "C:/Code/nephilim-wars/public/images/comic"

# Target characters requested by user
TARGET_IDS = [
    "michael"
]

def get_character_data():
    with open("card2.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    characters = {}
    
    # Extract bestiaryData entries
    bestiary_match = re.search(r'const bestiaryData = (\{.*?\});', content, re.DOTALL)
    if bestiary_match:
        data = json.loads(bestiary_match.group(1))
        for entry in data.get("entries", []):
            characters[entry["id"]] = {
                "name": entry["name"],
                "description": entry["description"],
                "type": entry.get("type", "Angel")
            }
            
    # Extract combatBestiaryData enemies
    combat_match = re.search(r'const combatBestiaryData = (\{.*?\});', content, re.DOTALL)
    if combat_match:
        data = json.loads(combat_match.group(1))
        for enemy in data.get("enemies", []):
            characters[enemy["id"]] = {
                "name": enemy["name"],
                "description": enemy["description"],
                "type": enemy.get("type", "Enemy")
            }
            
    # Extract creaturesData sections
    creatures_match = re.search(r'const creaturesData = (\{.*?\});', content, re.DOTALL)
    if creatures_match:
        data = json.loads(creatures_match.group(1))
        for section_name in ["giants", "corrupted"]:
            section = data.get(section_name, {})
            for entry in section.get("entries", []):
                characters[entry["id"]] = {
                    "name": entry["name"],
                    "description": entry["description"],
                    "type": "Giant" if section_name == "giants" else "Human"
                }
                
    return characters

def construct_prompt(char_id, char_info):
    name = char_info["name"]
    desc = char_info["description"]
    ctype = char_info["type"]
    
    # Z-Image Turbo Structure: [Subject & Action] + [Environment/Background] + [Lighting & Atmosphere] + [Style/Medium] + [Technical Specs]
    
    # [Subject & Action]
    subject_action = f"A dramatic portrait of {name}, a powerful {ctype} from biblical myth, {desc}. {name} is in a dynamic and heroic pose."
    
    # [Environment/Background]
    if "Angel" in ctype:
        background = "Background of a celestial kingdom with golden clouds and divine radiance."
    elif "Demon" in ctype or "Fallen" in ctype:
        background = "Background of an infernal landscape with dark shadows, fire, and brimstone."
    elif "Giant" in ctype:
        background = "Background of an ancient megalithic landscape with epic scale mountains."
    else:
        background = "Background of a cinematic battlefield with dust and debris."
        
    # [Lighting & Atmosphere]
    lighting = "Dramatic high-contrast lighting, intense atmosphere."
    
    # [Style/Medium]
    style = "Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality."
    
    # [Technical Specs]
    technical = "8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    
    prompt = f"{subject_action} {background} {lighting} {style} {technical}"
    return prompt

def generate_image(char_id, prompt, category):
    print(f"Generating for {char_id} ({category})...")
    payload = {
        "prompt": prompt,
        "steps": 8,
        "cfg_scale": 1.0,
        "width": 1024,
        "height": 1024,
        "sampler_name": "Euler a"
    }
    
    category_dir = os.path.join(OUTPUT_DIR, category)
    if not os.path.exists(category_dir):
        os.makedirs(category_dir)
        
    try:
        response = requests.post(API_URL, json=payload, timeout=600)
        response.raise_for_status()
        r = response.json()
        
        if "images" in r:
            for i in r['images']:
                # Handle base64 prefix if present
                if "," in i:
                    i = i.split(",")[1]
                image_data = base64.b64decode(i)
                file_path = os.path.join(category_dir, f"{char_id}.png")
                with open(file_path, 'wb') as f:
                    f.write(image_data)
                print(f"Saved {file_path}")
                return True
    except Exception as e:
        print(f"Error generating for {char_id}: {e}")
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    char_data = get_character_data()
    
    # Run for specified targets
    for char_id in TARGET_IDS:
        if char_id in char_data:
            category = char_data[char_id]["type"]
            prompt = construct_prompt(char_id, char_data[char_id])
            generate_image(char_id, prompt, category)
        else:
            print(f"Warning: Character ID {char_id} not found in data.")

if __name__ == "__main__":
    main()
