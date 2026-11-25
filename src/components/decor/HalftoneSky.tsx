import { useMemo } from 'react';
import styles from './HalftoneSky.module.css';

interface Props {
  /** nuvens: centro (0–1), raio horizontal e vertical (0–1) */
  clouds?: [number, number, number, number][];
  className?: string;
}

const W = 1200;
const H = 420;
const STEP = 16;

/** Céu em retícula: pontos que crescem dentro das nuvens (desenho original, SVG estático) */
export function HalftoneSky({ clouds = DEFAULT, className }: Props) {
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number }[] = [];
    for (let y = STEP / 2; y < H; y += STEP) {
      for (let x = STEP / 2 + ((y / STEP) % 2) * (STEP / 2); x < W; x += STEP) {
        let v = 0;
        for (const [cx, cy, rx, ry] of clouds) {
          const dx = (x / W - cx) / rx;
          const dy = (y / H - cy) / ry;
          v = Math.max(v, Math.exp(-(dx * dx + dy * dy) * 2.2));
        }
        const r = v * (STEP * 0.46);
        if (r > 0.9) out.push({ x, y, r });
      }
    }
    return out;
  }, [clouds]);

  return (
    <svg className={`${styles.sky} ${className ?? ''}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </svg>
  );
}

const DEFAULT: [number, number, number, number][] = [
  [0.14, 0.6, 0.14, 0.3],
  [0.27, 0.48, 0.1, 0.28],
  [0.05, 0.72, 0.1, 0.2],
  [0.34, 0.75, 0.07, 0.16],
];
