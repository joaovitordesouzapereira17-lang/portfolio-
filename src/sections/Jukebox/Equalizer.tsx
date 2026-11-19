import { useEffect, useRef } from 'react';
import styles from './Jukebox.module.css';

interface Props {
  bars?: number;
  playing: boolean;
  getAnalyser: () => AnalyserNode | null;
  size?: 'lg' | 'sm';
}

/** Equalizador ligado ao AnalyserNode real; em repouso, barras baixas e estáticas */
export function Equalizer({ bars = 18, playing, getAnalyser, size = 'lg' }: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(wrap.current?.children ?? []) as HTMLElement[];
    const rest = () => els.forEach((el, i) => (el.style.transform = `scaleY(${0.08 + ((i * 7) % 5) * 0.03})`));
    if (!playing) {
      rest();
      return;
    }
    const analyser = getAnalyser();
    let raf = 0;
    if (!analyser) {
      // fonte externa (Spotify): o áudio fica no iframe, então o movimento é simulado
      const phase = els.map((_, i) => i * 1.7);
      const sim = (t: number) => {
        els.forEach((el, i) => {
          const v = 0.35 + 0.3 * Math.sin(t / 180 + phase[i]) * Math.sin(t / 470 + i) + 0.25 * Math.sin(t / 95 + i * 2.3);
          el.style.transform = `scaleY(${Math.min(1, Math.max(0.06, v * (1 - i / (els.length * 1.6)))).toFixed(3)})`;
        });
        raf = requestAnimationFrame(sim);
      };
      raf = requestAnimationFrame(sim);
      return () => cancelAnimationFrame(raf);
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    const loop = () => {
      analyser.getByteFrequencyData(data);
      els.forEach((el, i) => {
        // escala logarítmica: ~90 Hz até ~3 kHz distribuídos pelas barras
        const lo = 1;
        const hi = data.length * 0.14;
        const idx = Math.min(data.length - 1, Math.round(lo * Math.pow(hi / lo, i / (els.length - 1))));
        const v = Math.min(1, Math.pow(data[idx] / 255, 1.4) * 1.25);
        el.style.transform = `scaleY(${Math.max(0.06, v).toFixed(3)})`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [playing, getAnalyser]);

  return (
    <div ref={wrap} className={styles.eq} data-size={size} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
