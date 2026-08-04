# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Next.js 15 (App Router) app** — the Klausway marketing site plus an
Admin CMS at `/admin`. It uses Prisma 6 + PostgreSQL. Standard commands live in
`package.json` and `Context.md`; only non-obvious cloud notes are captured here.

### Services

| Service | Required? | How to run | Notes |
|---------|-----------|------------|-------|
| Next.js dev server | Yes | `npm run dev` (port 3000, Turbopack) | Serves public site, `/admin`, and `app/api/*` |
| PostgreSQL 16 | Yes for CMS / DB-backed content | `sudo pg_ctlcluster 16 main start` | Installed via apt (not Docker). Public pages fall back to bundled static data in `lib/*.ts` if the DB is down, so the site renders even without Postgres |

### Startup after a fresh VM

The update script only runs `npm install`. Before running the app you must **start Postgres
manually** (it does not auto-start): `sudo pg_ctlcluster 16 main start`.

The dev DB and connection config already exist in the snapshot:
- Role/DB: `klausway` / `klausway` → database `klausway_website` on `localhost:5432`
- `.env.local` (gitignored) holds `DATABASE_URL`, `UPLOAD_DRIVER=local`, and dev
  `JWT_SECRET` / `ADMIN_SECRET`.

If `.env.local` is ever missing, recreate it from `.env.example` with
`DATABASE_URL="postgresql://klausway:klausway@localhost:5432/klausway_website"`, then run
`npm run db:push` and `npm run db:seed`. The apt-installed Postgres has no `createdb`-based
peer setup, so the repo's `npm run db:setup:local` script is **not** the path used here —
use `db:push` + `db:seed` directly (they read `.env.local` via `dotenv-cli`).

### Lint / typecheck / build

- **Lint is NOT configured** in this repo (no ESLint config or dependency). `npm run lint`
  (`next lint`) only launches an interactive setup prompt and will hang non-interactively.
  Use `npx tsc --noEmit` for static type checking instead.
- Build: `npm run build` (server mode). Do NOT run a build while `npm run dev` is running —
  the `prebuild` hook fails on purpose if a dev server is detected. `npm run build:pages`
  produces the static GitHub Pages export (no API/DB/admin).

### CMS / gotchas

- `next.config.ts` sets `trailingSlash: true`, so `/blog` and `/admin` 308-redirect to the
  trailing-slash URL, and client API calls use trailing slashes. `/blog` renders at
  `/resources` in the UI.
- Admin bootstrap: first visit to `/admin` shows a "set up your first admin" form (works
  while `AdminUser` count is 0). After that, log in normally; CRUD uses a Bearer JWT.
- Uploads use the local-disk driver by default (`public/uploads/`, gitignored). S3, Resend
  (contact email), and the Vapi chat widget are optional external services — the app runs
  fine without them.
