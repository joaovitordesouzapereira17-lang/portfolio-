import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { sectionMeta } from '../../data/sections';
import { films } from '../../data/videoteca';
import { useTierList } from '../../hooks/useTierList';
import { Ransom } from '../../components/ui/Ransom';
import { Tape } from '../../components/ui/Tape';
import { fadeUp, enter } from '../../lib/motion';
import { TierBoard } from './TierBoard';
import { FilmSheet } from './FilmSheet';
import { CoverflowCarousel, type CoverflowItem } from '../../components/ui/CoverflowCarousel';
import { PosterArt } from '../../components/decor/PosterArt';
import { ResultCard } from './ResultCard';
import { FloatingSticker } from '../../components/stickers/FloatingSticker';
import styles from './Videoteca.module.css';

const meta = sectionMeta('videoteca');

const shelf: CoverflowItem[] = films.map((f, i) => ({
  id: f.id,
  title: f.title,
  subtitle: `${f.year} · ${f.director}`,
  image: f.poster,
  render: f.poster ? undefined : <PosterArt variant={i} title={f.title} year={f.year} />,
}));

/**
 * 05 — VIDEOTECA
 * Meus filmes favoritos em forma de tier list: o visitante monta a dele
 * e, ao terminar, ganha uma carteirinha de sócio com perfil e imagem para baixar.
 */
export function Videoteca() {
  const tl = useTierList();
  const [sheet, setSheet] = useState<number | null>(null);
  const [result, setResult] = useState(false);
  const wasDone = useRef(tl.done);

  // o "final": ao classificar o último filme, a carteirinha aparece sozinha
  useEffect(() => {
    if (tl.done && !wasDone.current) {
      const t = window.setTimeout(() => setResult(true), 650);
      wasDone.current = true;
      return () => window.clearTimeout(t);
    }
    wasDone.current = tl.done;
  }, [tl.done]);

  const closeSheet = useCallback(() => setSheet(null), []);
  const closeResult = useCallback(() => setResult(false), []);
  const restart = useCallback(() => {
    setResult(false);
    tl.reset();
  }, [tl]);

  const placed = films.length - tl.pool.length;

  return (
    <section id="videoteca" className={styles.section} aria-label={meta.label}>
      <div className={styles.perf} aria-hidden="true" />

      <FloatingSticker name="filme" pos={{ top: '4rem', left: '47%' }} rotate={10} size="clamp(6rem, 4rem + 4vw, 9rem)" hideOnMobile delay={0.15} />
      <FloatingSticker name="lixeira" pos={{ bottom: '1.5rem', left: '13rem' }} rotate={-8} size="clamp(4.5rem, 3rem + 3vw, 6.5rem)" hideOnMobile delay={0.2} />
      <FloatingSticker name="ticket" pos={{ top: '3.5rem', right: '6%' }} rotate={-10} size="clamp(7rem, 4.5rem + 7vw, 12.5rem)" hideOnMobile />

      <header className={styles.head}>
        <motion.p className={`mono ${styles.kicker}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className={styles.num}>{meta.num}</span>
          <span>meus filmes favoritos · tier list</span>
        </motion.p>
        <motion.h2
          className={styles.title}
          initial={enter({ opacity: 0, y: 30 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Ransom word="VIDEOTECA" />
        </motion.h2>
        <div className={styles.lead}>
          <p>
            {films.length} filmes que eu amo. Agora é a sua vez: monte a sua tier list e, no final, retire a sua
            carteirinha de sócio da videoteca.
          </p>
          <p className={styles.how}>
            <Tape tilt={-2} tone="paper">como jogar</Tape>
            <span>arraste os pôsteres · ou toque num pôster e depois na fileira · ⓘ abre a ficha</span>
          </p>
        </div>
      </header>

      {/* ——— Prateleira: folheie os filmes antes de jogar ——— */}
      <div className={styles.shelf}>
        <CoverflowCarousel
          items={shelf}
          label="Prateleira de filmes favoritos"
          openLabel="ver ficha"
          onOpen={(_, i) => setSheet(i)}
        />
      </div>

      <div className={styles.boardHead}>
        <Tape tilt={-2} tone="red">sua vez</Tape>
        <p className="mono">monte a sua tier list ↓</p>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span style={{ width: `${(placed / films.length) * 100}%` }} />
      </div>

      <TierBoard tl={tl} onInfo={(f) => setSheet(films.indexOf(f))} />

      <div className={styles.footer}>
        <button type="button" className={styles.ghostBtn} onClick={tl.reset} disabled={placed === 0}>
          <RotateCcw size={14} aria-hidden="true" /> recomeçar
        </button>
        <button
          type="button"
          className={styles.finish}
          onClick={() => setResult(true)}
          disabled={!tl.done}
          data-ready={tl.done || undefined}
        >
          <Sparkles size={16} aria-hidden="true" />
          {tl.done ? 'retirar minha carteirinha' : `classifique todos (${placed}/${films.length})`}
        </button>
      </div>

      <div className={`${styles.perf} ${styles.perfBottom}`} aria-hidden="true" />

      <FilmSheet open={sheet} onClose={closeSheet} onNavigate={setSheet} />
      <ResultCard open={result} onClose={closeResult} onRestart={restart} byTier={tl.byTier} placement={tl.placement} />
    </section>
  );
}
