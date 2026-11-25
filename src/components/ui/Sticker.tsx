import { stickerArt } from '../stickers/StickerArt';
import stickerStyles from '../stickers/Stickers.module.css';
import styles from './Sticker.module.css';

interface Props {
  href: string;
  label: string;
  className?: string;
}

/** Selo "explore o portfólio" (desenhado no Figma) funcionando como link */
export function Sticker({ href, label, className }: Props) {
  const Selo = stickerArt.selo;
  return (
    <a href={href} className={`${styles.sticker} ${className ?? ''}`} aria-label={label} data-cursor="explorar">
      <svg viewBox="-12 -12 284 284" className={stickerStyles.svg} aria-hidden="true">
        <Selo />
      </svg>
    </a>
  );
}
