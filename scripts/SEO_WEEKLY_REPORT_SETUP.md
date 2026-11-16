# Klausway — Weekly SEO Monitor (n8n)

n8n workflow that emails a Monday **9:00 AM America/New_York** SEO report to **support@klausway.com** (override with `SEO_REPORT_TO`).

Safe self-fix: before health/GSC analysis it fills **empty** `BlogPost.metaTitle` / `metaDescription` from title / excerpt only (never overwrites custom values). One-shot local backfill: `node --env-file=.env scripts/backfill-blog-seo-meta.js`.

Files:

| File | Purpose |
|------|---------|
| `scripts/n8n-seo-weekly-report-workflow.json` | Importable workflow JSON |
| `scripts/create-n8n-seo-weekly-report.js` | Upsert via Public API + rewrite JSON (`--activate` to leave on) |
| `scripts/backfill-blog-seo-meta.js` | One-shot CMS meta backfill |
| `scripts/sql/n8n_seo_tables.sql` | Postgres DDL (also in Prisma) |
| Prisma models `N8nSeoReport`, `N8nSeoAlertState`, `N8nSeoRobotsSnapshot` | History + alert dedupe + robots hash |

## 1. Credentials and permissions

### Already on n8n.klausway.app (reused)

| Credential | Name | Used for |
|------------|------|----------|
| SMTP | `no-reply@klauslarsen.com` | Weekly + urgent email |
| OpenAI | `OpenAi account` | Recommendations |
| Postgres | `Klausway Website Postgres` | Report history / alerts / robots snapshots |

### You must create: Google Search Console OAuth

1. In [Google Cloud Console](https://console.cloud.google.com/), enable **Google Search Console API**.
2. Create an OAuth 2.0 Client (Web application).
3. Add the n8n redirect URL from **n8n → Credentials → Google OAuth2 → redirect URL** (typically `https://n8n.klausway.app/rest/oauth2-credential/callback`).
4. In n8n: **Credentials → Add → Google OAuth2 API** (or Google Search Console if offered).
5. Scopes: at least  
   `https://www.googleapis.com/auth/webmasters.readonly`
6. Connect with a Google account that is **Owner** or **Full** user on each Search Console property you want to monitor:
   - Domain property `klausway.com` (or URL-prefix `https://www.klausway.com/`)
   - Domain property `work-nex.com` (or URL-prefix `https://www.work-nex.com/`) if you want Worknex in the report
7. Copy the credential id from n8n (URL or API) into env `GSC_N8N_CREDENTIAL_ID`, **or** open the workflow and select that credential on the **GSC Search Analytics** node.

### Database

Tables should already exist after `prisma db push`. To apply manually:

```bash
npx dotenv -e .env -- npx prisma db push
# or run scripts/sql/n8n_seo_tables.sql against klausway_website
```

### Optional env (n8n host and/or laptop `.env`)

```bash
SEO_REPORT_TO=support@klausway.com   # default already; set only to override
GSC_N8N_CREDENTIAL_ID=               # n8n Google OAuth credential id
N8N_BASE_URL=https://n8n.klausway.app
N8N_API_KEY=                         # for create script only
```

## 2. Import / create the workflow

### Option A — Import JSON (UI)

1. n8n → **Workflows → Import from File**
2. Select `scripts/n8n-seo-weekly-report-workflow.json`
3. Leave the workflow **inactive**
4. Open **GSC Search Analytics** → set Google OAuth credential
5. Confirm SMTP / OpenAI / Postgres credentials on their nodes if prompted

### Option B — API script

```bash
# After GSC credential exists:
GSC_N8N_CREDENTIAL_ID=your_cred_id node --env-file=.env scripts/create-n8n-seo-weekly-report.js

# JSON only:
node --env-file=.env scripts/create-n8n-seo-weekly-report.js --dry-run
```

The script **never activates** the workflow. If a copy was active, it deactivates it.

## 3. Configure sites and thresholds

Edit the **Config** code node (or re-run the create script after changing defaults in `create-n8n-seo-weekly-report.js`):

- `properties[]` — `gscSiteUrl`, `baseUrl`, `sitemapUrl`, `priorityPaths`
- `lookbackDays` / `compareDays` / `dataDelayDays` (default 28 / 28 / 3)
- `maxPagesToCheck` (default 25)
- `minImpressionsForLowCtr` / `lowCtrThreshold`
- `urgentEnabled` / `urgentRetryDelaySec`
- `reportTo` — defaults to `support@klausway.com`, overridden by `SEO_REPORT_TO` when set in the n8n process environment

Only properties listed in Config are queried. If GSC access is missing for a property, the report marks GSC as failed for that site and **does not** claim the site is healthy.

## 4. Manual test (no schedule)

1. Keep the workflow **inactive** so Monday cron does not fire yet.
2. Activate **only** long enough to register the webhook, or use **Execute workflow** from the editor after connecting GSC.
3. Preferred test path:  
   `POST https://n8n.klausway.app/webhook/seo-weekly-report-test`  
   with body `{}` (workflow must be active for production webhook; for inactive use **Test URL** from the Webhook node in the editor).
4. Check the execution:
   - GSC nodes return rows or clear errors
   - Health checks finish
   - Email arrives at **support@klausway.com**
   - Row appears in `n8n_seo_reports` (`ON CONFLICT execution_id` avoids duplicates on retry)
5. Review the email sections: summary, search performance, health, recommendations, content ideas, limitations.

**Do not** treat a first test send as “production approval.” Disable the workflow again after testing if you are not ready for Mondays.

## 5. Activate the weekly schedule

After you approve a test email:

1. Open **Klausway — Weekly SEO Monitor**
2. Confirm Config `reportTo` / sites / thresholds / `metaBackfillEnabled`
3. Toggle **Active**, or re-run:
   `node --env-file=.env scripts/create-n8n-seo-weekly-report.js --activate`
4. Schedule: cron `0 9 * * 1` in workflow timezone `America/New_York` (Monday 9:00 AM ET)

To pause: deactivate the workflow.

## 6. What the report includes

1. Executive summary (AI + status)
2. Search performance — clicks, impressions, CTR, position; current vs previous 28 days
3. Top pages / queries with real numbers
4. Website health — errors/warnings or “no checked issues” for the **sample**
5. Top recommended actions (≤ 5) with evidence and verification flags
6. Content ideas (≤ 3, only when data-backed)
7. Limitations — failed GSC/health, sampling, GSC lag, no guaranteed rankings

Urgent path (optional): homepage/sitemap critical failures → wait/retry → separate alert email → `n8n_seo_alert_state` dedupe until resolved.

## 7. Limitations and assumptions

- GSC data for the most recent days is incomplete; `dataDelayDays` excludes them.
- Health checks sample priority URLs + sitemap locs (cap `maxPagesToCheck`), not every URL.
- `robots.txt` allow for `OAI-SearchBot` is a heuristic; CDN/WAF bot rules need a separate hosting review.
- Worknex appears in the report only if its GSC property is connected to the same Google OAuth account and listed in Config.
- AI must not invent pricing, customers, or product claims; drafts still need human review.
- SMTP from address is `no-reply@klauslarsen.com` (existing credential). Recipient is `support@klausway.com` by default.
- This setup does **not** change live site files, firewall, or indexing settings.

## 8. Troubleshooting

| Symptom | Check |
|---------|--------|
| GSC 403 / unauthorized | OAuth scopes; property access; `gscSiteUrl` matches GSC (`sc-domain:…` vs URL-prefix) |
| No email | SMTP credential; spam; `reportTo` / `SEO_REPORT_TO` |
| Duplicate weekly emails | Only one active workflow; schedule timezone |
| Empty health | Sitemap/robots reachable from the n8n host |
| Postgres errors | `prisma db push` / tables exist; credential points at `klausway_website` |
