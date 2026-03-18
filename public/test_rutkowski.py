import os
import subprocess

SD_CLI_PATH = r"C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe"
DIFFUSION_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\z-image-turbo-Q4_K_M.gguf"
VAE_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\ae.safetensors"
LLM_ENCODER = r"C:\Users\velez\Desktop\AI_Tools\SD\Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf"
OUTPUT_DIR = r"C:\Code\nephilim-wars\public\images\rutkowski"

def generate_test():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    # Greg Rutkowski style prompt for Michael
    prompt = (
        "A breathtaking epic fantasy oil painting of Michael the Archangel by Greg Rutkowski, "
        "the celestial general leading the host of heaven. He is depicted in a dynamic charging pose, "
        "wings fully spread and glowing with divine light, brandishing a sword of living fire. "
        "He wears ornate, highly detailed gold and silver plate armor with intricate engravings. "
        "Background of a swirling, chaotic celestial storm with fragments of ancient temples floating in the air. "
        "Masterful dramatic lighting with high contrast and golden rays of light. "
        "Greg Rutkowski style, epic fantasy, rich oil textures, detailed brushwork, atmospheric, "
        "cinematic composition, masterpiece. 8k resolution, sharp focus, no blur, no grain, no text."
    )
    
    output_path = os.path.join(OUTPUT_DIR, "test_michael_rutkowski.png")
    
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
    
    print(f"Generating Greg Rutkowski style test image for Michael...")
    try:
        subprocess.run(cmd, check=True)
        print(f"Success! Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_test()
