// Builds the 1200×630 social-share image (public/og/adp-og.png) from the white logo.
// Re-run after replacing the logo: node scripts/generate-og.mjs
import sharp from 'sharp';

const W = 1200;
const H = 630;

const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0E2347"/>
      <stop offset="0.6" stop-color="#14305E"/>
      <stop offset="1" stop-color="#3A5079"/>
    </linearGradient>
    <linearGradient id="band" gradientUnits="userSpaceOnUse" x1="560" y1="760" x2="1320" y2="120">
      <stop offset="0" stop-color="#3A5079" stop-opacity="0.9"/>
      <stop offset="0.55" stop-color="#0071BE" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#4FA3E0" stop-opacity="0.55"/>
    </linearGradient>
    <radialGradient id="glow" cx="980" cy="150" r="260" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#F8DC85" stop-opacity="0.85"/>
      <stop offset="0.5" stop-color="#F2C231" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#F2C231" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="halo"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="980" cy="160" rx="300" ry="150" fill="url(#glow)" filter="url(#halo)"/>
  <circle cx="980" cy="640" r="480" fill="none" stroke="url(#band)" stroke-width="96" filter="url(#soft)"/>
  <circle cx="980" cy="640" r="466" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="12" filter="url(#soft)"/>
  <circle cx="980" cy="640" r="480" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="1 9"/>
  <circle cx="980" cy="160" r="34" fill="#14305E" stroke="#F2C231" stroke-width="2"/>
  <rect x="80" y="${H - 92}" width="4" height="30" rx="2" fill="#F2C231"/>
  <text x="98" y="${H - 70}" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#ffffff" fill-opacity="0.85">adpway.com · Riyadh, Saudi Arabia</text>
</svg>`;

const logo = await sharp('public/brand/adp-logo-white.png').resize({width: 560}).toBuffer();
const {height: logoH} = await sharp(logo).metadata();

await sharp(Buffer.from(background))
  .composite([{input: logo, left: 80, top: Math.round((H - logoH) / 2) - 30}])
  .png({compressionLevel: 9})
  .toFile('public/og/adp-og.png');

console.log('Wrote public/og/adp-og.png');
