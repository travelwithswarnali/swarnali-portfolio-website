#!/bin/bash
# ═══════════════════════════════════════════════════
# Roll No. 24 — Asset Downloader
# Run this once to grab all remote images locally.
# Usage: chmod +x download-assets.sh && ./download-assets.sh
# ═══════════════════════════════════════════════════

ASSETS_DIR="$(dirname "$0")/assets"
mkdir -p "$ASSETS_DIR"

echo "⏳ Downloading hero image..."
curl -sL -o "$ASSETS_DIR/commercial.jpg" \
  "https://id-preview--5f8b891e-cf12-4865-89f7-0bb48db632ee.lovable.app/assets/commercial-BkV7ADDd.jpg"

if [ -s "$ASSETS_DIR/commercial.jpg" ]; then
  echo "✅ commercial.jpg downloaded ($(du -h "$ASSETS_DIR/commercial.jpg" | cut -f1))"
else
  echo "⚠️  Download failed. Try manually:"
  echo "    Open this URL in your browser and Save As → assets/commercial.jpg"
  echo "    https://id-preview--5f8b891e-cf12-4865-89f7-0bb48db632ee.lovable.app/assets/commercial-BkV7ADDd.jpg"
fi

echo ""
echo "🎬 Done! Open index.html in your browser to view the site."
echo "   (If the image didn't download, the page will auto-fallback to the remote URL)"
