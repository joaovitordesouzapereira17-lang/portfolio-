import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { useFinePointer } from '../../hooks/useMediaQuery';
import styles from './Cursor.module.css';

/**
 * Mira de impressão que segue o cursor (só em mouse/trackpad).
 * Elementos com [data-cursor="texto"] trocam a etiqueta da mira.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target?.dataset.cursor ?? null);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      className={styles.cursor}
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
      data-active={label ? 'true' : undefined}
      data-pressed={pressed ? 'true' : undefined}
      aria-hidden="true"
    >
      <span className={styles.cross} />
      {label && <span className={styles.label}>{label}</span>}
    </motion.div>
  );
}
