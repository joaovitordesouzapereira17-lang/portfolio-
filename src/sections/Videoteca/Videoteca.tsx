import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { sections } from '../../data/sections';
import { films } from '../../data/videoteca';
import { Ransom } from '../../components/ui/Ransom';
import { Tape } from '../../components/ui/Tape';
import { fadeUp } from '../../lib/motion';
import { FilmCard } from './FilmCard';
import { FilmSheet } from './FilmSheet';
import styles from './Videoteca.module.css';

const meta = sections.find((s) => s.id === 'videoteca')!;
/**
 * 05 — VIDEOTECA
 * Pôsteres em grade assimétrica; clique abre a ficha de empréstimo.
 */
export function Videoteca() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const empty = films.every((f) => !f.title);

  return (
    <section id="videoteca" className={styles.section} aria-label={meta.label}>
      <div className={styles.perf} aria-hidden="true" />

      <header className={styles.head}>
        <motion.p className={`mono ${styles.kicker}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className={styles.num}>{meta.num}</span>
          <span>{meta.blurb}</span>
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Ransom word="VIDEOTECA" />
        </motion.h2>
        <p className={styles.lead}>
          Filmes que alimentam o olhar — enquadramento, cor, ritmo de corte. Clique num pôster para abrir a ficha.
        </p>
        {empty && (
          <Tape tilt={-2} tone="paper" className={styles.emptyTape}>
            acervo em montagem · pôsteres provisórios
          </Tape>
        )}
      </header>

      <ul className={styles.grid}>
        {films.map((f, i) => (
          <FilmCard key={f.id} i={i} onOpen={() => setOpen(i)} />
        ))}
      </ul>

      <div className={`${styles.perf} ${styles.perfBottom}`} aria-hidden="true" />

      <FilmSheet open={open} onClose={close} onNavigate={setOpen} />
    </section>
  );
}
