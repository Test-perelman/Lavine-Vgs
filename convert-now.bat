@echo off
echo Converting JPG to WebP at 2560x1440...
cd /d "d:\Interior Design - Version 3 - Vgs- Antigravity\public\scroll_animation_frames"

REM Refresh PATH to include FFmpeg
set "PATH=%PATH%;%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin"

REM Create backup
if not exist backup_jpg mkdir backup_jpg

REM Convert all JPGs
for %%f in (ezgif-frame-*.jpg) do (
    echo Converting %%f...
    "%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe" -i "%%f" -vf "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440" -quality 85 -y "%%~nf.webp" -loglevel error
    move "%%f" backup_jpg\ >nul 2>&1
)

echo.
echo Done! WebP files created at 2560x1440
echo Original JPGs backed up to backup_jpg\
pause
