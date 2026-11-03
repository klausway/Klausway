#!/usr/bin/env bash
# Static GitHub Pages export — API / QR / legacy blog routes require a server
# and are moved aside for this build only. force-dynamic is rewritten to
# force-static so Next can prerender (segment config must be a string literal).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STASH=".pages-build-stash"
rm -rf "$STASH"
mkdir -p "$STASH"

DYNAMIC_FILES=(
  app/about/page.tsx
  app/portfolio/page.tsx
  app/portfolio/[slug]/page.tsx
  app/resources/page.tsx
  app/resources/[slug]/page.tsx
)

restore() {
  for name in api q blog; do
    if [[ -d "$STASH/$name" ]]; then
      rm -rf "app/$name"
      mv "$STASH/$name" "app/$name"
    fi
  done
  for file in "${DYNAMIC_FILES[@]}"; do
    if [[ -f "$file" ]]; then
      sed -i.bak 's/export const dynamic = "force-static"/export const dynamic = "force-dynamic"/' "$file"
      rm -f "${file}.bak"
    fi
  done
  rmdir "$STASH" 2>/dev/null || true
}
trap restore EXIT

for name in api q blog; do
  if [[ -e "app/$name" ]]; then
    mv "app/$name" "$STASH/$name"
  fi
done

for file in "${DYNAMIC_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    sed -i.bak 's/export const dynamic = "force-dynamic"/export const dynamic = "force-static"/' "$file"
    rm -f "${file}.bak"
  fi
done

# Prerender from bundled static data (no live DB on GitHub Pages).
unset DATABASE_URL || true
export GITHUB_PAGES=true

npx next build
