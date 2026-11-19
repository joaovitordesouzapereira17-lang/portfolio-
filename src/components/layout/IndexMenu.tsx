import { useRef } from 'react';
import { useDialog } from '../../hooks/useDialog';
import { AnimatePresence, motion } from 'motion/react';
import { sections } from '../../data/sections';
import { site } from '../../data/site';
import { easeOut, easeSnap } from '../../lib/motion';
import styles from './IndexMenu.module.css';

interface Props {
  open: boolean;
  active: string;
  onClose: () => void;
}

/** Índice em tela cheia — sumário de revista */
export function IndexMenu({ open, active, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useDialog(open, panelRef, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="index-menu"
          ref={panelRef}
          className={styles.menu}
          role="dialog"
          aria-modal="true"
          aria-label="Índice do site"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.6, ease: easeSnap } }}
          exit={{ clipPath: 'inset(100% 0 0% 0)', transition: { duration: 0.45, ease: easeSnap } }}
        >
          <div className={styles.head}>
            <p className="mono">Sumário — Ed. {site.edition}</p>
            <p className="mono">{sections.length} seções</p>
          </div>

          <nav aria-label="Índice">
            <ol className={styles.list}>
              {sections.map((s, i) => (
                <li key={s.id} className={styles.item}>
                  <motion.a
                    href={`#${s.id}`}
                    onClick={onClose}
                    className={styles.link}
                    aria-current={active === s.id ? 'true' : undefined}
                    data-cursor="ir"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%', transition: { delay: 0.25 + i * 0.05, duration: 0.7, ease: easeOut } }}
                  >
                    <span className={styles.num}>{s.num}</span>
                    <span className={styles.label}>{s.label}</span>
                    <span className={`mono ${styles.blurb}`}>{s.blurb}</span>
                  </motion.a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.foot}>
            <p className="mono">{site.roles.join(' / ')}</p>
            <button type="button" className={`mono ${styles.close}`} onClick={onClose}>
              [ esc ] fechar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
