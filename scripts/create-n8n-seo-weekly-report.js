/**
 * Creates / updates the Klausway Weekly SEO Monitor workflow in n8n
 * and writes scripts/n8n-seo-weekly-report-workflow.json.
 *
 * Usage:
 *   node --env-file=.env scripts/create-n8n-seo-weekly-report.js
 *   node --env-file=.env scripts/create-n8n-seo-weekly-report.js --dry-run
 *
 * Optional env:
 *   GSC_N8N_CREDENTIAL_ID  — n8n Google OAuth2 credential id with webmasters.readonly
 *   SEO_REPORT_TO          — override default support@klausway.com (also readable at runtime)
 *
 * Does NOT activate the workflow or send email.
 */
const fs = require("fs");
const path = require("path");

const N8N_URL = (
  process.env.n8n_url ||
  process.env.N8N_URL ||
  process.env.N8N_BASE_URL ||
  ""
)
  .replace(/^"|"$/g, "")
  .replace(/\/$/, "");
const API_KEY = (
  process.env.n8n_api_key ||
  process.env.N8N_API_KEY ||
  ""
).replace(/^"|"$/g, "");
const GSC_CRED_ID = (process.env.GSC_N8N_CREDENTIAL_ID || "").replace(
  /^"|"$/g,
  "",
);
const DRY_RUN = process.argv.includes("--dry-run");

const WORKFLOW_NAME = "Klausway — Weekly SEO Monitor";

const CREDS = {
  postgres: { id: "gkDTjnaiYMJ6dDdr", name: "Klausway Website Postgres" },
  openAi: { id: "wksEFndmlSjEMyop", name: "OpenAi account" },
  smtp: { id: "mTYHf3hI2i3EA8CL", name: "no-reply@klauslarsen.com" },
  gsc: GSC_CRED_ID
    ? { id: GSC_CRED_ID, name: "Google Search Console" }
    : { id: "", name: "Google Search Console" },
};

function gscCredBlock() {
  if (!CREDS.gsc.id) return undefined;
  return {
    googleOAuth2Api: {
      id: CREDS.gsc.id,
      name: CREDS.gsc.name,
    },
  };
}

const CONFIG_CODE = `const envTo = (typeof process !== 'undefined' && process.env && process.env.SEO_REPORT_TO)
  ? String(process.env.SEO_REPORT_TO).trim()
  : '';
const reportTo = envTo || 'support@klausway.com';

const now = new Date();
// Approximate "today" in America/New_York for period math
const fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
});
const todayEt = fmt.format(now); // YYYY-MM-DD

function addDays(iso, days) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const dataDelayDays = 3;
const lookbackDays = 28;
const periodEnd = addDays(todayEt, -dataDelayDays);
const periodStart = addDays(periodEnd, -lookbackDays + 1);
const prevEnd = addDays(periodStart, -1);
const prevStart = addDays(prevEnd, -lookbackDays + 1);

const properties = [
  {
    id: 'klausway',
    label: 'Klaus Way',
    gscSiteUrl: 'sc-domain:klausway.com',
    baseUrl: 'https://www.klausway.com',
    sitemapUrl: 'https://www.klausway.com/sitemap.xml',
    robotsUrl: 'https://www.klausway.com/robots.txt',
    priorityPaths: ['/', '/contact/', '/resources/', '/products/', '/about/', '/apps/', '/solutions/'],
  },
  {
    id: 'worknex',
    label: 'Worknex',
    gscSiteUrl: 'sc-domain:work-nex.com',
    baseUrl: 'https://www.work-nex.com',
    sitemapUrl: 'https://www.work-nex.com/sitemap.xml',
    robotsUrl: 'https://www.work-nex.com/robots.txt',
    priorityPaths: ['/'],
  },
];

return [{
  json: {
    reportTo,
    timezone: 'America/New_York',
    lookbackDays,
    compareDays: lookbackDays,
    dataDelayDays,
    periodStart,
    periodEnd,
    prevStart,
    prevEnd,
    maxPagesToCheck: 25,
    requestDelayMs: 400,
    minImpressionsForLowCtr: 100,
    lowCtrThreshold: 0.02,
    urgentEnabled: true,
    urgentRetryDelaySec: 60,
    properties,
    companyContext: {
      klausway: 'Klaus Way Technology builds purpose-built software and IT services — WorkNex, custom apps, system integration, automation, and cloud. Site: https://www.klausway.com/',
      worknex: 'Worknex is Klaus Way\\'s operations / CRM product site at https://www.work-nex.com/. Do not invent pricing, customers, or features beyond what page content shows.',
    },
    executionId: $execution.id,
    reportDate: todayEt,
  }
}];`;

const BUILD_GSC_REQUESTS_CODE = `const cfg = $('Config').first().json;
const rows = [];
for (const site of cfg.properties) {
  const encoded = encodeURIComponent(site.gscSiteUrl);
  const endpoint = \`https://www.googleapis.com/webmasters/v3/sites/\${encoded}/searchAnalytics/query\`;
  const periods = [
    { key: 'current', startDate: cfg.periodStart, endDate: cfg.periodEnd },
    { key: 'previous', startDate: cfg.prevStart, endDate: cfg.prevEnd },
  ];
  const dims = [
    { name: 'aggregate', dimensions: [] },
    { name: 'page', dimensions: ['page'] },
    { name: 'query', dimensions: ['query'] },
  ];
  for (const p of periods) {
    for (const d of dims) {
      rows.push({
        json: {
          siteId: site.id,
          siteLabel: site.label,
          gscSiteUrl: site.gscSiteUrl,
          periodKey: p.key,
          dimKey: d.name,
          requestUrl: endpoint,
          body: {
            startDate: p.startDate,
            endDate: p.endDate,
            dimensions: d.dimensions,
            rowLimit: d.name === 'aggregate' ? 1 : 250,
            startRow: 0,
          },
        },
      });
    }
  }
}
return rows;`;

const ANALYZE_GSC_CODE = `const cfg = $('Config').first().json;
const items = $input.all();
const bySite = {};

function ensure(siteId) {
  if (!bySite[siteId]) {
    bySite[siteId] = {
      siteId,
      gscStatus: 'ok',
      gscError: null,
      current: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      previous: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      pagesCurrent: [],
      pagesPrevious: [],
      queriesCurrent: [],
      queriesPrevious: [],
    };
  }
  return bySite[siteId];
}

for (const item of items) {
  const meta = item.json;
  const site = ensure(meta.siteId || meta.siteLabel || 'unknown');
  if (meta.error || meta.message === 'Unauthorized' || (meta.error && meta.error.message)) {
    site.gscStatus = 'error';
    site.gscError = meta.error?.message || meta.message || JSON.stringify(meta).slice(0, 300);
    continue;
  }
  // n8n HTTP may nest response under body or return rows at top level
  const rows = Array.isArray(meta.rows)
    ? meta.rows
    : (Array.isArray(meta.body?.rows) ? meta.body.rows : []);
  const periodKey = meta.periodKey;
  const dimKey = meta.dimKey;
  if (!periodKey || !dimKey) {
    // Response-only items: try paired metadata from binary/pairedItem — skip if missing
    continue;
  }
  if (dimKey === 'aggregate') {
    const r = rows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    site[periodKey] = {
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    };
  } else if (dimKey === 'page') {
    const mapped = rows.map((r) => ({
      page: r.keys?.[0] || '',
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    }));
    if (periodKey === 'current') site.pagesCurrent = mapped;
    else site.pagesPrevious = mapped;
  } else if (dimKey === 'query') {
    const mapped = rows.map((r) => ({
      query: r.keys?.[0] || '',
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    }));
    if (periodKey === 'current') site.queriesCurrent = mapped;
    else site.queriesPrevious = mapped;
  }
}

// Re-parse using paired request metadata stored on each item
const rebuilt = {};
for (const item of items) {
  const j = item.json;
  const siteId = j.siteId;
  if (!siteId) continue;
  if (!rebuilt[siteId]) {
    rebuilt[siteId] = {
      siteId,
      siteLabel: j.siteLabel,
      gscSiteUrl: j.gscSiteUrl,
      gscStatus: 'ok',
      gscError: null,
      current: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      previous: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
      pagesCurrent: [],
      pagesPrevious: [],
      queriesCurrent: [],
      queriesPrevious: [],
    };
  }
  const site = rebuilt[siteId];
  const errMsg = j.error?.message || (typeof j.error === 'string' ? j.error : null);
  if (errMsg || j.httpCode >= 400) {
    site.gscStatus = 'error';
    site.gscError = errMsg || \`HTTP \${j.httpCode}\`;
    continue;
  }
  const rows = Array.isArray(j.rows) ? j.rows : [];
  const periodKey = j.periodKey;
  const dimKey = j.dimKey;
  if (dimKey === 'aggregate') {
    const r = rows[0] || {};
    site[periodKey] = {
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    };
  } else if (dimKey === 'page') {
    const mapped = rows.map((r) => ({
      page: r.keys?.[0] || '',
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    }));
    if (periodKey === 'current') site.pagesCurrent = mapped;
    else site.pagesPrevious = mapped;
  } else if (dimKey === 'query') {
    const mapped = rows.map((r) => ({
      query: r.keys?.[0] || '',
      clicks: Number(r.clicks || 0),
      impressions: Number(r.impressions || 0),
      ctr: Number(r.ctr || 0),
      position: Number(r.position || 0),
    }));
    if (periodKey === 'current') site.queriesCurrent = mapped;
    else site.queriesPrevious = mapped;
  }
}

function indexBy(arr, key) {
  const m = new Map();
  for (const row of arr) m.set(row[key], row);
  return m;
}

const insights = [];
for (const site of Object.values(rebuilt)) {
  const prevPages = indexBy(site.pagesPrevious, 'page');
  const pageDeltas = site.pagesCurrent.map((p) => {
    const prev = prevPages.get(p.page) || { clicks: 0, impressions: 0 };
    return { ...p, clicksDelta: p.clicks - prev.clicks, impressionsDelta: p.impressions - prev.impressions };
  });
  const gainers = [...pageDeltas].sort((a, b) => b.clicksDelta - a.clicksDelta).slice(0, 5);
  const losers = [...pageDeltas].sort((a, b) => a.clicksDelta - b.clicksDelta).slice(0, 5);
  const lowCtr = site.pagesCurrent
    .filter((p) => p.impressions >= cfg.minImpressionsForLowCtr && p.ctr < cfg.lowCtrThreshold)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8)
    .map((p) => ({ ...p, note: 'Meaningful impressions with relatively low CTR — investigate title/description/intent fit; not proof of a ranking problem.' }));

  const prevQueries = indexBy(site.queriesPrevious, 'query');
  const queryDeltas = site.queriesCurrent.map((q) => {
    const prev = prevQueries.get(q.query) || { clicks: 0 };
    return { ...q, clicksDelta: q.clicks - prev.clicks };
  });
  const topQueries = [...site.queriesCurrent].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
  const risingQueries = [...queryDeltas].sort((a, b) => b.clicksDelta - a.clicksDelta).slice(0, 5);

  insights.push({
    ...site,
    clicksDelta: site.current.clicks - site.previous.clicks,
    impressionsDelta: site.current.impressions - site.previous.impressions,
    topPages: [...site.pagesCurrent].sort((a, b) => b.clicks - a.clicks).slice(0, 8),
    gainers,
    losers,
    lowCtrCandidates: lowCtr,
    topQueries,
    risingQueries,
  });
}

return [{ json: { gscInsights: insights, periodStart: cfg.periodStart, periodEnd: cfg.periodEnd, prevStart: cfg.prevStart, prevEnd: cfg.prevEnd } }];`;

const HEALTH_CHECK_CODE = `const cfg = $('Config').first().json;
const crypto = require('crypto');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hash(text) {
  return crypto.createHash('sha256').update(text || '').digest('hex');
}

function extractMeta(html) {
  const title = (html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i) || [])[1]?.replace(/\\s+/g, ' ').trim() || '';
  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
    || [])[1]?.trim() || '';
  const robots = (html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i)
    || [])[1]?.toLowerCase() || '';
  return { title, description: desc, robots };
}

function parseRobots(text) {
  const lines = String(text || '').split(/\\n/);
  let agent = '*';
  const rules = { '*': { allow: [], disallow: [] }, 'OAI-SearchBot': { allow: [], disallow: [] } };
  for (const raw of lines) {
    const line = raw.split('#')[0].trim();
    if (!line) continue;
    const m = line.match(/^(user-agent|allow|disallow)\\s*:\\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      agent = val;
      if (!rules[agent]) rules[agent] = { allow: [], disallow: [] };
    } else if (key === 'allow') {
      (rules[agent] || (rules[agent] = { allow: [], disallow: [] })).allow.push(val);
    } else if (key === 'disallow') {
      (rules[agent] || (rules[agent] = { allow: [], disallow: [] })).disallow.push(val);
    }
  }
  return rules;
}

function oaiAllowed(rules) {
  const oai = rules['OAI-SearchBot'] || rules['oai-searchbot'];
  if (oai) {
    if (oai.disallow.includes('/')) return false;
    return true;
  }
  const star = rules['*'] || { disallow: [] };
  if (star.disallow.includes('/')) return false;
  return true;
}

async function fetchText(url, opts = {}) {
  try {
    const res = await this.helpers.httpRequest({
      method: 'GET',
      url,
      returnFullResponse: true,
      ignoreHttpStatusErrors: true,
      timeout: 20000,
      headers: { 'User-Agent': 'KlausWaySeoMonitor/1.0 (+https://www.klausway.com/)' },
      ...opts,
    });
    const status = res.statusCode || res.status || 0;
    const body = typeof res.body === 'string' ? res.body : (res.data || '');
    const headers = res.headers || {};
    return { ok: status >= 200 && status < 400, status, body: String(body || ''), headers, error: null };
  } catch (e) {
    return { ok: false, status: 0, body: '', headers: {}, error: e.message || String(e) };
  }
}

function sitemapLocs(xml) {
  const locs = [];
  const re = /<loc>\\s*([^<]+)\\s*<\\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) && locs.length < 500) locs.push(m[1].trim());
  return locs;
}

const snapshots = {};
try {
  for (const row of $('Load Robots Snapshots').all()) {
    if (row.json.site_id) snapshots[row.json.site_id] = row.json;
  }
} catch (_) {}

const results = [];
for (const site of cfg.properties) {
  const issues = [];
  const critical = [];
  let healthStatus = 'ok';
  const baseHost = new URL(site.baseUrl).host;

  const robotsRes = await fetchText.call(this, site.robotsUrl);
  await sleep(cfg.requestDelayMs);
  let robotsChanged = false;
  let oaiOk = null;
  let robotsHash = null;
  if (!robotsRes.ok) {
    healthStatus = 'error';
    issues.push({ severity: 'error', code: 'robots_unreachable', message: \`robots.txt fetch failed (\${robotsRes.status || robotsRes.error})\` });
  } else {
    robotsHash = hash(robotsRes.body);
    const prev = snapshots[site.id];
    if (prev && prev.robots_hash && prev.robots_hash !== robotsHash) {
      robotsChanged = true;
      issues.push({ severity: 'warning', code: 'robots_changed', message: 'robots.txt content changed since last snapshot — review manually.' });
    }
    const rules = parseRobots(robotsRes.body);
    oaiOk = oaiAllowed(rules);
    if (!oaiOk) {
      issues.push({ severity: 'warning', code: 'oai_disallow', message: 'robots.txt appears to disallow OAI-SearchBot or all bots on /. Confirm in Search Console / hosting — HTTP alone cannot prove CDN allowlisting.' });
    } else {
      issues.push({ severity: 'info', code: 'oai_allow_heuristic', message: 'robots.txt appears to allow OAI-SearchBot on public paths. CDN/WAF bot policies need a separate hosting review.' });
    }
  }

  const smRes = await fetchText.call(this, site.sitemapUrl);
  await sleep(cfg.requestDelayMs);
  let locs = [];
  if (!smRes.ok) {
    healthStatus = 'error';
    critical.push({ severity: 'critical', code: 'sitemap_down', message: \`Sitemap unreachable (\${smRes.status || smRes.error})\`, issueKey: \`sitemap:\${site.id}\` });
    issues.push(critical[critical.length - 1]);
  } else {
    locs = sitemapLocs(smRes.body);
    if (!locs.length) {
      issues.push({ severity: 'warning', code: 'sitemap_empty', message: 'Sitemap returned no <loc> URLs.' });
    }
  }

  const priorityUrls = site.priorityPaths.map((p) => new URL(p, site.baseUrl).toString());
  const sample = [];
  const seen = new Set();
  for (const u of [...priorityUrls, ...locs]) {
    if (seen.has(u)) continue;
    try {
      if (new URL(u).host !== baseHost && !new URL(u).host.endsWith(baseHost.replace(/^www\\./, ''))) continue;
    } catch { continue; }
    seen.add(u);
    sample.push(u);
    if (sample.length >= cfg.maxPagesToCheck) break;
  }

  const titles = new Map();
  const pageReports = [];
  for (const url of sample) {
    const res = await fetchText.call(this, url, { redirect: 'manual' });
    await sleep(cfg.requestDelayMs);
    const status = res.status;
    const loc = res.headers.location || res.headers.Location;
    if (status >= 300 && status < 400 && loc) {
      try {
        const dest = new URL(loc, url);
        if (dest.host !== baseHost && !dest.href.startsWith(site.baseUrl)) {
          issues.push({ severity: 'warning', code: 'unexpected_redirect', url, message: \`Redirects off-host to \${dest.href}\` });
        }
      } catch {}
    }
    if (status >= 400 || status === 0) {
      const issue = { severity: status >= 500 || status === 0 ? 'critical' : 'error', code: 'http_error', url, message: \`HTTP \${status || 'error'}: \${res.error || ''}\`, issueKey: \`http:\${site.id}:\${url}\` };
      issues.push(issue);
      if (issue.severity === 'critical' && (url === site.baseUrl || url === site.baseUrl + '/')) critical.push(issue);
      if (status >= 500 || status === 0) healthStatus = 'error';
      pageReports.push({ url, status, error: res.error });
      continue;
    }
    if (status >= 200 && status < 300) {
      const meta = extractMeta(res.body);
      if (!meta.title) issues.push({ severity: 'warning', code: 'missing_title', url, message: 'Missing <title>' });
      if (!meta.description) issues.push({ severity: 'warning', code: 'missing_description', url, message: 'Missing meta description' });
      if (meta.robots.includes('noindex')) issues.push({ severity: 'warning', code: 'noindex', url, message: \`Unexpected noindex: \${meta.robots}\` });
      if (meta.title) {
        if (!titles.has(meta.title)) titles.set(meta.title, []);
        titles.get(meta.title).push(url);
      }
      pageReports.push({ url, status, title: meta.title, description: meta.description, robots: meta.robots });
    }
  }
  for (const [title, urls] of titles.entries()) {
    if (urls.length > 1) {
      issues.push({ severity: 'warning', code: 'duplicate_title', message: \`Duplicate title "\${title.slice(0, 80)}" on \${urls.length} pages\`, urls });
    }
  }

  results.push({
    siteId: site.id,
    siteLabel: site.label,
    baseUrl: site.baseUrl,
    healthStatus,
    robotsHash,
    robotsText: robotsRes.ok ? robotsRes.body.slice(0, 20000) : null,
    robotsChanged,
    oaiSearchBotAllowedHeuristic: oaiOk,
    sitemapOk: smRes.ok,
    pagesChecked: pageReports.length,
    issues,
    critical,
    pageReports: pageReports.slice(0, 40),
  });
}

return [{ json: { health: results } }];`;

const MERGE_CODE = `const cfg = $('Config').first().json;
let gsc = { gscInsights: [] };
try { gsc = $('Analyze GSC').first().json; } catch (_) {}
let health = { health: [] };
try { health = $('Website Health Checks').first().json; } catch (_) {}

const alertRows = [];
try {
  for (const r of $('Load Alert State').all()) alertRows.push(r.json);
} catch (_) {}

const openAlerts = new Map();
for (const a of alertRows) {
  if (a.issue_key && !a.resolved_at) openAlerts.set(a.issue_key, a);
}

const critical = [];
for (const h of health.health || []) {
  for (const c of h.critical || []) critical.push({ ...c, siteId: h.siteId });
}

const gscFailed = (gsc.gscInsights || []).some((s) => s.gscStatus === 'error');
const healthFailed = (health.health || []).some((h) => h.healthStatus === 'error');
let status = 'ok';
if (gscFailed && healthFailed) status = 'error';
else if (gscFailed || healthFailed) status = 'partial';

const newCritical = critical.filter((c) => c.issueKey && !openAlerts.has(c.issueKey));

return [{
  json: {
    cfg,
    gscInsights: gsc.gscInsights || [],
    health: health.health || [],
    status,
    gscFailed,
    healthFailed,
    critical,
    newCritical,
    openAlerts: [...openAlerts.keys()],
    needsUrgent: cfg.urgentEnabled && newCritical.length > 0,
  }
}];`;

const BUILD_AI_PROMPT_CODE = `const data = $json;
const cfg = data.cfg;
const payload = {
  period: { current: [cfg.periodStart, cfg.periodEnd], previous: [cfg.prevStart, cfg.prevEnd] },
  companyContext: cfg.companyContext,
  gsc: data.gscInsights.map((s) => ({
    siteId: s.siteId,
    label: s.siteLabel,
    gscStatus: s.gscStatus,
    gscError: s.gscError,
    current: s.current,
    previous: s.previous,
    clicksDelta: s.clicksDelta,
    impressionsDelta: s.impressionsDelta,
    topPages: s.topPages,
    gainers: s.gainers,
    losers: s.losers,
    lowCtrCandidates: s.lowCtrCandidates,
    topQueries: s.topQueries,
    risingQueries: s.risingQueries,
  })),
  health: data.health.map((h) => ({
    siteId: h.siteId,
    healthStatus: h.healthStatus,
    issues: h.issues?.filter((i) => i.severity !== 'info').slice(0, 30),
    pagesChecked: h.pagesChecked,
    oaiSearchBotAllowedHeuristic: h.oaiSearchBotAllowedHeuristic,
    robotsChanged: h.robotsChanged,
  })),
  limitations: [
    data.gscFailed ? 'One or more Google Search Console queries failed.' : null,
    data.healthFailed ? 'One or more website health checks failed.' : null,
    'GSC recent days excluded via dataDelayDays; numbers can still lag.',
    'Page checks sample a limited URL set; not a full crawl.',
    'robots.txt allow for OAI-SearchBot does not prove CDN/WAF allowlisting.',
  ].filter(Boolean),
};

const system = \`You are an SEO analyst for Klaus Way Technology. Use ONLY the JSON evidence provided. Do not invent product features, pricing, customers, reviews, certifications, or relationships. Prefer a few high-value recommendations over a long generic list. Never claim guaranteed ranking improvements. Flag anything needing human verification.

Return strict JSON with shape:
{
  "executiveSummary": "2-4 sentences",
  "recommendations": [{"priority":1,"pageOrQuery":"","evidence":"","whyItMightMatter":"","nextStep":"","draft":null,"needsHumanVerification":true}],
  "contentIdeas": [{"title":"","angle":"","supportedBy":"","needsHumanVerification":true}]
}
Max 5 recommendations, max 3 content ideas (omit contentIdeas if none are data-backed).\`;

return [{
  json: {
    ...data,
    aiSystem: system,
    aiUser: JSON.stringify(payload),
  }
}];`;

const PARSE_AI_CODE = `const raw = $json.message?.content || $json.text || $json.output || JSON.stringify($json);
let parsed = { executiveSummary: '', recommendations: [], contentIdeas: [] };
try {
  const text = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const match = text.match(/\\{[\\s\\S]*\\}/);
  parsed = JSON.parse(match ? match[0] : text);
} catch (e) {
  parsed = {
    executiveSummary: 'AI response could not be parsed. See raw metrics below and review manually.',
    recommendations: [],
    contentIdeas: [],
    parseError: e.message,
    raw: String(raw).slice(0, 2000),
  };
}
const base = $('Build AI Prompt').first().json;
return [{ json: { ...base, ai: parsed } }];`;

const BUILD_EMAIL_CODE = `const d = $json;
const cfg = d.cfg;
const ai = d.ai || {};
const periodLabel = \`\${cfg.periodStart} to \${cfg.periodEnd}\`;

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function pct(n) { return (Number(n) * 100).toFixed(2) + '%'; }
function num(n) { return Number(n || 0).toLocaleString('en-US'); }

let perfHtml = '';
for (const s of d.gscInsights || []) {
  if (s.gscStatus === 'error') {
    perfHtml += \`<p><strong>\${esc(s.siteLabel || s.siteId)}</strong>: Search Console error — \${esc(s.gscError)}</p>\`;
    continue;
  }
  perfHtml += \`<h3>\${esc(s.siteLabel || s.siteId)}</h3>
  <ul>
    <li>Clicks: <strong>\${num(s.current.clicks)}</strong> (prev \${num(s.previous.clicks)}, Δ \${num(s.clicksDelta)})</li>
    <li>Impressions: <strong>\${num(s.current.impressions)}</strong> (prev \${num(s.previous.impressions)}, Δ \${num(s.impressionsDelta)})</li>
    <li>CTR: \${pct(s.current.ctr)} (prev \${pct(s.previous.ctr)})</li>
    <li>Avg position: \${Number(s.current.position||0).toFixed(1)} (prev \${Number(s.previous.position||0).toFixed(1)}) — directional only</li>
  </ul>\`;
  const topPages = (s.topPages || []).slice(0, 5).map((p) => \`<li>\${esc(p.page)} — \${num(p.clicks)} clicks, \${num(p.impressions)} impr, CTR \${pct(p.ctr)}</li>\`).join('');
  const topQ = (s.topQueries || []).slice(0, 5).map((q) => \`<li>"\${esc(q.query)}" — \${num(q.clicks)} clicks, \${num(q.impressions)} impr</li>\`).join('');
  perfHtml += \`<p><strong>Top pages</strong></p><ol>\${topPages || '<li>None</li>'}</ol>\`;
  perfHtml += \`<p><strong>Top queries</strong></p><ol>\${topQ || '<li>None</li>'}</ol>\`;
}

let healthHtml = '';
for (const h of d.health || []) {
  const errs = (h.issues || []).filter((i) => i.severity === 'error' || i.severity === 'critical');
  const warns = (h.issues || []).filter((i) => i.severity === 'warning');
  healthHtml += \`<h3>\${esc(h.siteLabel || h.siteId)}</h3>\`;
  if (!errs.length && !warns.length) {
    healthHtml += \`<p>No checked issues found on \${h.pagesChecked || 0} sampled pages (sample-based; not a full crawl).</p>\`;
  } else {
    healthHtml += \`<ul>\${[...errs, ...warns].slice(0, 20).map((i) => \`<li>[\${esc(i.severity)}] \${esc(i.message)}\${i.url ? ' — ' + esc(i.url) : ''}</li>\`).join('')}</ul>\`;
  }
}

const recs = (ai.recommendations || []).map((r, i) => \`<li><strong>#\${r.priority || i+1} \${esc(r.pageOrQuery)}</strong><br/>Evidence: \${esc(r.evidence)}<br/>Why: \${esc(r.whyItMightMatter)}<br/>Next: \${esc(r.nextStep)}\${r.draft ? '<br/>Draft: ' + esc(typeof r.draft === 'string' ? r.draft : JSON.stringify(r.draft)) : ''}\${r.needsHumanVerification ? '<br/><em>Needs human verification</em>' : ''}</li>\`).join('');
const ideas = (ai.contentIdeas || []).map((c) => \`<li><strong>\${esc(c.title)}</strong> — \${esc(c.angle)} (supported by: \${esc(c.supportedBy)})\${c.needsHumanVerification ? ' <em>verify</em>' : ''}</li>\`).join('');

const limitations = [
  ...(d.gscFailed ? ['Search Console data incomplete or failed for at least one property.'] : []),
  ...(d.healthFailed ? ['Website health checks failed for at least one property.'] : []),
  'Recent GSC days excluded for incomplete data.',
  'Health checks sample a limited set of public URLs.',
  'AI suggestions are not guaranteed ranking improvements.',
  ai.parseError ? 'AI JSON parse issue — recommendations may be incomplete.' : null,
].filter(Boolean).map((l) => \`<li>\${esc(l)}</li>\`).join('');

const summary = ai.executiveSummary
  || (d.status === 'ok'
    ? 'Weekly SEO snapshot ready. Review performance and any health warnings below.'
    : 'Weekly SEO snapshot completed with failures or partial data — do not treat the site as fully healthy.');

const html = \`<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.45;color:#111">
<h1>Klaus Way Weekly SEO Report</h1>
<p><strong>Period:</strong> \${esc(periodLabel)} (vs previous \${esc(cfg.prevStart)} to \${esc(cfg.prevEnd)})</p>
<p><strong>Status:</strong> \${esc(d.status)}</p>
<h2>1. Executive summary</h2>
<p>\${esc(summary)}</p>
<h2>2. Search performance</h2>
\${perfHtml || '<p>No Search Console data.</p>'}
<h2>3. Website health</h2>
\${healthHtml || '<p>No health results.</p>'}
<h2>4. Top recommended actions</h2>
<ol>\${recs || '<li>No AI recommendations this week (or AI unavailable).</li>'}</ol>
<h2>5. Content ideas</h2>
<ul>\${ideas || '<li>None supported by this week\\'s data.</li>'}</ul>
<h2>6. Limitations</h2>
<ul>\${limitations}</ul>
<p style="color:#666;font-size:12px">Automated report from n8n Klausway — Weekly SEO Monitor. Recipient: \${esc(cfg.reportTo)}</p>
</body></html>\`;

const text = [
  \`Klaus Way Weekly SEO Report — \${periodLabel}\`,
  \`Status: \${d.status}\`,
  '',
  summary,
  '',
  'See HTML email for tables and details.',
].join('\\n');

return [{
  json: {
    ...d,
    email: {
      to: cfg.reportTo,
      subject: \`Klaus Way Weekly SEO Report — \${periodLabel}\`,
      html,
      text,
    },
    savePayload: {
      id: \`seo_\${cfg.executionId}\`,
      execution_id: String(cfg.executionId),
      report_date: cfg.reportDate,
      sites: (cfg.properties || []).map((p) => p.id),
      period_start: cfg.periodStart,
      period_end: cfg.periodEnd,
      metrics_json: JSON.stringify({ gscInsights: d.gscInsights, healthSummary: (d.health || []).map((h) => ({ siteId: h.siteId, healthStatus: h.healthStatus, pagesChecked: h.pagesChecked })) }),
      issues_json: JSON.stringify({ health: d.health, critical: d.critical }),
      recommendations_json: JSON.stringify(ai),
      status: d.status,
    },
  }
}];`;

const URGENT_EMAIL_CODE = `const d = $('Merge Results').first().json;
const cfg = d.cfg;
const lines = (d.newCritical || []).map((c) => \`- [\${c.siteId}] \${c.message}\${c.url ? ' (' + c.url + ')' : ''}\`);
const html = \`<p>Urgent SEO / availability alert for Klaus Way monitored sites.</p>
<p>These issues were confirmed after a retry and were not already open in alert state:</p>
<ul>\${lines.map((l) => '<li>' + l.replace(/</g,'&lt;') + '</li>').join('')}</ul>
<p>This is not the weekly report. Investigate hosting/CDN if fetch failures look like blocks.</p>\`;
return [{
  json: {
    to: cfg.reportTo,
    subject: \`Klaus Way SEO Alert — \${(d.newCritical || []).length} critical issue(s)\`,
    html,
    text: lines.join('\\n'),
    alerts: d.newCritical || [],
  }
}];`;

const workflow = {
  name: WORKFLOW_NAME,
  settings: {
    executionOrder: "v1",
    timezone: "America/New_York",
  },
  nodes: [
    {
      id: "sticky",
      name: "Overview",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [0, 0],
      parameters: {
        content:
          "## Klausway — Weekly SEO Monitor\n1. GSC 28d vs prior 28d (configurable properties)\n2. Sitemap + sampled page health checks\n3. Cautious OpenAI recommendations\n4. Email support@klausway.com (or SEO_REPORT_TO)\n5. Save history to Postgres\n6. Optional urgent alerts with dedupe\n\n**Inactive by default.** Connect Google OAuth with `webmasters.readonly`, set `GSC_N8N_CREDENTIAL_ID`, test via webhook, then activate.",
        height: 320,
        width: 460,
        color: 4,
      },
    },
    {
      id: "schedule",
      name: "Weekly Monday 9AM ET",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [520, 240],
      parameters: {
        rule: {
          interval: [
            {
              field: "cronExpression",
              expression: "0 9 * * 1",
            },
          ],
        },
      },
    },
    {
      id: "webhook",
      name: "Test Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [520, 460],
      webhookId: "seo-weekly-report-test",
      parameters: {
        httpMethod: "POST",
        path: "seo-weekly-report-test",
        options: {},
      },
    },
    {
      id: "config",
      name: "Config",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [780, 340],
      parameters: { jsCode: CONFIG_CODE },
    },
    {
      id: "build-gsc",
      name: "Build GSC Requests",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1020, 240],
      parameters: { jsCode: BUILD_GSC_REQUESTS_CODE },
    },
    {
      id: "gsc-http",
      name: "GSC Search Analytics",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [1260, 240],
      onError: "continueRegularOutput",
      credentials: gscCredBlock(),
      parameters: {
        method: "POST",
        url: "={{ $json.requestUrl }}",
        authentication: "predefinedCredentialType",
        nodeCredentialType: "googleOAuth2Api",
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify($json.body) }}",
        options: {
          timeout: 60000,
          response: {
            response: {
              neverError: true,
            },
          },
        },
      },
    },
    {
      id: "attach-meta",
      name: "Attach GSC Meta",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1500, 240],
      parameters: {
        jsCode: `const reqs = $('Build GSC Requests').all();
const outs = $input.all();
return outs.map((item, i) => {
  const meta = reqs[i]?.json || {};
  const body = item.json;
  const rows = body.rows || body.body?.rows || [];
  return {
    json: {
      ...meta,
      rows,
      error: body.error || null,
      httpCode: body.statusCode || body.status || null,
      rawKeys: Object.keys(body || {}),
    },
  };
});`,
      },
    },
    {
      id: "analyze-gsc",
      name: "Analyze GSC",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1740, 240],
      parameters: { jsCode: ANALYZE_GSC_CODE },
    },
    {
      id: "load-robots",
      name: "Load Robots Snapshots",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [1020, 520],
      credentials: { postgres: CREDS.postgres },
      onError: "continueRegularOutput",
      parameters: {
        operation: "executeQuery",
        query:
          "SELECT site_id, robots_hash, robots_text, updated_at FROM n8n_seo_robots_snapshots;",
        options: {},
      },
    },
    {
      id: "load-alerts",
      name: "Load Alert State",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [1020, 700],
      credentials: { postgres: CREDS.postgres },
      onError: "continueRegularOutput",
      parameters: {
        operation: "executeQuery",
        query:
          "SELECT id, issue_key, site_id, severity, last_alerted_at, resolved_at FROM n8n_seo_alert_state WHERE resolved_at IS NULL;",
        options: {},
      },
    },
    {
      id: "health",
      name: "Website Health Checks",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1260, 560],
      parameters: { jsCode: HEALTH_CHECK_CODE },
    },
    {
      id: "wait-both",
      name: "Wait GSC + Health",
      type: "n8n-nodes-base.merge",
      typeVersion: 3,
      position: [1860, 400],
      parameters: {
        mode: "chooseBranch",
        chooseBranchMode: "waitForAll",
        output: "empty",
      },
    },
    {
      id: "merge",
      name: "Merge Results",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2060, 400],
      parameters: { jsCode: MERGE_CODE },
    },
    {
      id: "if-urgent",
      name: "Needs Urgent Alert?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [2220, 280],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
          conditions: [
            {
              id: "c1",
              leftValue: "={{ $json.needsUrgent }}",
              rightValue: true,
              operator: { type: "boolean", operation: "true", singleValue: true },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "wait-retry",
      name: "Wait Before Retry",
      type: "n8n-nodes-base.wait",
      typeVersion: 1.1,
      position: [2460, 160],
      webhookId: "seo-urgent-wait",
      parameters: {
        amount: "={{ $('Config').first().json.urgentRetryDelaySec }}",
        unit: "seconds",
      },
    },
    {
      id: "recheck",
      name: "Recheck Critical",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2700, 160],
      parameters: {
        jsCode: `const merge = $('Merge Results').first().json;
const still = [];
for (const c of merge.newCritical || []) {
  const url = c.url || (c.code === 'sitemap_down'
    ? (merge.cfg.properties.find(p => p.id === c.siteId) || {}).sitemapUrl
    : (merge.cfg.properties.find(p => p.id === c.siteId) || {}).baseUrl);
  if (!url) { still.push(c); continue; }
  try {
    const res = await this.helpers.httpRequest({
      method: 'GET', url, returnFullResponse: true, ignoreHttpStatusErrors: true, timeout: 20000,
      headers: { 'User-Agent': 'KlausWaySeoMonitor/1.0' },
    });
    const status = res.statusCode || res.status || 0;
    if (status === 0 || status >= 500 || (c.code === 'sitemap_down' && status >= 400)) still.push(c);
  } catch {
    still.push(c);
  }
}
return [{ json: { ...merge, confirmedCritical: still, needsUrgent: still.length > 0 } }];`,
      },
    },
    {
      id: "if-still-urgent",
      name: "Still Critical?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [2940, 160],
      parameters: {
        conditions: {
          options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
          conditions: [
            {
              id: "c2",
              leftValue: "={{ $json.needsUrgent }}",
              rightValue: true,
              operator: { type: "boolean", operation: "true", singleValue: true },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "build-urgent",
      name: "Build Urgent Email",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [3180, 80],
      parameters: {
        jsCode: `const d = $json;
const cfg = d.cfg;
const lines = (d.confirmedCritical || []).map((c) => '- [' + c.siteId + '] ' + c.message + (c.url ? ' (' + c.url + ')' : ''));
const html = '<p>Urgent SEO / availability alert for Klaus Way monitored sites.</p><p>Confirmed after retry:</p><ul>' +
  lines.map((l) => '<li>' + String(l).replace(/</g,'&lt;') + '</li>').join('') +
  '</ul><p>Not the weekly report. Check hosting/CDN if this looks like a block.</p>';
return [{ json: { to: cfg.reportTo, subject: 'Klaus Way SEO Alert — ' + lines.length + ' critical issue(s)', html, text: lines.join('\\n'), alerts: d.confirmedCritical || [], cfg, merge: d } }];`,
      },
    },
    {
      id: "send-urgent",
      name: "Send Urgent Email",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2.1,
      position: [3420, 80],
      credentials: { smtp: CREDS.smtp },
      parameters: {
        fromEmail: "no-reply@klauslarsen.com",
        toEmail: "={{ $json.to }}",
        subject: "={{ $json.subject }}",
        emailType: "html",
        html: "={{ $json.html }}",
        options: {},
      },
    },
    {
      id: "save-alerts",
      name: "Upsert Alert State",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [3660, 80],
      credentials: { postgres: CREDS.postgres },
      onError: "continueRegularOutput",
      parameters: {
        operation: "executeQuery",
        query: `={{ (() => {
  const alerts = $json.alerts || $('Build Urgent Email').first().json.alerts || [];
  if (!alerts.length) return "SELECT 1 WHERE false;";
  return alerts.map((a) => {
    const key = String(a.issueKey || '').replace(/'/g, "''");
    const site = String(a.siteId || '').replace(/'/g, "''");
    const sev = String(a.severity || 'critical').replace(/'/g, "''");
    const details = JSON.stringify(a).replace(/'/g, "''");
    return \`INSERT INTO n8n_seo_alert_state (id, issue_key, site_id, severity, last_alerted_at, resolved_at, details_json, created_at, updated_at)
VALUES ('\${Date.now()}_\${Math.random().toString(36).slice(2,8)}', '\${key}', '\${site}', '\${sev}', NOW(), NULL, '\${details}'::jsonb, NOW(), NOW())
ON CONFLICT (issue_key) DO UPDATE SET last_alerted_at = NOW(), resolved_at = NULL, details_json = EXCLUDED.details_json, updated_at = NOW();\`;
  }).join('\\n');
})() }}`,
        options: {},
      },
    },
    {
      id: "build-ai",
      name: "Build AI Prompt",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2220, 520],
      parameters: { jsCode: BUILD_AI_PROMPT_CODE },
    },
    {
      id: "openai",
      name: "AI Recommendations",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1.8,
      position: [2460, 520],
      credentials: { openAiApi: CREDS.openAi },
      onError: "continueRegularOutput",
      parameters: {
        resource: "text",
        operation: "message",
        modelId: {
          __rl: true,
          mode: "list",
          value: "gpt-4o-mini",
        },
        messages: {
          values: [
            {
              role: "system",
              content: "={{ $json.aiSystem }}",
            },
            {
              role: "user",
              content: "={{ $json.aiUser }}",
            },
          ],
        },
        options: {
          temperature: 0.2,
          maxTokens: 2500,
        },
      },
    },
    {
      id: "parse-ai",
      name: "Parse AI",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2700, 520],
      parameters: { jsCode: PARSE_AI_CODE },
    },
    {
      id: "build-email",
      name: "Build Weekly Email",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2940, 520],
      parameters: { jsCode: BUILD_EMAIL_CODE },
    },
    {
      id: "send-email",
      name: "Send Weekly Email",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2.1,
      position: [3180, 520],
      credentials: { smtp: CREDS.smtp },
      parameters: {
        fromEmail: "no-reply@klauslarsen.com",
        toEmail: "={{ $json.email.to }}",
        subject: "={{ $json.email.subject }}",
        emailType: "html",
        html: "={{ $json.email.html }}",
        options: {
          appendAttribution: false,
        },
      },
    },
    {
      id: "save-report",
      name: "Save Report History",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [3420, 520],
      credentials: { postgres: CREDS.postgres },
      onError: "continueRegularOutput",
      parameters: {
        operation: "executeQuery",
        query: `={{ (() => {
  const p = $json.savePayload;
  const e = (s) => String(s ?? '').replace(/'/g, "''");
  const sites = (p.sites || []).map((s) => "'" + e(s) + "'").join(',');
  return \`INSERT INTO n8n_seo_reports (id, execution_id, report_date, sites, period_start, period_end, metrics_json, issues_json, recommendations_json, status, created_at)
VALUES ('\${e(p.id)}', '\${e(p.execution_id)}', '\${e(p.report_date)}'::date, ARRAY[\${sites}]::text[], '\${e(p.period_start)}'::date, '\${e(p.period_end)}'::date, '\${e(p.metrics_json)}'::jsonb, '\${e(p.issues_json)}'::jsonb, '\${e(p.recommendations_json)}'::jsonb, '\${e(p.status)}', NOW())
ON CONFLICT (execution_id) DO UPDATE SET
  metrics_json = EXCLUDED.metrics_json,
  issues_json = EXCLUDED.issues_json,
  recommendations_json = EXCLUDED.recommendations_json,
  status = EXCLUDED.status
RETURNING id, execution_id, status;\`;
})() }}`,
        options: {},
      },
    },
    {
      id: "save-robots",
      name: "Upsert Robots Snapshots",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [3660, 520],
      credentials: { postgres: CREDS.postgres },
      onError: "continueRegularOutput",
      parameters: {
        operation: "executeQuery",
        query: `={{ (() => {
  const health = $('Build Weekly Email').first().json.health || [];
  const stmts = health.filter((h) => h.robotsHash && h.robotsText).map((h) => {
    const e = (s) => String(s ?? '').replace(/'/g, "''");
    return \`INSERT INTO n8n_seo_robots_snapshots (site_id, robots_hash, robots_text, updated_at)
VALUES ('\${e(h.siteId)}', '\${e(h.robotsHash)}', '\${e(h.robotsText)}', NOW())
ON CONFLICT (site_id) DO UPDATE SET robots_hash = EXCLUDED.robots_hash, robots_text = EXCLUDED.robots_text, updated_at = NOW();\`;
  });
  return stmts.length ? stmts.join('\\n') : 'SELECT 1 WHERE false;';
})() }}`,
        options: {},
      },
    },
  ],
  connections: {
    "Weekly Monday 9AM ET": {
      main: [[{ node: "Config", type: "main", index: 0 }]],
    },
    "Test Webhook": {
      main: [[{ node: "Config", type: "main", index: 0 }]],
    },
    Config: {
      main: [
        [
          { node: "Build GSC Requests", type: "main", index: 0 },
          { node: "Load Robots Snapshots", type: "main", index: 0 },
        ],
      ],
    },
    "Build GSC Requests": {
      main: [[{ node: "GSC Search Analytics", type: "main", index: 0 }]],
    },
    "GSC Search Analytics": {
      main: [[{ node: "Attach GSC Meta", type: "main", index: 0 }]],
    },
    "Attach GSC Meta": {
      main: [[{ node: "Analyze GSC", type: "main", index: 0 }]],
    },
    "Load Robots Snapshots": {
      main: [[{ node: "Load Alert State", type: "main", index: 0 }]],
    },
    "Load Alert State": {
      main: [[{ node: "Website Health Checks", type: "main", index: 0 }]],
    },
    "Analyze GSC": {
      main: [[{ node: "Wait GSC + Health", type: "main", index: 0 }]],
    },
    "Website Health Checks": {
      main: [[{ node: "Wait GSC + Health", type: "main", index: 1 }]],
    },
    "Wait GSC + Health": {
      main: [[{ node: "Merge Results", type: "main", index: 0 }]],
    },
    "Merge Results": {
      main: [
        [
          { node: "Needs Urgent Alert?", type: "main", index: 0 },
          { node: "Build AI Prompt", type: "main", index: 0 },
        ],
      ],
    },
    "Needs Urgent Alert?": {
      main: [
        [{ node: "Wait Before Retry", type: "main", index: 0 }],
        [],
      ],
    },
    "Wait Before Retry": {
      main: [[{ node: "Recheck Critical", type: "main", index: 0 }]],
    },
    "Recheck Critical": {
      main: [[{ node: "Still Critical?", type: "main", index: 0 }]],
    },
    "Still Critical?": {
      main: [[{ node: "Build Urgent Email", type: "main", index: 0 }], []],
    },
    "Build Urgent Email": {
      main: [[{ node: "Send Urgent Email", type: "main", index: 0 }]],
    },
    "Send Urgent Email": {
      main: [[{ node: "Upsert Alert State", type: "main", index: 0 }]],
    },
    "Build AI Prompt": {
      main: [[{ node: "AI Recommendations", type: "main", index: 0 }]],
    },
    "AI Recommendations": {
      main: [[{ node: "Parse AI", type: "main", index: 0 }]],
    },
    "Parse AI": {
      main: [[{ node: "Build Weekly Email", type: "main", index: 0 }]],
    },
    "Build Weekly Email": {
      main: [[{ node: "Send Weekly Email", type: "main", index: 0 }]],
    },
    "Send Weekly Email": {
      main: [[{ node: "Save Report History", type: "main", index: 0 }]],
    },
    "Save Report History": {
      main: [[{ node: "Upsert Robots Snapshots", type: "main", index: 0 }]],
    },
  },
};

// Strip undefined credentials from HTTP node when GSC id missing
for (const node of workflow.nodes) {
  if (node.credentials === undefined) delete node.credentials;
}

async function main() {
  const outPath = path.join(
    __dirname,
    "n8n-seo-weekly-report-workflow.json",
  );
  const exportBody = {
    name: workflow.name,
    active: false,
    settings: workflow.settings,
    nodes: workflow.nodes,
    connections: workflow.connections,
    meta: {
      templateCredsSetupCompleted: false,
      notes:
        "Import inactive. Create Google OAuth credential with webmasters.readonly and attach to GSC Search Analytics node. Default email: support@klausway.com",
    },
  };
  fs.writeFileSync(outPath, JSON.stringify(exportBody, null, 2));
  console.log("Wrote", outPath);
  if (!CREDS.gsc.id) {
    console.warn(
      "WARNING: GSC_N8N_CREDENTIAL_ID not set — attach Google OAuth2 credential to 'GSC Search Analytics' after import.",
    );
  }

  if (DRY_RUN) {
    console.log("Dry run — skipped n8n API upsert");
    return;
  }
  if (!N8N_URL || !API_KEY) {
    console.log("No N8N_BASE_URL / N8N_API_KEY — JSON only");
    return;
  }

  const listRes = await fetch(`${N8N_URL}/api/v1/workflows?limit=100`, {
    headers: { "X-N8N-API-KEY": API_KEY },
  });
  const list = await listRes.json();
  const existing = (list.data || []).find((w) => w.name === WORKFLOW_NAME);
  const payload = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings,
  };

  let saved;
  if (existing) {
    const res = await fetch(`${N8N_URL}/api/v1/workflows/${existing.id}`, {
      method: "PUT",
      headers: {
        "X-N8N-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    saved = await res.json();
    console.log("Updated workflow", existing.id, "active=", saved.active);
  } else {
    const res = await fetch(`${N8N_URL}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "X-N8N-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    saved = await res.json();
    console.log("Created workflow", saved.id, "(left inactive)");
  }

  // Ensure inactive
  if (saved?.id && saved.active) {
    await fetch(`${N8N_URL}/api/v1/workflows/${saved.id}/deactivate`, {
      method: "POST",
      headers: { "X-N8N-API-KEY": API_KEY },
    });
    console.log("Deactivated workflow", saved.id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
