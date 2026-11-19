import { motion } from 'motion/react';
import { maskReveal } from '../../lib/motion';
import styles from './MaskText.module.css';

const tags = { span: motion.span, h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, div: motion.div };

interface Props {
  lines: string[];
  as?: keyof typeof tags;
  className?: string;
  lineClassName?: string;
  /** atraso-base (em "passos" de 0.08s) */
  offset?: number;
  /** anima ao entrar na viewport (true) ou imediatamente (false) */
  onView?: boolean;
  /** respiro extra acima da linha (acentos em fontes com entrelinha curta) */
  bleed?: string;
}

/**
 * Texto revelado linha a linha por máscara.
 * O gatilho fica no container (visível); as linhas herdam o estado via variants.
 */
export function MaskText({ lines, as = 'span', className, lineClassName, offset = 0, onView = true, bleed }: Props) {
  const Tag = tags[as];
  const trigger = onView
    ? { whileInView: 'show', viewport: { once: true, amount: 0.4 } }
    : { animate: 'show' };

  return (
    <Tag className={className} aria-label={lines.join(' ')} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={styles.mask}
          aria-hidden="true"
          style={bleed ? { paddingTop: bleed, marginTop: `-${bleed}` } : undefined}
        >
          <motion.span className={`${styles.line} ${lineClassName ?? ''}`} variants={maskReveal} custom={i + offset}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
