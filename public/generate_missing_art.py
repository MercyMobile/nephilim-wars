import os
import subprocess

SD_CLI_PATH = r"C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe"
DIFFUSION_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\z-image-turbo-Q4_K_M.gguf"
VAE_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\ae.safetensors"
LLM_ENCODER = r"C:\Users\velez\Desktop\AI_Tools\SD\Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf"
OUTPUT_DIR = r"C:\Code\nephilim-wars\public\images\comic"

MISSING_ART = [
    {
        "id": "rephaim_deathspeaker",
        "name": "Rephaim Deathspeaker",
        "category": "Giant",
        "prompt": "A dramatic portrait of a Rephaim Deathspeaker, an ancient giant priest of the dead with pale skin and spectral energy, wearing weathered bone-decorated robes, holding a staff of dark power. Background of an ancient necropolis with ghostly mist and ruins. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    },
    {
        "id": "gibborim",
        "name": "Gibborim",
        "category": "Mighty One",
        "prompt": "A dramatic portrait of a Gibborim, a legendary 'Mighty Man' of renown, a heroic warrior with massive muscles and bronze armor, wielding a heavy bronze sword. Background of an ancient citadel under a dramatic sky. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    },
    {
        "id": "nephilim_hunter",
        "name": "Nephilim Hunter",
        "category": "Giant",
        "prompt": "A dramatic portrait of a Nephilim Hunter, a swift giant scout tracked by beasts, wearing leather and fur, carrying a massive composite bow. Background of a wild prehistoric forest. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    },
    {
        "id": "nephilim_warlord",
        "name": "Nephilim Warlord",
        "category": "Giant",
        "prompt": "A dramatic portrait of a Nephilim Warlord, a towering leader of giants with ornate heavy bronze armor and a spiked mace, commanding an invisible army. Background of a burning battlefield with smoke and dust. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    },
    {
        "id": "elioud_deceiver",
        "name": "Elioud Deceiver",
        "category": "Giant",
        "prompt": "A dramatic portrait of an Elioud Deceiver, a cunning and elegant offspring of giants with subtle angelic features and deceptive beauty, wearing shimmering robes and channeling illusory magic. Background of a mystical desert oasis with shimmering air. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    },
    {
        "id": "elioud_champion",
        "name": "Elioud Champion",
        "category": "Giant",
        "prompt": "A dramatic portrait of an Elioud Champion, a peerless warrior of the third generation, possessing immense physical power and radiant divine armor, wielding a spear of light. Background of an epic mountain peak touching the clouds. Dramatic high-contrast lighting, intense atmosphere. Comic book cover art style, bold ink lines, vibrant colors, inked outlines, graphic novel aesthetic, dynamic composition, masterpiece quality. 8k resolution, sharp focus, no blur, no grain, no watermark, no text."
    }
]

def generate_image_cli(char_id, prompt, category):
    print(f"Generating for {char_id} ({category})...")
    category_dir = os.path.join(OUTPUT_DIR, category)
    if not os.path.exists(category_dir):
        os.makedirs(category_dir)
    file_path = os.path.join(category_dir, f"{char_id}.png")
    cmd = [
        SD_CLI_PATH,
        "--diffusion-model", DIFFUSION_MODEL,
        "--vae", VAE_MODEL,
        "--llm", LLM_ENCODER,
        "--cfg-scale", "1.0",
        "--steps", "8",
        "--width", "1024",
        "--height", "1024",
        "--offload-to-cpu",
        "--vae-tiling",
        "--diffusion-fa",
        "--sampling-method", "euler",
        "--scheduler", "discrete",
        "-p", prompt,
        "-o", file_path
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Saved {file_path}")
        return True
    except Exception as e:
        print(f"Error generating for {char_id}: {e}")
        return False

def main():
    for item in MISSING_ART:
        generate_image_cli(item["id"], item["prompt"], item["category"])

if __name__ == "__main__":
    main()
