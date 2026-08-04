#!/usr/bin/env bash
# Set up a local Postgres database for Klausway CMS development.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DB_NAME="${LOCAL_DB_NAME:-klausway_website}"
DB_HOST="${LOCAL_DB_HOST:-localhost}"
DB_PORT="${LOCAL_DB_PORT:-5432}"
DB_USER="${LOCAL_DB_USER:-$(whoami)}"

echo "→ Ensuring database \"$DB_NAME\" exists on $DB_HOST:$DB_PORT …"

if command -v createdb >/dev/null 2>&1; then
  if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    echo "  Database already exists."
  else
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo "  Created database."
  fi
else
  echo "  createdb not found — create the database manually, then re-run."
  exit 1
fi

LOCAL_URL="postgresql://${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "→ Pushing Prisma schema …"
DATABASE_URL="$LOCAL_URL" npx prisma db push

echo "→ Seeding blog / portfolio / team from frontend static data …"
DATABASE_URL="$LOCAL_URL" SEED_OVERWRITE="${SEED_OVERWRITE:-false}" npx tsx prisma/seed.ts

ENV_FILE="$ROOT/.env.local"
if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^DATABASE_URL=' "$ENV_FILE"; then
    # Keep a backup comment of previous remote URL if switching.
    if ! grep -q '^# LOCAL_SETUP=' "$ENV_FILE"; then
      echo "" >> "$ENV_FILE"
      echo "# LOCAL_SETUP=$(date +%Y-%m-%d) — local CMS database" >> "$ENV_FILE"
    fi
  fi
fi

cat <<EOF

✓ Local database ready.

Add / update these in .env.local:

DATABASE_URL="${LOCAL_URL}"
UPLOAD_DRIVER="local"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
JWT_SECRET="local-dev-jwt-secret"
ADMIN_SECRET="local-dev-admin-secret"

Then:
  npm run dev
  open http://localhost:3000/admin

Uploads go to public/uploads/ (gitignored). Blog, Portfolio, and Our Team
are editable in Content Studio against this local database.
EOF
