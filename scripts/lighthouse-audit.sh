#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
ROUTES=(
  "/"
  "/work"
  "/corporate"
  "/corporate/mission-and-tactical"
  "/weddings"
  "/about"
  "/pricing"
  "/contact"
)

mkdir -p .lighthouse
for route in "${ROUTES[@]}"; do
  name=$(echo "$route" | sed 's|/|_|g' | sed 's|^_|root|')
  npx lighthouse "${BASE_URL}${route}" \
    --output=html --output=json \
    --output-path=".lighthouse/${name}" \
    --chrome-flags="--headless" \
    --preset=desktop \
    --quiet
done
echo "Lighthouse audits complete. Reports in .lighthouse/"
