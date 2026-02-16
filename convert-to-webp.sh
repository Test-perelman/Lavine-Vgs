#!/bin/bash

echo "========================================"
echo "Converting JPG frames to High-Res WebP"
echo "========================================"
echo ""

# Navigate to frames directory
cd "d:/Interior Design - Version 3 - Vgs- Antigravity/public/scroll_animation_frames" || exit

echo "Current directory: $(pwd)"
echo ""

# Create backup folder
mkdir -p backup_jpg
echo "Created backup folder..."
echo ""

# Count files
count=$(ls ezgif-frame-*.jpg 2>/dev/null | wc -l)
echo "Found $count JPG frames to convert"
echo ""
echo "Converting to 2560x1440 WebP with quality 85..."
echo ""

# Counter
current=0

# Convert each JPG to WebP
for file in ezgif-frame-*.jpg; do
    if [ -f "$file" ]; then
        current=$((current + 1))
        basename="${file%.jpg}"
        output="${basename}.webp"

        echo "[$current/$count] Converting $file..."

        # Convert to 2560x1440 WebP with high quality
        ffmpeg -i "$file" \
            -vf "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440" \
            -quality 85 \
            -y "$output" \
            -loglevel error

        # Check if conversion was successful
        if [ $? -eq 0 ]; then
            # Move original JPG to backup
            mv "$file" backup_jpg/
        else
            echo "  ERROR converting $file"
        fi
    fi
done

echo ""
echo "========================================"
echo "Conversion Complete!"
echo "========================================"
echo ""
echo "New files: WebP at 2560x1440 (85% quality)"
echo "Original JPGs backed up to: backup_jpg/"
echo ""

# Show file size comparison
webp_size=$(du -sh *.webp 2>/dev/null | cut -f1)
echo "Total WebP size: $webp_size"
echo ""
