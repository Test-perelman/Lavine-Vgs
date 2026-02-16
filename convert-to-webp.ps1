# PowerShell Script to Convert JPG frames to High-Res WebP
Write-Host "========================================"
Write-Host "Converting JPG frames to High-Res WebP"
Write-Host "========================================"
Write-Host ""

# Set the frames directory
$framesDir = "d:\Interior Design - Version 3 - Vgs- Antigravity\public\scroll_animation_frames"
Set-Location $framesDir

Write-Host "Current directory: $framesDir"
Write-Host ""

# Create backup folder
$backupDir = Join-Path $framesDir "backup_jpg"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "Created backup folder..."
}
Write-Host ""

# Get all JPG files
$jpgFiles = Get-ChildItem -Path $framesDir -Filter "ezgif-frame-*.jpg"
$totalFiles = $jpgFiles.Count

Write-Host "Found $totalFiles JPG frames to convert"
Write-Host ""
Write-Host "Converting to 2560x1440 WebP with quality 85..."
Write-Host ""

# Progress counter
$current = 0

foreach ($file in $jpgFiles) {
    $current++
    $baseName = $file.BaseName
    $outputFile = Join-Path $framesDir "$baseName.webp"

    Write-Host "[$current/$totalFiles] Converting $($file.Name)..."

    # Convert to 2560x1440 WebP with high quality
    # Using scale to upscale and maintain aspect ratio
    $ffmpegArgs = @(
        "-i", $file.FullName,
        "-vf", "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440",
        "-quality", "85",
        "-y",
        $outputFile
    )

    # Run FFmpeg
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru -RedirectStandardError "NUL"

    if ($process.ExitCode -eq 0) {
        # Move original JPG to backup
        Move-Item -Path $file.FullName -Destination $backupDir -Force
    } else {
        Write-Host "  ERROR converting $($file.Name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Conversion Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "New files: WebP at 2560x1440 (85% quality)"
Write-Host "Original JPGs backed up to: backup_jpg\"
Write-Host ""

# Show file size comparison
$webpFiles = Get-ChildItem -Path $framesDir -Filter "*.webp"
$totalWebpSize = ($webpFiles | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Total WebP size: $([math]::Round($totalWebpSize, 2)) MB"
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
