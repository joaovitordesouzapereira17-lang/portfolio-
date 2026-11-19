/**
 * Pôster provisório gerado em SVG (2:3) — usado enquanto o filme não tem `poster`.
 * Composição tipográfica com o título do filme na paleta do site.
 */
const P = { black: '#101014', wine: '#68152F', red: '#C8203D', blue: '#272A91', purple: '#7139A8', paper: '#ECE6DC' };

const schemes = [
  { bg: P.wine, shape: P.red, ink: P.paper },
  { bg: P.blue, shape: P.black, ink: P.paper },
  { bg: P.purple, shape: P.wine, ink: P.paper },
  { bg: P.paper, shape: P.red, ink: P.black },
  { bg: P.black, shape: P.purple, ink: P.paper },
  { bg: P.red, shape: P.black, ink: P.paper },
];

function wrap(title: string, max = 11) {
  const lines: string[] = [];
  let cur = '';
  for (const w of title.toUpperCase().split(' ')) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

export function PosterArt({ variant, title, year }: { variant: number; title: string; year?: string }) {
  const c = schemes[variant % schemes.length];
  const lines = wrap(title);
  const size = lines.length > 3 ? 30 : 38;
  const v = variant % 3;
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="300" fill={c.bg} />
      {v === 0 && <circle cx="120" cy="105" r="70" fill={c.shape} />}
      {v === 1 && <polygon points="0,190 200,40 200,140 0,290" fill={c.shape} />}
      {v === 2 &&
        [0, 1, 2, 3, 4].map((i) => <rect key={i} x="0" y={30 + i * 26} width="200" height="12" fill={c.shape} />)}
      {lines.map((l, i) => (
        <text
          key={i}
          x="14"
          y={290 - (lines.length - 1 - i) * size * 0.95 - 14}
          fill={c.ink}
          fontFamily="Anton, Impact, sans-serif"
          fontSize={size}
        >
          {l}
        </text>
      ))}
      <text x="14" y="22" fill={c.ink} fontFamily="Space Mono, monospace" fontSize="9" letterSpacing="1">
        {year ?? ''} · PÔSTER PROVISÓRIO
      </text>
    </svg>
  );
}
