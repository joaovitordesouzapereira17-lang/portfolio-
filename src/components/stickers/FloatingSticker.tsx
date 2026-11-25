import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useFinePointer, useMediaQuery } from '../../hooks/useMediaQuery';
import { stickerArt, type StickerName } from './StickerArt';
import styles from './Stickers.module.css';

interface Props {
  name: StickerName;
  /** posição absoluta dentro da seção (top/left/right/bottom em CSS) */
  pos: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>;
  /** largura em CSS (o sticker é quadrado) */
  size?: string;
  rotate?: number;
  /** esconde em telas pequenas para não poluir a composição */
  hideOnMobile?: boolean;
  delay?: number;
  /** posição/tamanho alternativos em telas até 760px, para não cobrir texto */
  mobile?: { pos: Props['pos']; size?: string };
}

/**
 * Sticker decorativo colado na seção.
 * Mouse: arrastável, "descola" no hover. Toque: fixo, sem interferir na rolagem.
 */
export function FloatingSticker({ name, pos, size = 'clamp(6.5rem, 4rem + 7vw, 11rem)', rotate = 0, hideOnMobile, delay = 0, mobile }: Props) {
  const small = useMediaQuery('(max-width: 760px)');
  const place = small && mobile ? { ...mobile.pos, width: mobile.size ?? size } : { ...pos, width: size };
  const Art = stickerArt[name];
  const fine = useFinePointer();
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`${styles.sticker} ${hideOnMobile ? styles.hideMobile : ''}`}
      style={place}
      initial={reduce ? false : { scale: 1.6, opacity: 0, rotate: rotate - 25 }}
      whileInView={{ scale: 1, opacity: 1, rotate }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay }}
      whileHover={fine ? { scale: 1.08, rotate: rotate + 6 } : undefined}
      drag={fine}
      dragMomentum={false}
      dragElastic={0.15}
      whileDrag={{ scale: 1.14, rotate: rotate - 4, zIndex: 20 }}
      data-cursor={fine ? 'arrastar' : undefined}
      aria-hidden="true"
    >
      <svg viewBox="-12 -12 284 284" className={styles.svg}>
        <Art />
      </svg>
    </motion.div>
  );
}
