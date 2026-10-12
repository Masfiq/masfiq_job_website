// Generates public/og-image.png (1200x630), the preview image shown when the
// site link is shared on LinkedIn, Handshake, Slack, etc.
// Run with: npm run og
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

const font = "'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif";
const mono = "'Google Sans Code', Consolas, 'Roboto Mono', monospace";
const tags = [
  ['Python', '#e8f0fe', '#1557b0'],
  ['FastAPI', '#e6f4ea', '#137333'],
  ['Django', '#feefe3', '#a04e00'],
  ['PyTorch', '#fce8e6', '#b31412'],
  ['ETL pipelines', '#f3e8fd', '#7627bb'],
];

let x = 96;
const tagSvg = tags
  .map(([t, bg, fg]) => {
    const w = t.length * 15 + 36;
    const s = `<rect x="${x}" y="452" width="${w}" height="52" rx="12" fill="${bg}"/>
      <text x="${x + w / 2}" y="486" text-anchor="middle" font-family="${mono}" font-size="24" fill="${fg}">${t}</text>`;
    x += w + 14;
    return s;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g1" cx="0.88" cy="0.12" r="0.6">
      <stop offset="0" stop-color="#c6dafc" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#c6dafc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="1" cy="1" r="0.55">
      <stop offset="0" stop-color="#e4cffa" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#e4cffa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00695c"/>
      <stop offset="0.5" stop-color="#1a73e8"/>
      <stop offset="1" stop-color="#7627bb"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#00897b"/>
      <stop offset="0.3" stop-color="#1a73e8"/>
      <stop offset="0.55" stop-color="#9334e6"/>
      <stop offset="0.78" stop-color="#d93025"/>
      <stop offset="1" stop-color="#e8710a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <circle cx="124" cy="132" r="28" fill="url(#name)"/>
  <text x="124" y="141" text-anchor="middle" font-family="${font}" font-size="22" font-weight="700" fill="#ffffff">MR</text>
  <text x="170" y="141" font-family="${font}" font-size="26" fill="#424a49">Software Engineer</text>
  <text x="92" y="282" font-family="${font}" font-size="104" font-weight="500" letter-spacing="-3" fill="url(#name)">Masfiq Reza</text>
  <text x="96" y="352" font-family="${font}" font-size="34" fill="#424a49">REST APIs, ETL pipelines with automated validation,</text>
  <text x="96" y="398" font-family="${font}" font-size="34" fill="#424a49">and web applications in Python.</text>
  ${tagSvg}
  <text x="96" y="572" font-family="${font}" font-size="24" fill="#00695c">MS Computer Science, Colorado State University</text>
  <rect x="0" y="618" width="1200" height="12" fill="url(#bar)"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`Wrote ${out}`);
