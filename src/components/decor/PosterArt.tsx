/**
 * Pôster provisório gerado em SVG (proporção 2:3) — usado enquanto o filme não tem `poster`.
 * Composições tipográficas na paleta; o número identifica o slot.
 */
const P = { black: '#101014', wine: '#68152F', red: '#C8203D', blue: '#272A91', purple: '#7139A8', paper: '#ECE6DC' };

export function PosterArt({ variant, num }: { variant: number; num: string }) {
  const v = variant % 6;
  const big = { fontFamily: 'Anton, Impact, sans-serif', fontSize: 120 };
  const mono = { fontFamily: 'Space Mono, monospace', fontSize: 9, letterSpacing: 1 };
  return (
    <svg viewBox="0 0 200 300" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {v === 0 && (
        <>
          <rect width="200" height="300" fill={P.wine} />
          <circle cx="100" cy="120" r="70" fill={P.red} />
          <rect x="30" y="190" width="140" height="4" fill={P.paper} />
          <text x="100" y="270" textAnchor="middle" fill={P.paper} {...big} fontSize={70}>{num}</text>
        </>
      )}
      {v === 1 && (
        <>
          <rect width="200" height="300" fill={P.paper} />
          <rect x="0" y="0" width="200" height="150" fill={P.blue} />
          <text x="-6" y="250" fill={P.black} {...big} fontSize={170}>{num}</text>
          <rect x="140" y="120" width="40" height="60" fill={P.red} />
        </>
      )}
      {v === 2 && (
        <>
          <rect width="200" height="300" fill={P.black} />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x="0" y={20 + i * 30} width="200" height="14" fill={i % 3 === 1 ? P.red : P.purple} opacity={i % 3 === 1 ? 1 : 0.55} />
          ))}
          <text x="100" y="180" textAnchor="middle" fill={P.paper} {...big} fontSize={110}>{num}</text>
        </>
      )}
      {v === 3 && (
        <>
          <rect width="200" height="300" fill={P.purple} />
          <pattern id={`pa-dots-${num}`} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="2" fill={P.wine} />
          </pattern>
          <rect width="200" height="300" fill={`url(#pa-dots-${num})`} />
          <rect x="24" y="40" width="152" height="200" fill={P.paper} />
          <text x="100" y="200" textAnchor="middle" fill={P.purple} {...big} fontSize={130}>{num}</text>
        </>
      )}
      {v === 4 && (
        <>
          <rect width="200" height="300" fill={P.red} />
          <polygon points="0,300 200,60 200,300" fill={P.black} />
          <circle cx="60" cy="80" r="34" fill="none" stroke={P.paper} strokeWidth="3" />
          <text x="190" y="285" textAnchor="end" fill={P.red} {...big} fontSize={100}>{num}</text>
        </>
      )}
      {v === 5 && (
        <>
          <rect width="200" height="300" fill={P.blue} />
          {[90, 70, 50, 30].map((r, i) => (
            <circle key={r} cx="100" cy="150" r={r} fill={i % 2 ? P.blue : P.black} />
          ))}
          <text x="100" y="175" textAnchor="middle" fill={P.paper} {...big} fontSize={70}>{num}</text>
        </>
      )}
      <text x="12" y="20" fill={P.paper} {...mono}>PÔSTER PROVISÓRIO</text>
    </svg>
  );
}
