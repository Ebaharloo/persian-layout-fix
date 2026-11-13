#!/usr/bin/env bash
# Stages and packs the Plasma applet, reusing scripts/plf-fix + cli.js + mapping.js
# (one conversion implementation for extension, CLI and widget).
# ./scripts/build-kde.sh           -> dist/persian-layout-fix-1.0.0.plasmoid
# ./scripts/build-kde.sh --install -> also installs it into Plasma 6
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(sed -n 's/.*"Version": *"\([^"]*\)".*/\1/p' kde/package/metadata.json | head -1)
STAGE=dist/kde-package

rm -rf "$STAGE"
mkdir -p "$STAGE/contents/ui" "$STAGE/contents/tools"
cp kde/package/metadata.json "$STAGE/"
cp kde/package/contents/ui/main.qml "$STAGE/contents/ui/"
cp scripts/plf-fix scripts/cli.js mapping.js "$STAGE/contents/tools/"
chmod +x "$STAGE/contents/tools/plf-fix"

(cd "$STAGE" && zip -qr "../persian-layout-fix-$VERSION.plasmoid" .)
echo "dist/persian-layout-fix-$VERSION.plasmoid"

if [ "${1:-}" = "--install" ]; then
  if kpackagetool6 --type Plasma/Applet --list 2>/dev/null | grep -q persianlayoutfix; then
    kpackagetool6 --type Plasma/Applet --upgrade "$STAGE"
  else
    kpackagetool6 --type Plasma/Applet --install "$STAGE"
  fi
  echo "installed: right-click panel -> Add Widgets -> Persian Layout Fix"
fi
