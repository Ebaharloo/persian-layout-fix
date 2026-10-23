#!/usr/bin/env bash
# Builds one package per store: Firefox (MV2) and Chrome/Edge (MV3),
# from the same shared sources.
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json | head -1)
SHARED=(mapping.js content.js background.js icons fonts README.md privacy.md)

rm -rf dist
for target in firefox chrome; do
  mkdir -p "dist/$target"
  cp -r "${SHARED[@]}" "dist/$target/"
done
cp manifest.json dist/firefox/manifest.json
cp manifest.chrome.json dist/chrome/manifest.json

(cd dist/firefox && zip -qr "../persian-layout-fix-firefox-$VERSION.zip" .)
(cd dist/chrome && zip -qr "../persian-layout-fix-chrome-$VERSION.zip" .)

echo "dist/persian-layout-fix-firefox-$VERSION.zip"
echo "dist/persian-layout-fix-chrome-$VERSION.zip"
