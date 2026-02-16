@echo off
echo ========================================
echo Converting JPG frames to High-Res WebP
echo ========================================
echo.

cd /d "d:\Interior Design - Version 3 - Vgs- Antigravity\public\scroll_animation_frames"

echo Current directory: %CD%
echo.

REM Create backup folder
if not exist "backup_jpg" mkdir backup_jpg
echo Created backup folder...
echo.

REM Count files
set count=0
for %%f in (ezgif-frame-*.jpg) do set /a count+=1
echo Found %count% JPG frames to convert
echo.

REM Convert each JPG to WebP with upscaling
echo Starting conversion to 2560x1440 WebP...
echo.

for %%f in (ezgif-frame-*.jpg) do (
    echo Converting %%f to WebP...

    REM Extract frame number (e.g., 001 from ezgif-frame-001.jpg)
    set "filename=%%~nf"
    set "number=!filename:~-3!"

    REM Convert to 2560x1440 WebP with high quality
    ffmpeg -i "%%f" -vf "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440" -q:v 85 -y "ezgif-frame-%%~nf.webp" -loglevel error

    REM Move original JPG to backup
    move "%%f" "backup_jpg\" >nul
)

echo.
echo ========================================
echo Conversion Complete!
echo ========================================
echo.
echo New files: WebP at 2560x1440
echo Original JPGs backed up to: backup_jpg\
echo.
pause
