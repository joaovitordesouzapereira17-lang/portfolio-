import { motion } from 'motion/react';
import { films } from '../../data/videoteca';
import { Tape } from '../../components/ui/Tape';
import { Poster, filmNum, filmTitle } from './Poster';
import styles from './Videoteca.module.css';

const tilts = [-2.5, 1.5, -1, 2, -2, 1, 2.5, -1.5, 0.5];

export function FilmCard({ i, onOpen }: { i: number; onOpen: () => void }) {
  const f = films[i];
  const sub = [f.year, f.director].filter(Boolean).join(' — ') || 'ano — direção';

  return (
    <motion.li
      className={styles.cell}
      data-slot={i % 9}
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilts[i % tilts.length] }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
    >
      <button type="button" className={styles.card} onClick={onOpen} data-cursor="ficha" aria-haspopup="dialog">
        <span className={styles.posterFrame}>
          <Poster i={i} />
          <span className={styles.hoverStamp} aria-hidden="true">
            ver ficha
          </span>
        </span>
        <Tape tilt={i % 2 ? 4 : -4} className={styles.cardTape}>
          Nº {filmNum(i)}
        </Tape>
        <span className={styles.caption}>
          <span className={styles.capTitle}>{filmTitle(i)}</span>
          <span className={styles.capSub}>{sub}</span>
        </span>
      </button>
    </motion.li>
  );
}
