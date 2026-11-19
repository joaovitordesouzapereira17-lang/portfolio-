/** Gerador pseudoaleatório determinístico (mesmo texto → mesmo resultado) */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** clip-path de papel rasgado: um lado irregular, o outro reto */
export function tornPath(seed: string, side: 'top' | 'bottom', points = 48, amp = 0.9) {
  const r = seeded(seed);
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * 100;
    const y = r() * amp * 10; // em % da altura do elemento
    pts.push(`${x.toFixed(2)}% ${side === 'top' ? y.toFixed(2) : (100 - y).toFixed(2)}%`);
  }
  return side === 'top'
    ? `polygon(${pts.join(',')},100% 100%,0% 100%)`
    : `polygon(0% 0%,100% 0%,${pts.reverse().join(',')})`;
}

/** clip-path de fita adesiva com pontas mordidas */
export function tapePath(seed: string) {
  const r = seeded(seed);
  const left: string[] = [];
  const right: string[] = [];
  const n = 6;
  for (let i = 0; i <= n; i++) {
    const y = (i / n) * 100;
    left.push(`${(r() * 4).toFixed(1)}% ${y.toFixed(1)}%`);
    right.push(`${(100 - r() * 4).toFixed(1)}% ${(100 - y).toFixed(1)}%`);
  }
  return `polygon(${left.join(',')},${right.join(',')})`;
}
