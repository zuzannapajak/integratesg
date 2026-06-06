const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tileBg" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FAFBFD"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
  </defs>

  <rect width="64" height="64" rx="16" fill="url(#tileBg)"/>
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" stroke="#D9E2EC" stroke-width="1.5"/>
  <ellipse cx="18" cy="14" rx="14" ry="9" fill="white" opacity="0.55"/>

  <!-- horizontal bars first -->
  <rect x="16" y="13" width="35" height="9" rx="4.5" fill="#0FA573"/>
  <rect x="16" y="28" width="27" height="9" rx="4.5" fill="#317FF5"/>
  <rect x="16" y="43" width="35" height="9" rx="4.5" fill="#F08A2D"/>

  <!-- thinner vertical stem on top -->
  <rect x="16" y="12" width="9" height="40" rx="4.5" fill="#24364D"/>
</svg>`;

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
