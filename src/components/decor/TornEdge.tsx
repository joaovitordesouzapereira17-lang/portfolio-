import { tornPath } from '../../lib/seed';
import styles from './TornEdge.module.css';

interface Props {
  seed: string;
  /** cor da seção SEGUINTE (o papel que "invade" a anterior) */
  color: string;
  /** cor da fibra (borda clara do rasgo) */
  fibre?: string;
}

/** Transição entre seções: borda de papel rasgado com fibra */
export function TornEdge({ seed, color, fibre = 'var(--c-paper)' }: Props) {
  return (
    <div className={styles.edge} aria-hidden="true">
      <div className={styles.fibre} style={{ background: fibre, clipPath: tornPath(seed + 'f', 'top', 64, 5.5) }} />
      <div className={styles.face} style={{ background: color, clipPath: tornPath(seed, 'top', 48, 6) }} />
    </div>
  );
}
