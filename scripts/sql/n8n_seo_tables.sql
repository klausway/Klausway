-- Weekly SEO Monitor tables (also managed via Prisma: N8nSeoReport, N8nSeoAlertState, N8nSeoRobotsSnapshot)
-- Apply with: npx dotenv -e .env -- npx prisma db push
-- Or run this SQL against klausway_website.

CREATE TABLE IF NOT EXISTS n8n_seo_reports (
  id TEXT PRIMARY KEY,
  execution_id TEXT NOT NULL UNIQUE,
  report_date DATE NOT NULL,
  sites TEXT[] NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metrics_json JSONB NOT NULL,
  issues_json JSONB NOT NULL,
  recommendations_json JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS n8n_seo_alert_state (
  id TEXT PRIMARY KEY,
  issue_key TEXT NOT NULL UNIQUE,
  site_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  last_alerted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  details_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS n8n_seo_alert_state_site_id_idx
  ON n8n_seo_alert_state (site_id);

CREATE TABLE IF NOT EXISTS n8n_seo_robots_snapshots (
  site_id TEXT PRIMARY KEY,
  robots_hash TEXT NOT NULL,
  robots_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
