import type { ReactNode } from 'react';
import { tapePath } from '../../lib/seed';
import styles from './Tape.module.css';

interface Props {
  children: ReactNode;
  tilt?: number;
  tone?: 'grey' | 'red' | 'paper';
  className?: string;
}

/** Etiqueta em fita adesiva */
export function Tape({ children, tilt = -3, tone = 'grey', className }: Props) {
  const seed = typeof children === 'string' ? children : String(tilt);
  return (
    <span
      className={`${styles.tape} ${className ?? ''}`}
      data-tone={tone}
      style={{ clipPath: tapePath(seed), rotate: `${tilt}deg` }}
    >
      {children}
    </span>
  );
}
