import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { films } from '../../data/videoteca';
import { useDialog } from '../../hooks/useDialog';
import { Poster } from './Poster';

const num = (i: number) => String(i + 1).padStart(2, '0');
import styles from './FilmSheet.module.css';

interface Props {
  open: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

/** Ficha de empréstimo de videolocadora */
export function FilmSheet({ open, onClose, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open !== null, ref, onClose);

  const go = (d: number) => {
    if (open === null) return;
    onNavigate((open + d + films.length) % films.length);
  };

  return (
    <AnimatePresence>
      {open !== null && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
          }}
        >
          <motion.div
            ref={ref}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="film-sheet-title"
            initial={{ y: 80, rotate: 4, opacity: 0 }}
            animate={{ y: 0, rotate: -1.2, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } }}
            exit={{ y: 60, rotate: 3, opacity: 0, transition: { duration: 0.2 } }}
          >
            <Sheet i={open} />

            <div className={styles.actions}>
              <button type="button" onClick={() => go(-1)} aria-label="Ficha anterior">
                <ChevronLeft size={18} />
              </button>
              <span className="mono">
                {num(open)} / {num(films.length - 1)}
              </span>
              <button type="button" onClick={() => go(1)} aria-label="Próxima ficha">
                <ChevronRight size={18} />
              </button>
              <button type="button" className={styles.close} onClick={onClose} data-autofocus>
                <X size={16} aria-hidden="true" /> fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sheet({ i }: { i: number }) {
  const f = films[i];
  return (
    <div className={styles.body} key={f.id}>
      <div className={styles.posterCol}>
        <div className={styles.poster}>
          <Poster film={f} />
        </div>
      </div>

      <div className={styles.fields}>
        <p className={styles.org}>
          <span>Videoteca JV</span>
          <span>Ficha nº {num(i)}</span>
        </p>
        <h3 id="film-sheet-title" className={styles.title}>
          {f.title}
        </h3>
        <dl className={styles.dl}>
          <div>
            <dt>Ano</dt>
            <dd>{f.year}</dd>
          </div>
          <div>
            <dt>Direção</dt>
            <dd>{f.director}</dd>
          </div>
          <div className={styles.commentRow}>
            <dt>Comentário pessoal</dt>
            <dd>{f.comment || <span className={styles.blank}>— ainda não escrito —</span>}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
