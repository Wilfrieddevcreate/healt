#!/bin/sh
set -e

# Render startup script:
# 1. Run pending migrations (DB lives on a persistent volume)
# 2. Start the Next.js standalone server

DB_DIR=$(dirname "${DATABASE_URL#file:}")
mkdir -p "$DB_DIR" 2>/dev/null || true

echo "→ Running migrations against ${DATABASE_URL}"
node ./scripts/migrate.mjs

echo "→ Starting Next.js server on port ${PORT:-3000}"
exec node server.js
