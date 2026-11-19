import { seeded } from '../../lib/seed';
import styles from './Ransom.module.css';

const looks = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

/** Palavra em letras recortadas (bilhete de resgate), determinística pela palavra */
export function Ransom({ word, className }: { word: string; className?: string }) {
  const r = seeded(word);
  return (
    <span className={`${styles.ransom} ${className ?? ''}`} role="img" aria-label={word}>
      {Array.from(word).map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className={styles.space} />
        ) : (
          <span
            key={i}
            className={styles.letter}
            data-look={looks[Math.floor(r() * looks.length)]}
            style={{ rotate: `${(r() * 10 - 5).toFixed(1)}deg`, translate: `0 ${(r() * 0.12 - 0.06).toFixed(2)}em` }}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
