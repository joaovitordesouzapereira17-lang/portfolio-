import { ArrowDown } from 'lucide-react';
import styles from './Sticker.module.css';

interface Props {
  text: string;
  href: string;
  label: string;
  className?: string;
}

/** Selo circular com texto girando — funciona como link */
export function Sticker({ text, href, label, className }: Props) {
  return (
    <a href={href} className={`${styles.sticker} ${className ?? ''}`} aria-label={label} data-cursor="explorar">
      <svg viewBox="0 0 200 200" className={styles.ring} aria-hidden="true">
        <defs>
          <path id="sticker-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text className={styles.text}>
          <textPath href="#sticker-circle" textLength="462">
            {text}
          </textPath>
        </text>
      </svg>
      <span className={styles.core} aria-hidden="true">
        <ArrowDown size={34} strokeWidth={1.75} />
      </span>
    </a>
  );
}
