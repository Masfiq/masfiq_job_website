// Fails the build if visible copy contains em dashes, en dashes, or hyphens.
// Runs automatically after `astro build` (see package.json).
//
// Checks: text content of every built HTML page, plus <title>, meta descriptions,
// Open Graph text, alt, and aria-label values. URLs and code are ignored.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

// Proper names whose official spelling includes a hyphen.
const ALLOWED = ['scikit-learn'];

// Hyphen, non-breaking hyphen, figure dash, en dash, em dash, horizontal bar, minus.
const DASH = /[-‐‑‒–—―−]/;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function visibleStrings(html) {
  const strings = [];

  // Attribute values people can see or hear.
  const attr = /\s(alt|aria-label|title|placeholder)="([^"]*)"/g;
  for (const m of html.matchAll(attr)) strings.push(m[2]);
  const meta = /<meta\s+(?:name|property)="(description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"\s+content="([^"]*)"/g;
  for (const m of html.matchAll(meta)) strings.push(m[2]);

  // Text nodes.
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  for (const m of body.matchAll(/>([^<]+)</g)) strings.push(m[1]);

  return strings.map((s) => decode(s).trim()).filter(Boolean);
}

let problems = 0;
for (const file of await htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  for (const text of visibleStrings(html)) {
    let cleaned = text;
    for (const word of ALLOWED) cleaned = cleaned.split(word).join('');
    if (DASH.test(cleaned)) {
      problems++;
      console.error(`  ${file.replace(/\\/g, '/').split('/dist/')[1]}: "${text}"`);
    }
  }
}

if (problems) {
  console.error(`\nCopy check failed: ${problems} visible string(s) contain a dash or hyphen.`);
  console.error('Rewrite them with commas, words, or "to" (see src/data/content.ts).');
  process.exit(1);
}
console.log('Copy check passed: no dashes or hyphens in visible text.');
