import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Work } from '../../data/works';
import { useDialog } from '../../hooks/useDialog';
import styles from './Works.module.css';

interface Props {
  view: { work: Work; index: number } | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Visualizador de imagens do projeto: setas, teclado (← →) e Esc */
export function WorkLightbox({ view, onClose, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(view !== null, ref, onClose);

  const images = view ? [view.work.cover, ...view.work.gallery] : [];
  const go = (d: number) => view && onNavigate((view.index + d + images.length) % images.length);
  const img = view ? images[view.index] : null;

  return (
    <AnimatePresence>
      {view && img && (
        <motion.div
          className={styles.lbBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <div ref={ref} className={styles.lb} role="dialog" aria-modal="true" aria-label={`${view.work.title}: imagem ${view.index + 1} de ${images.length}`}>
            <motion.img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={styles.lbImg}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            />
            <div className={styles.lbBar}>
              <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior">
                <ChevronLeft size={20} />
              </button>
              <span className="mono">
                {String(view.index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Próxima imagem">
                <ChevronRight size={20} />
              </button>
              <button type="button" className={styles.lbClose} onClick={onClose} data-autofocus>
                <X size={18} aria-hidden="true" /> fechar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
