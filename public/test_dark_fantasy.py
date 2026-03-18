import os
import subprocess

SD_CLI_PATH = r"C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe"
DIFFUSION_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\z-image-turbo-Q4_K_M.gguf"
VAE_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\ae.safetensors"
LLM_ENCODER = r"C:\Users\velez\Desktop\AI_Tools\SD\Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf"
OUTPUT_DIR = r"C:\Code\nephilim-wars\public\images\dark_fantasy"

def generate_test():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    # Varied prompt for Michael in Dark Fantasy style
    # [Subject & Action] + [Environment/Background] + [Lighting & Atmosphere] + [Style/Medium] + [Technical Specs]
    prompt = (
        "A monumental oil painting of Michael the Archangel, the Spear of Heaven, "
        "standing victoriously over a defeated serpent-like shadow. He is clad in heavy, "
        "battle-worn silver plate armor with intricate biblical inscriptions. "
        "His wings are vast and composed of sharp, metallic white feathers. "
        "Background of a stormy, apocalyptic sky over the ruins of a celestial gate. "
        "Dramatic chiaroscuro lighting, a single beam of divine golden light piercing through the gloom. "
        "Dark fantasy painterly style, thick impasto brushstrokes, visible canvas texture, "
        "gritty and atmospheric, reminiscent of old master oil paintings. "
        "8k resolution, masterpiece quality, muted earth tones with vibrant gold highlights, "
        "sharp focus on the face and the flaming sword, no blur, no text."
    )
    
    output_path = os.path.join(OUTPUT_DIR, "test_michael_painterly.png")
    
    cmd = [
        SD_CLI_PATH,
        "--diffusion-model", DIFFUSION_MODEL,
        "--vae", VAE_MODEL,
        "--llm", LLM_ENCODER,
        "--cfg-scale", "1.0",
        "--steps", "10",
        "--width", "1024",
        "--height", "1024",
        "--offload-to-cpu",
        "--vae-tiling",
        "--diffusion-fa",
        "--sampling-method", "euler",
        "--scheduler", "discrete",
        "-p", prompt,
        "-o", output_path
    ]
    
    print(f"Generating Dark Fantasy test image for Michael...")
    try:
        subprocess.run(cmd, check=True)
        print(f"Success! Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_test()
