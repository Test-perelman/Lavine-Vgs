#!/bin/bash

FFMPEG="/c/Users/swaga/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe"

cd "d:/Interior Design - Version 3 - Vgs- Antigravity/public/scroll_animation_frames"

# Create backup of current 2K WebP files
mkdir -p backup_2k_webp
echo "Backing up current 2K WebP files..."
mv *.webp backup_2k_webp/ 2>/dev/null
echo ""

# Count files
total=$(ls backup_jpg/ezgif-frame-*.jpg 2>/dev/null | wc -l)

echo "Converting $total files to 4K (3840x2160) WebP..."
echo "Quality: 90% (higher quality for 4K)"
echo ""

count=0

for file in backup_jpg/ezgif-frame-*.jpg; do
    if [ -f "$file" ]; then
        count=$((count + 1))
        filename=$(basename "$file" .jpg)
        output="${filename}.webp"

        echo "[$count/$total] Converting to 4K: $filename"

        # Convert to 4K with high quality
        "$FFMPEG" -i "$file" \
            -vf "scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160" \
            -quality 90 \
            -y "$output" \
            -loglevel error

        if [ $? -ne 0 ]; then
            echo "  ERROR converting $filename"
        fi
    fi
done

echo ""
echo "========================================"
echo "4K Conversion Complete!"
echo "========================================"
echo ""
echo "New files: WebP at 3840x2160 (4K)"
echo "Old 2K WebP backed up to: backup_2k_webp/"
echo ""

# Show file size
webp_size=$(du -sh . 2>/dev/null | cut -f1)
echo "Total folder size: $webp_size"
echo ""
