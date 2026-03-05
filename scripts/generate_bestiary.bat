@echo off
REM ============================================================================
REM Nephilim Wars - Bestiary Image Generator
REM Uses Z-Image Turbo (GGUF) via stable-diffusion.cpp
REM ============================================================================

setlocal EnableDelayedExpansion

echo.
echo ############################################################
echo #  NEPHILIM WARS - BESTIARY IMAGE GENERATOR               #
echo #  Model: Z-Image Turbo Q4_K_M (No content restrictions!)  #
echo ############################################################
echo.

:menu
echo Select an option:
echo.
echo   [1] Generate ALL images (%~dp0scripts)
echo   [2] Generate Archangels only (7 images)
echo   [3] Generate Fallen/Demons only (10 images)
echo   [4] Generate Combat Creatures only (8 images)
echo   [5] Generate Legendary Giants only (4 images)
echo   [6] Generate High Angels + Azrael (3 images)
echo   [7] Generate Corrupted Humans (2 images)
echo   [8] List all available characters
echo   [9] Generate custom range (enter start/count)
echo   [0] Exit
echo.

set /p choice="Enter choice: "

if "%choice%"=="1" goto all
if "%choice%"=="2" goto archangels
if "%choice%"=="3" goto fallen
if "%choice%"=="4" goto combat
if "%choice%"=="5" goto legendary
if "%choice%"=="6" goto high_angels
if "%choice%"=="7" goto corrupted
if "%choice%"=="8" goto list
if "%choice%"=="9" goto custom
if "%choice%"=="0" goto end

echo Invalid choice. Please try again.
goto menu

:all
echo.
echo Generating ALL bestiary images...
python "%~dp0scripts\generate_bestiary_images.py"
goto done

:archangels
echo.
echo Generating Archangels...
python "%~dp0scripts\generate_bestiary_images.py" --category archangel
goto done

:fallen
echo.
echo Generating Fallen/Demons...
python "%~dp0scripts\generate_bestiary_images.py" --category fallen
goto done

:combat
echo.
echo Generating Combat Creatures...
python "%~dp0scripts\generate_bestiary_images.py" --category combat
goto done

:legendary
echo.
echo Generating Legendary Giants...
python "%~dp0scripts\generate_bestiary_images.py" --category legendary
goto done

:high_angels
echo.
echo Generating High Angels...
python "%~dp0scripts\generate_bestiary_images.py" --category high_angel
python "%~dp0scripts\generate_bestiary_images.py" --category angel_of_death
goto done

:corrupted
echo.
echo Generating Corrupted Humans...
python "%~dp0scripts\generate_bestiary_images.py" --category corrupted
goto done

:list
python "%~dp0scripts\generate_bestiary_images.py" --list
goto menu

:custom
set /p start_idx="Enter start index (0=first): "
set /p img_count="Enter number of images: "
echo.
echo Generating %img_count% images starting from index %start_idx%...
python "%~dp0scripts\generate_bestiary_images.py" --start %start_idx% --count %img_count%
goto done

:done
echo.
echo ============================================================
echo Generation complete! Check output in:
echo %~dp0public\images\bestiary\
echo ============================================================
echo.
pause
goto menu

:end
echo.
echo May your images be blessed by the Watchers!
echo.
exit /b 0