import styles from './Marquee.module.css';

interface Props {
  items: string[];
  separator?: string;
  className?: string;
  /** segundos por volta */
  speed?: number;
  reverse?: boolean;
}

/** Fita contínua de texto (CSS puro, pausa no hover e com reduced-motion) */
export function Marquee({ items, separator = '✶', className, speed = 28, reverse }: Props) {
  const run = (hidden: boolean) => (
    <div className={styles.run} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className={styles.item}>
          {t}
          <span className={styles.sep} aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`${styles.marquee} ${className ?? ''}`}
      style={{ ['--speed' as string]: `${speed}s`, ['--dir' as string]: reverse ? 'reverse' : 'normal' }}
    >
      <div className={styles.track}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
