/**
 * Creates / updates the Klausway Daily Article Curator workflow in n8n.
 * Usage: node --env-file=.env scripts/create-n8n-daily-curator.js
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
const GNEWS_API_KEY = (process.env.GNEWS_API_KEY || "").replace(/^"|"$/g, "");

if (!N8N_URL || !API_KEY) {
  console.error("Missing n8n_url (or N8N_BASE_URL) / n8n_api_key");
  process.exit(1);
}

if (!GNEWS_API_KEY) {
  console.error("Missing GNEWS_API_KEY (see .env.example)");
  process.exit(1);
}

const CREDS = {
  postgres: { id: "gkDTjnaiYMJ6dDdr", name: "Klausway Website Postgres" },
  s3: { id: "lKCJPUMFpj7HybRC", name: "Klausway Website S3" },
  openAi: { id: "wksEFndmlSjEMyop", name: "OpenAi account" },
  smtp: { id: "mTYHf3hI2i3EA8CL", name: "no-reply@klauslarsen.com" },
};

const workflow = {
  name: "Klausway — Daily Article Curator",
  settings: {
    executionOrder: "v1",
    timezone: "America/New_York",
  },
  nodes: [
    {
      id: "sticky-overview",
      name: "Overview",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [0, 0],
      parameters: {
        content:
          "## Klausway — Daily Article Curator\n1. Fetch industry news (GNews + Google News RSS)\n2. Dedupe via `n8n_article_candidates`\n3. AI rewrites one original Klaus Way article\n4. Cover: source image if available, else AI → S3\n5. Email Jim Approve / Skip\n6. On approve → insert `BlogPost` published=true",
        height: 280,
        width: 420,
        color: 4,
      },
    },
    {
      id: "schedule",
      name: "Daily 8AM ET",
      type: "n8n-nodes-base.scheduleTrigger",
      typeVersion: 1.2,
      position: [480, 280],
      parameters: {
        rule: {
          interval: [{ field: "days", triggerAtHour: 8, triggerAtMinute: 0 }],
        },
      },
    },
    {
      id: "manual",
      name: "Manual Test",
      type: "n8n-nodes-base.manualTrigger",
      typeVersion: 1,
      position: [480, 500],
      parameters: {},
    },
    {
      id: "fetch-gnews",
      name: "Fetch GNews",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [720, 280],
      onError: "continueRegularOutput",
      parameters: {
        url: "https://gnews.io/api/v4/search",
        sendQuery: true,
        queryParameters: {
          parameters: [
            {
              name: "q",
              value:
                'FileMaker OR "legacy systems" OR "business automation" OR "system integration" OR "AI for small business" OR "process automation"',
            },
            { name: "lang", value: "en" },
            { name: "max", value: "20" },
            { name: "apikey", value: GNEWS_API_KEY },
          ],
        },
        options: { timeout: 30000 },
      },
    },
    {
      id: "fetch-rss",
      name: "Fetch Google News RSS",
      type: "n8n-nodes-base.rssFeedRead",
      typeVersion: 1.2,
      position: [720, 500],
      onError: "continueRegularOutput",
      parameters: {
        url: "https://news.google.com/rss/search?q=FileMaker%20OR%20%22legacy%20systems%22%20OR%20%22business%20automation%22%20OR%20%22system%20integration%22&hl=en-US&gl=US&ceid=US:en",
        options: {},
      },
    },
    {
      id: "merge-feeds",
      name: "Merge Feeds",
      type: "n8n-nodes-base.merge",
      typeVersion: 3.1,
      position: [960, 380],
      parameters: {
        mode: "append",
        numberInputs: 2,
      },
    },
    {
      id: "normalize",
      name: "Normalize Candidates",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1200, 380],
      parameters: {
        jsCode: `const out = [];
const seen = new Set();

function add(url, title, description, image, source) {
  if (!url || !title) return;
  const clean = String(url).trim();
  if (!clean.startsWith('http') || seen.has(clean)) return;
  seen.add(clean);
  out.push({
    url: clean,
    title: String(title).trim().slice(0, 300),
    description: String(description || '').trim().slice(0, 800),
    image: image ? String(image) : '',
    source: source || 'unknown',
  });
}

for (const item of $input.all()) {
  const j = item.json || {};
  if (Array.isArray(j.articles)) {
    for (const a of j.articles) {
      add(a.url, a.title, a.description || a.content, a.image, 'gnews');
    }
  }
  if (j.link || j.url) {
    add(
      j.link || j.url,
      j.title,
      j.contentSnippet || j.content || j.description,
      (j.enclosure && j.enclosure.url) || '',
      'google-news-rss',
    );
  }
}

if (!out.length) {
  return [{ json: { empty: true, candidates: [], message: 'No articles fetched' } }];
}
return [{ json: { empty: false, candidates: out.slice(0, 30) } }];`,
      },
    },
    {
      id: "load-used",
      name: "Load Used URLs",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [1440, 380],
      credentials: { postgres: CREDS.postgres },
      parameters: {
        operation: "executeQuery",
        query: "SELECT url FROM n8n_article_candidates;",
        options: {},
      },
    },
    {
      id: "filter-unused",
      name: "Filter Unused",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1680, 380],
      parameters: {
        jsCode: `const used = new Set(
  $input.all().map((i) => String(i.json.url || '')).filter(Boolean),
);
const candidates = $('Normalize Candidates').first().json.candidates || [];
const fresh = candidates.filter((c) => !used.has(c.url)).slice(0, 12);

if (!fresh.length) {
  return [{ json: { empty: true, message: 'All candidates already used', candidates: [] } }];
}
return [{ json: { empty: false, candidates: fresh } }];`,
      },
    },
    {
      id: "if-has-candidates",
      name: "Has Candidates?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [1920, 380],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
          },
          conditions: [
            {
              id: "c1",
              leftValue: "={{ $json.empty }}",
              rightValue: false,
              operator: { type: "boolean", operation: "equals" },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "no-candidates",
      name: "No Candidates Today",
      type: "n8n-nodes-base.noOp",
      typeVersion: 1,
      position: [2160, 560],
      parameters: {},
    },
    {
      id: "openai-rewrite",
      name: "AI Pick & Rewrite",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1.8,
      position: [2160, 280],
      credentials: { openAiApi: CREDS.openAi },
      parameters: {
        resource: "text",
        operation: "message",
        modelId: {
          __rl: true,
          mode: "list",
          value: "gpt-4.1",
          cachedResultName: "gpt-4.1",
        },
        messages: {
          values: [
            {
              role: "system",
              content: `You are the content editor for Klaus Way (https://www.klausway.com), a consultancy that modernizes FileMaker/legacy systems, builds custom apps/CRMs, and automates business operations with AI and integrations.

Pick ONE best source from the candidate list and rewrite it as an ORIGINAL Klaus Way resource. Do NOT copy wording. Clear, practical, non-hype voice.

SEO requirements (mandatory):
- Title: front-load a searchable primary keyword; aim ≤60 characters; no clickbait.
- Excerpt: 140–160 characters preferred (max 280). Write it as a meta description.
- contentHtml: substantial helpful body (~700–1100 words) with 2–4 <h2> sections; use <ol>/<ul> for steps.
- Include 2–3 contextual INTERNAL links to https://www.klausway.com/apps/, /products/, /contact/, /resources/, or /about/.
- Naturally mention Klaus Way topics when relevant (FileMaker, CRM, system integration, automation/AI) — no stuffing.
- End with: Inspired by / Source: <a href=\\"SOURCE\\">original title</a>

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "sourceUrl": "https://...",
  "sourceTitle": "original title",
  "sourceImage": "https://... or empty string",
  "title": "Klaus Way article title",
  "slug": "kebab-case-slug-max-80-chars",
  "excerpt": "meta description 140-160 chars",
  "type": "ARTICLE" | "GUIDE" | "NEWS" | "CASE_STUDY",
  "contentHtml": "<h2>...</h2><p>...</p> with internal links; end with Inspired by / Source link",
  "imagePrompt": "A clean professional cover image prompt for this article, no text overlays"
}`,
            },
            {
              role: "user",
              content:
                "=Today is {{ $now.toISO() }}.\n\nCandidates JSON:\n{{ JSON.stringify($json.candidates) }}",
            },
          ],
        },
        options: { temperature: 0.5 },
      },
    },
    {
      id: "parse-rewrite",
      name: "Parse Rewrite",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [2400, 280],
      parameters: {
        jsCode: `const raw = $input.first().json;
let text = raw.message?.content || raw.text || raw.output || raw.content || '';
if (typeof text !== 'string') text = JSON.stringify(text);
text = text.trim().replace(/^\`\`\`json\\s*/i, '').replace(/^\`\`\`\\s*/i, '').replace(/\`\`\`$/i, '').trim();

let article;
try {
  article = JSON.parse(text);
} catch (e) {
  throw new Error('AI did not return valid JSON: ' + text.slice(0, 400));
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || ('article-' + Date.now());
}

function cuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

const typeMap = {
  ARTICLE: 'ARTICLE', GUIDE: 'GUIDE', NEWS: 'NEWS', CASE_STUDY: 'CASE_STUDY',
  article: 'ARTICLE', guide: 'GUIDE', news: 'NEWS', 'case-study': 'CASE_STUDY',
};

const slug = slugify(article.slug || article.title);
const candidates = $('Filter Unused').first().json.candidates || [];
const matched = candidates.find((c) => c.url === article.sourceUrl) || {};
const coverCandidate = String(article.sourceImage || matched.image || '').trim();

return [{
  json: {
    id: cuid(),
    candidateId: cuid(),
    sourceUrl: article.sourceUrl,
    sourceTitle: article.sourceTitle || matched.title || article.title,
    title: String(article.title || '').trim(),
    slug,
    excerpt: String(article.excerpt || '').trim().slice(0, 500),
    type: typeMap[article.type] || 'ARTICLE',
    contentHtml: String(article.contentHtml || '').trim(),
    imagePrompt: String(article.imagePrompt || ('Professional editorial cover for: ' + article.title)).trim(),
    coverCandidate,
    hasSourceImage: Boolean(coverCandidate && coverCandidate.startsWith('http')),
  },
}];`,
      },
    },
    {
      id: "if-source-image",
      name: "Has Source Image?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [2640, 280],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
          },
          conditions: [
            {
              id: "c2",
              leftValue: "={{ $json.hasSourceImage }}",
              rightValue: true,
              operator: { type: "boolean", operation: "equals" },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "download-source-image",
      name: "Download Source Image",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [2880, 160],
      onError: "continueRegularOutput",
      parameters: {
        url: "={{ $json.coverCandidate }}",
        options: {
          response: {
            response: {
              responseFormat: "file",
              outputPropertyName: "data",
            },
          },
          timeout: 30000,
        },
      },
    },
    {
      id: "check-download",
      name: "Source Download OK?",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [3120, 160],
      parameters: {
        jsCode: `const item = $input.first();
const article = $('Parse Rewrite').first().json;
const hasBinary = Boolean(item.binary && item.binary.data);

if (hasBinary) {
  return [{
    json: { ...article, imageSource: 'source', readyForS3: true },
    binary: item.binary,
  }];
}

return [{ json: { ...article, imageSource: 'needs-ai', readyForS3: false } }];`,
      },
    },
    {
      id: "if-need-ai",
      name: "Need AI Image?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [3360, 160],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
          },
          conditions: [
            {
              id: "c3",
              leftValue: "={{ $json.readyForS3 }}",
              rightValue: true,
              operator: { type: "boolean", operation: "equals" },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "generate-ai-image",
      name: "Generate AI Image",
      type: "@n8n/n8n-nodes-langchain.openAi",
      typeVersion: 1.8,
      position: [2880, 420],
      credentials: { openAiApi: CREDS.openAi },
      parameters: {
        resource: "image",
        operation: "generate",
        model: "dall-e-3",
        prompt: "={{ $('Parse Rewrite').item.json.imagePrompt }}",
        options: {
          size: "1792x1024",
          quality: "standard",
          style: "natural",
        },
      },
    },
    {
      id: "download-ai-image",
      name: "Download AI Image",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [3120, 420],
      parameters: {
        url: "={{ $json.url || ($json.data && $json.data[0] && $json.data[0].url) }}",
        options: {
          response: {
            response: {
              responseFormat: "file",
              outputPropertyName: "data",
            },
          },
          timeout: 60000,
        },
      },
    },
    {
      id: "prep-ai-binary",
      name: "Prep AI Binary",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [3360, 420],
      parameters: {
        jsCode: `const article = $('Parse Rewrite').first().json;
const item = $input.first();
return [{
  json: { ...article, imageSource: 'ai', readyForS3: true },
  binary: item.binary,
}];`,
      },
    },
    {
      id: "upload-s3",
      name: "Upload Cover to S3",
      type: "n8n-nodes-base.s3",
      typeVersion: 1,
      position: [3600, 280],
      credentials: { s3: CREDS.s3 },
      parameters: {
        operation: "upload",
        bucketName: "kw-doc",
        fileName:
          "=klausway_website/resources/{{ $json.slug }}-{{ Date.now() }}.jpg",
        binaryData: true,
        binaryPropertyName: "data",
        additionalFields: { acl: "publicRead" },
      },
    },
    {
      id: "build-payload",
      name: "Build Publish Payload",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [3840, 280],
      parameters: {
        jsCode: `const article = $('Parse Rewrite').first().json;
const s3 = $input.first().json;
const key =
  s3.Key ||
  s3.key ||
  s3.fileName ||
  ('klausway_website/resources/' + article.slug + '.jpg');
const coverImage =
  s3.Location ||
  s3.location ||
  ('https://kw-doc.s3.us-east-1.amazonaws.com/' + String(key).replace(/^\\/+/, ''));

return [{
  json: {
    ...article,
    coverImage,
    s3Key: key,
  },
}];`,
      },
    },
    {
      id: "save-candidate",
      name: "Save Candidate Proposed",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [4080, 280],
      credentials: { postgres: CREDS.postgres },
      parameters: {
        operation: "executeQuery",
        query:
          "={{ (() => { const a = $json; const e = (s) => String(s ?? '').replace(/'/g, \"''\"); return `INSERT INTO n8n_article_candidates (id, url, title, slug, status, source_feed, cover_image, created_at, updated_at)\\nVALUES ('${e(a.candidateId)}', '${e(a.sourceUrl)}', '${e(a.title)}', '${e(a.slug)}', 'proposed', 'daily-curator', '${e(a.coverImage)}', NOW(), NOW())\\nON CONFLICT (url) DO UPDATE SET title = EXCLUDED.title, slug = EXCLUDED.slug, status = 'proposed', cover_image = EXCLUDED.cover_image, updated_at = NOW()\\nRETURNING id, url, slug, status;`; })() }}",
        options: {},
      },
    },
    {
      id: "approval-email",
      name: "Email Jim for Approval",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2.1,
      position: [4320, 280],
      webhookId: "klausway-daily-article-approval",
      credentials: { smtp: CREDS.smtp },
      parameters: {
        operation: "sendAndWait",
        fromEmail: "no-reply@klauslarsen.com",
        toEmail: "jim.t@klauslarsen.com",
        subject:
          "=Klaus Way article for review: {{ $('Build Publish Payload').item.json.title }}",
        message:
          "=<div style=\"font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111827;max-width:680px\"><p style=\"font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;margin:0 0 8px\">Klaus Way · Daily Article Curator</p><h2 style=\"margin:0 0 12px\">{{ $('Build Publish Payload').item.json.title }}</h2><p style=\"margin:0 0 16px;color:#4b5563\">{{ $('Build Publish Payload').item.json.excerpt }}</p><p style=\"margin:0 0 8px\"><strong>Type:</strong> {{ $('Build Publish Payload').item.json.type }} · <strong>Slug:</strong> {{ $('Build Publish Payload').item.json.slug }}</p><p style=\"margin:0 0 16px\"><strong>Source:</strong> <a href=\"{{ $('Build Publish Payload').item.json.sourceUrl }}\">{{ $('Build Publish Payload').item.json.sourceTitle }}</a></p><img src=\"{{ $('Build Publish Payload').item.json.coverImage }}\" alt=\"Cover\" style=\"max-width:100%;border-radius:12px;border:1px solid #e5e7eb;margin:0 0 16px\" /><div style=\"padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb\">{{ $('Build Publish Payload').item.json.contentHtml }}</div><p style=\"margin:20px 0 0;color:#6b7280;font-size:13px\">Approve to publish on /resources. Skip to discard.</p></div>",
        approvalOptions: {
          values: {
            approvalType: "double",
            approveLabel: "Approve & Publish",
            denyLabel: "Skip",
          },
        },
        options: { responseType: "approval" },
      },
    },
    {
      id: "if-approved",
      name: "Approved?",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [4560, 280],
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "loose",
          },
          conditions: [
            {
              id: "c4",
              leftValue:
                "={{ $json.data && $json.data.approved !== undefined ? $json.data.approved : ($json.approved !== undefined ? $json.approved : true) }}",
              rightValue: true,
              operator: { type: "boolean", operation: "equals" },
            },
          ],
          combinator: "and",
        },
      },
    },
    {
      id: "publish-post",
      name: "Publish BlogPost",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [4800, 160],
      credentials: { postgres: CREDS.postgres },
      parameters: {
        operation: "executeQuery",
        query:
          "={{ (() => { const a = $('Build Publish Payload').item.json; const e = (s) => String(s ?? '').replace(/'/g, \"''\"); return `INSERT INTO \\\"BlogPost\\\" (id, slug, title, excerpt, content, type, \\\"coverImage\\\", \\\"galleryImages\\\", published, date, \\\"createdAt\\\", \\\"updatedAt\\\") VALUES ('${e(a.id)}', '${e(a.slug)}', '${e(a.title)}', '${e(a.excerpt)}', '${e(a.contentHtml)}', '${e(a.type)}'::\\\"ResourceType\\\", '${e(a.coverImage)}', ARRAY[]::text[], true, NOW(), NOW(), NOW()) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, type = EXCLUDED.type, \\\"coverImage\\\" = EXCLUDED.\\\"coverImage\\\", published = true, \\\"updatedAt\\\" = NOW() RETURNING id, slug, title, published;`; })() }}",
        options: {},
      },
    },
    {
      id: "mark-published",
      name: "Mark Candidate Published",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [5040, 160],
      credentials: { postgres: CREDS.postgres },
      parameters: {
        operation: "executeQuery",
        query:
          "={{ (() => { const u = String($('Build Publish Payload').item.json.sourceUrl || '').replace(/'/g, \"''\"); return `UPDATE n8n_article_candidates SET status = 'published', updated_at = NOW() WHERE url = '${u}' RETURNING id, url, status;`; })() }}",
        options: {},
      },
    },
    {
      id: "mark-skipped",
      name: "Mark Candidate Skipped",
      type: "n8n-nodes-base.postgres",
      typeVersion: 2.5,
      position: [4800, 420],
      credentials: { postgres: CREDS.postgres },
      parameters: {
        operation: "executeQuery",
        query:
          "={{ (() => { const u = String($('Build Publish Payload').item.json.sourceUrl || '').replace(/'/g, \"''\"); return `UPDATE n8n_article_candidates SET status = 'skipped', updated_at = NOW() WHERE url = '${u}' RETURNING id, url, status;`; })() }}",
        options: {},
      },
    },
  ],
  connections: {
    "Daily 8AM ET": {
      main: [
        [
          { node: "Fetch GNews", type: "main", index: 0 },
          { node: "Fetch Google News RSS", type: "main", index: 0 },
        ],
      ],
    },
    "Manual Test": {
      main: [
        [
          { node: "Fetch GNews", type: "main", index: 0 },
          { node: "Fetch Google News RSS", type: "main", index: 0 },
        ],
      ],
    },
    "Fetch GNews": {
      main: [[{ node: "Merge Feeds", type: "main", index: 0 }]],
    },
    "Fetch Google News RSS": {
      main: [[{ node: "Merge Feeds", type: "main", index: 1 }]],
    },
    "Merge Feeds": {
      main: [[{ node: "Normalize Candidates", type: "main", index: 0 }]],
    },
    "Normalize Candidates": {
      main: [[{ node: "Load Used URLs", type: "main", index: 0 }]],
    },
    "Load Used URLs": {
      main: [[{ node: "Filter Unused", type: "main", index: 0 }]],
    },
    "Filter Unused": {
      main: [[{ node: "Has Candidates?", type: "main", index: 0 }]],
    },
    "Has Candidates?": {
      main: [
        [{ node: "AI Pick & Rewrite", type: "main", index: 0 }],
        [{ node: "No Candidates Today", type: "main", index: 0 }],
      ],
    },
    "AI Pick & Rewrite": {
      main: [[{ node: "Parse Rewrite", type: "main", index: 0 }]],
    },
    "Parse Rewrite": {
      main: [[{ node: "Has Source Image?", type: "main", index: 0 }]],
    },
    "Has Source Image?": {
      main: [
        [{ node: "Download Source Image", type: "main", index: 0 }],
        [{ node: "Generate AI Image", type: "main", index: 0 }],
      ],
    },
    "Download Source Image": {
      main: [[{ node: "Source Download OK?", type: "main", index: 0 }]],
    },
    "Source Download OK?": {
      main: [[{ node: "Need AI Image?", type: "main", index: 0 }]],
    },
    "Need AI Image?": {
      main: [
        [{ node: "Upload Cover to S3", type: "main", index: 0 }],
        [{ node: "Generate AI Image", type: "main", index: 0 }],
      ],
    },
    "Generate AI Image": {
      main: [[{ node: "Download AI Image", type: "main", index: 0 }]],
    },
    "Download AI Image": {
      main: [[{ node: "Prep AI Binary", type: "main", index: 0 }]],
    },
    "Prep AI Binary": {
      main: [[{ node: "Upload Cover to S3", type: "main", index: 0 }]],
    },
    "Upload Cover to S3": {
      main: [[{ node: "Build Publish Payload", type: "main", index: 0 }]],
    },
    "Build Publish Payload": {
      main: [[{ node: "Save Candidate Proposed", type: "main", index: 0 }]],
    },
    "Save Candidate Proposed": {
      main: [[{ node: "Email Jim for Approval", type: "main", index: 0 }]],
    },
    "Email Jim for Approval": {
      main: [[{ node: "Approved?", type: "main", index: 0 }]],
    },
    "Approved?": {
      main: [
        [{ node: "Publish BlogPost", type: "main", index: 0 }],
        [{ node: "Mark Candidate Skipped", type: "main", index: 0 }],
      ],
    },
    "Publish BlogPost": {
      main: [[{ node: "Mark Candidate Published", type: "main", index: 0 }]],
    },
  },
};

async function main() {
  // Check if workflow already exists
  const listRes = await fetch(`${N8N_URL}/api/v1/workflows?limit=100`, {
    headers: { "X-N8N-API-KEY": API_KEY },
  });
  const list = await listRes.json();
  const existing = (list.data || []).find((w) => w.name === workflow.name);

  let result;
  if (existing) {
    console.log("Updating existing workflow", existing.id);
    const putRes = await fetch(`${N8N_URL}/api/v1/workflows/${existing.id}`, {
      method: "PUT",
      headers: {
        "X-N8N-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: workflow.name,
        nodes: workflow.nodes,
        connections: workflow.connections,
        settings: workflow.settings,
      }),
    });
    result = await putRes.json();
    if (!putRes.ok) {
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  } else {
    console.log("Creating new workflow");
    const postRes = await fetch(`${N8N_URL}/api/v1/workflows`, {
      method: "POST",
      headers: {
        "X-N8N-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflow),
    });
    result = await postRes.json();
    if (!postRes.ok) {
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  }

  const outPath = path.join(
    __dirname,
    "n8n-daily-article-workflow.created.json",
  );
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify(
      {
        id: result.id,
        name: result.name,
        active: result.active,
        nodeCount: (result.nodes || []).length,
        url: `${N8N_URL}/workflow/${result.id}`,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
