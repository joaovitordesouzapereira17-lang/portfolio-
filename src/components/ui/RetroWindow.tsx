import { useId, useState, type ReactNode, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Square } from 'lucide-react';
import { useFinePointer } from '../../hooks/useMediaQuery';
import styles from './RetroWindow.module.css';

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
  rotate?: number;
  /** container que limita o arraste; sem ele a janela não é arrastável */
  dragBounds?: RefObject<HTMLElement | null>;
  tone?: 'blue' | 'purple' | 'wine';
  status?: string;
}

/** Janela inspirada em interfaces dos anos 2000. Arrastável com mouse; minimizável. */
export function RetroWindow({ title, children, className, rotate = 0, dragBounds, tone = 'blue', status }: Props) {
  const fine = useFinePointer();
  const [min, setMin] = useState(false);
  const bodyId = useId();
  const draggable = fine && !!dragBounds;

  return (
    <motion.div
      className={`${styles.win} ${className ?? ''}`}
      data-tone={tone}
      style={{ rotate }}
      drag={draggable}
      dragConstraints={dragBounds}
      dragElastic={0.08}
      dragMomentum={false}
      whileDrag={{ scale: 1.02, rotate: 0, cursor: 'grabbing' }}
    >
      <div className={styles.bar} data-cursor={draggable ? 'arrastar' : undefined}>
        <span className={styles.icon} aria-hidden="true" />
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrl}
            aria-expanded={!min}
            aria-controls={bodyId}
            aria-label={min ? `Restaurar janela ${title}` : `Minimizar janela ${title}`}
            onClick={() => setMin((m) => !m)}
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            {min ? <Square size={10} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {!min && (
          <motion.div
            id={bodyId}
            className={styles.bodyWrap}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.7, 0, 0.2, 1] }}
          >
            <div className={styles.body}>{children}</div>
            {status && <div className={styles.statusBar}>{status}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
