@echo off
REM Quick test - Generate a single image to verify setup
REM Z-Image Turbo requires: diffusion-model, vae, llm, offload-to-cpu, vae-tiling

echo.
echo ============================================================
echo Z-IMAGE TURBO TEST - Michael the Archangel
echo ============================================================
echo.

set SD_CLI=C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe
set DIFFUSION=C:\Users\velez\Desktop\AI_Tools\SD\z-image-turbo-Q4_K_M.gguf
set VAE=C:\Users\velez\Desktop\AI_Tools\SD\ae.safetensors
set LLM=C:\Users\velez\Desktop\AI_Tools\SD\Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf
set OUTPUT=C:\Code\nephilim-wars\public\images\bestiary\archangel\test_michael.png

if not exist "%SD_CLI%" (
    echo ERROR: sd-cli.exe not found at %SD_CLI%
    pause
    exit /b 1
)

if not exist "%DIFFUSION%" (
    echo ERROR: Z-Image model not found at %DIFFUSION%
    pause
    exit /b 1
)

if not exist "%VAE%" (
    echo ERROR: VAE not found at %VAE%
    pause
    exit /b 1
)

if not exist "%LLM%" (
    echo ERROR: LLM encoder not found at %LLM%
    pause
    exit /b 1
)

echo Generating test image: Michael the Archangel
echo Resolution: 1024x640 (card art aspect ratio)
echo.

"%SD_CLI%" ^
    --diffusion-model "%DIFFUSION%" ^
    --vae "%VAE%" ^
    --llm "%LLM%" ^
    --cfg-scale 1.5 ^
    --steps 4 ^
    --scheduler smoothstep ^
    --width 1024 ^
    --height 640 ^
    --seed -1 ^
    --offload-to-cpu ^
    --vae-tiling ^
    -p "Fantasy card art, archangel Michael warrior angel descending from heavenly clouds, gleaming silver-white armor, massive flaming sword raised triumphantly, golden wings spread wide, piercing blue eyes, stern heroic expression, divine radiance, epic fantasy illustration, highly detailed" ^
    -n "blurry, low quality, distorted, watermark, text, signature" ^
    -o "%OUTPUT%"

if %ERRORLEVEL%==0 (
    echo.
    echo ============================================================
    echo SUCCESS! Test image saved to:
    echo %OUTPUT%
    echo.
    echo You are ready to run the full batch generation!
    echo Run: generate_bestiary.bat
    echo ============================================================
) else (
    echo.
    echo ERROR: Test generation failed.
    echo Check your Z-Image Turbo model and sd-cli setup.
)

pause