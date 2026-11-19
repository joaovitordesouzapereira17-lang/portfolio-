/**
 * Capa provisória gerada em SVG — usada enquanto a faixa não tem `cover`.
 * Cinco composições na paleta do site, escolhidas pelo índice.
 */
import { useId } from 'react';

const P = { black: '#101014', wine: '#68152F', red: '#C8203D', blue: '#272A91', purple: '#7139A8', paper: '#ECE6DC' };

export function CoverArt({ variant, label }: { variant: number; label: string }) {
  const v = variant % 5;
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {v === 0 && (
        <>
          <rect width="100" height="100" fill={P.red} />
          <circle cx="58" cy="46" r="30" fill={P.black} />
          <rect x="12" y="62" width="26" height="26" fill={P.blue} transform="rotate(-8 25 75)" />
          <circle cx="58" cy="46" r="4" fill={P.paper} />
        </>
      )}
      {v === 1 && (
        <>
          <rect width="100" height="100" fill={P.purple} />
          <pattern id={`cv-dots-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.3" fill={P.black} />
          </pattern>
          <circle cx="30" cy="70" r="42" fill={`url(#cv-dots-${uid})`} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="54" y={12 + i * 12} width="40" height="6" fill={P.wine} />
          ))}
        </>
      )}
      {v === 2 && (
        <>
          <rect width="100" height="100" fill={P.wine} />
          {[34, 26, 18, 10].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={P.paper} strokeWidth="1.2" />
          ))}
          <rect x="0" y="47" width="100" height="6" fill={P.red} />
        </>
      )}
      {v === 3 && (
        <>
          <rect width="100" height="100" fill={P.black} />
          <polygon points="0,70 100,22 100,48 0,96" fill={P.red} />
          <rect x="62" y="8" width="28" height="28" fill="none" stroke={P.paper} strokeWidth="1.2" />
          <circle cx="76" cy="22" r="5" fill={P.purple} />
        </>
      )}
      {v === 4 && (
        <>
          <rect width="100" height="100" fill={P.blue} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect
              key={i}
              x={12 + (i % 4) * 20}
              y={12 + Math.floor(i / 4) * 20}
              width="14"
              height="14"
              fill={i === 6 ? P.red : 'none'}
              stroke={P.paper}
              strokeWidth="0.8"
            />
          ))}
        </>
      )}
      <text x="6" y="94" fontFamily="Space Mono, monospace" fontSize="5.5" fill={P.paper} letterSpacing="0.4">
        {label}
      </text>
    </svg>
  );
}
