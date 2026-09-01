const sharp = require('sharp');

async function main() {
  const ogSvg = `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#161b22" />
        <stop offset="100%" stop-color="#08090b" />
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stop-color="rgba(200, 255, 0, 0.2)" />
        <stop offset="100%" stop-color="rgba(200, 255, 0, 0)" />
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="32" flood-color="#000000" flood-opacity="0.7" />
      </filter>
    </defs>

    <rect width="1200" height="800" fill="url(#bgGrad)" />
    <rect width="1200" height="800" fill="url(#glow)" />

    <g opacity="0.06" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="500" x2="1200" y2="500" />
      <line x1="0" y1="600" x2="1200" y2="600" />
      <line x1="0" y1="700" x2="1200" y2="700" />
      <line x1="150" y1="0" x2="150" y2="800" />
      <line x1="300" y1="0" x2="300" y2="800" />
      <line x1="450" y1="0" x2="450" y2="800" />
      <line x1="600" y1="0" x2="600" y2="800" />
      <line x1="750" y1="0" x2="750" y2="800" />
      <line x1="900" y1="0" x2="900" y2="800" />
      <line x1="1050" y1="0" x2="1050" y2="800" />
    </g>

    <g transform="translate(600, 300)" filter="url(#shadow)">
      <circle cx="0" cy="0" r="110" fill="none" stroke="#C8FF00" stroke-width="3" stroke-dasharray="6 8" opacity="0.6" />
      <circle cx="0" cy="0" r="90" fill="#101216" stroke="rgba(255,255,255,0.15)" stroke-width="4" />
      <circle cx="0" cy="0" r="52" fill="#C8FF00" />
      <g transform="rotate(-45)">
        <path d="M -8 -15 L -20 -15 C -28 -15 -35 -8 -35 0 C -35 8 -28 15 -20 15 L -8 15 C 0 15 7 8 7 0" stroke="#101216" stroke-width="9" stroke-linecap="round" fill="none" />
        <path d="M 8 15 L 20 15 C 28 15 35 8 35 0 C 35 -8 28 -15 20 -15 L 8 -15 C 0 -15 -7 -8 -7 0" stroke="101216" stroke-width="9" stroke-linecap="round" fill="none" />
      </g>
    </g>

    <g transform="translate(600, 465)">
      <rect x="-160" y="-18" width="150" height="36" rx="18" fill="rgba(200,255,0,0.15)" stroke="#C8FF00" stroke-width="1.5" />
      <text x="-85" y="5" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#C8FF00" letter-spacing="1">100% ONCHAIN</text>

      <rect x="10" y="-18" width="150" height="36" rx="18" fill="rgba(0,82,255,0.18)" stroke="#0052FF" stroke-width="1.5" />
      <circle cx="35" cy="0" r="5" fill="#0052FF" />
      <text x="95" y="5" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#60A5FA" letter-spacing="1">BASE SEPOLIA</text>
    </g>

    <g transform="translate(600, 555)">
      <text x="0" y="0" text-anchor="middle" font-family="Arial, sans-serif" font-size="50" font-weight="900" fill="#FFFFFF" letter-spacing="1">ONCHAIN POAPS</text>
      <text x="0" y="42" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#9CA3AF">Moments Live. Onchain Forever.</text>
    </g>
  </svg>`;

  const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="112" fill="#0B0D10" />
    <circle cx="256" cy="256" r="170" fill="#161920" stroke="rgba(255,255,255,0.15)" stroke-width="8" />
    <circle cx="256" cy="256" r="100" fill="#C8FF00" />
    <g transform="translate(256, 256) rotate(-45)">
      <path d="M -16 -30 L -40 -30 C -56 -30 -70 -16 -70 0 C -70 16 -56 30 -40 30 L -16 30 C 0 30 14 16 14 0" stroke="#0B0D10" stroke-width="18" stroke-linecap="round" fill="none" />
      <path d="M 16 30 L 40 30 C 56 30 70 16 70 0 C 70 -16 56 -30 40 -30 L 16 -30 C 0 -30 -14 -16 -14 0" stroke="#0B0D10" stroke-width="18" stroke-linecap="round" fill="none" />
    </g>
  </svg>`;

  const splashSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0B0D10" />
    <circle cx="256" cy="256" r="140" fill="#161920" stroke="rgba(255,255,255,0.15)" stroke-width="6" />
    <circle cx="256" cy="256" r="80" fill="#C8FF00" />
    <g transform="translate(256, 256) rotate(-45)">
      <path d="M -12 -24 L -32 -24 C -45 -24 -56 -13 -56 0 C -56 13 -45 24 -32 24 L -12 24 C 0 24 11 13 11 0" stroke="#0B0D10" stroke-width="14" stroke-linecap="round" fill="none" />
      <path d="M 12 24 L 32 24 C 45 24 56 13 56 0 C 56 -13 45 -24 32 -24 L 12 -24 C 0 -24 -11 -13 -11 0" stroke="#0B0D10" stroke-width="14" stroke-linecap="round" fill="none" />
    </g>
  </svg>`;

  await sharp(Buffer.from(ogSvg)).png().toFile('public/og.png');
  await sharp(Buffer.from(iconSvg)).png().toFile('public/icon.png');
  await sharp(Buffer.from(splashSvg)).png().toFile('public/splash.png');
  console.log('All images successfully generated!');
}

main().catch(err => { console.error(err); process.exit(1); });