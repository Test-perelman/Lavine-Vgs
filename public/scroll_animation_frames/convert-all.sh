#!/bin/bash

FFMPEG="/c/Users/swaga/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe"

cd "d:/Interior Design - Version 3 - Vgs- Antigravity/public/scroll_animation_frames"

mkdir -p backup_jpg

count=0
total=$(ls ezgif-frame-*.jpg 2>/dev/null | wc -l)

echo "Converting $total files to 2560x1440 WebP..."
echo ""

for file in ezgif-frame-*.jpg; do
    if [ -f "$file" ]; then
        count=$((count + 1))
        basename="${file%.jpg}"
        output="${basename}.webp"

        echo "[$count/$total] $file -> $output"

        "$FFMPEG" -i "$file" \
            -vf "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440" \
            -quality 85 \
            -y "$output" \
            -loglevel error

        if [ $? -eq 0 ]; then
            mv "$file" backup_jpg/
        fi
    fi
done

echo ""
echo "Done! Converted $count files"
