import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { sectionMeta } from '../../data/sections';
import { works, type Work, type WorkImage } from '../../data/works';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Tape } from '../../components/ui/Tape';
import { FloatingSticker } from '../../components/stickers/FloatingSticker';
import { tornPath } from '../../lib/seed';
import { enter } from '../../lib/motion';
import { WorkLightbox } from './WorkLightbox';
import styles from './Works.module.css';

const meta = sectionMeta('trabalhos');

/**
 * 02 — TRABALHOS
 * Cada projeto entra como um "encarte" colado na revista, com as cores da
 * própria marca do projeto (theme), sem misturar com a paleta do portfólio.
 */
export function Works() {
  const [view, setView] = useState<{ work: Work; index: number } | null>(null);
  const close = useCallback(() => setView(null), []);

  return (
    <section id="trabalhos" className={styles.section} aria-labelledby="trabalhos-title">
      <FloatingSticker name="raio" pos={{ top: '5%', right: '10%' }} rotate={12} size="clamp(5rem, 3.5rem + 4vw, 8rem)" hideOnMobile />

      <div className={styles.head} id="trabalhos-title">
        <SectionHeader num={meta.num} title={meta.label} kicker={`${works.length} ${works.length === 1 ? 'projeto' : 'projetos'}`} />
      </div>

      {works.map((w, i) => (
        <Insert key={w.id} work={w} n={i + 1} onOpen={(index) => setView({ work: w, index })} />
      ))}

      <WorkLightbox view={view} onClose={close} onNavigate={(index) => view && setView({ work: view.work, index })} />
    </section>
  );
}

function Insert({ work: w, n, onOpen }: { work: Work; n: number; onOpen: (index: number) => void }) {
  const vars = {
    ['--paper' as string]: w.theme.paper,
    ['--ink' as string]: w.theme.ink,
    ['--accent' as string]: w.theme.accent,
    ['--accent-ink' as string]: w.theme.accentInk,
  };

  return (
    <motion.article
      className={styles.insert}
      style={vars}
      aria-labelledby={`${w.id}-title`}
      initial={enter({ opacity: 0, y: 60, rotate: 1.5 })}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.tornTop} style={{ clipPath: tornPath(w.id, 'top', 60, 7) }} aria-hidden="true" />
      <Tape tilt={-3} tone="paper" className={styles.insertTape}>
        encarte {String(n).padStart(2, '0')}
      </Tape>

      <header className={styles.insertHead}>
        <ul className={styles.tags} aria-label="Categorias">
          {w.categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
          <li className={styles.year}>{w.year}</li>
        </ul>
        <h3 id={`${w.id}-title`} className={styles.title}>
          {w.title}
        </h3>
        {w.glyph && (
          <span className={styles.glyph} aria-hidden="true">
            {w.glyph}
          </span>
        )}
        <p className={styles.tagline}>{w.tagline}</p>
      </header>

      <ImageButton img={w.cover} onClick={() => onOpen(0)} className={styles.cover} eager />

      <div className={styles.body}>
        <div className={styles.summary}>
          {w.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className={styles.deliver}>
          <h4 className={styles.smallHead}>O que foi feito</h4>
          <ul>
            {w.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {w.tools && (
            <>
              <h4 className={styles.smallHead}>Ferramentas</h4>
              <p>{w.tools.join(', ')}</p>
            </>
          )}
        </div>
      </div>

      {w.palette && (
        <div className={styles.block}>
          <h4 className={styles.smallHead}>Paleta</h4>
          <ul className={styles.palette}>
            {w.palette.map((c) => (
              <li key={c.hex} style={{ background: c.hex, color: c.ink }}>
                <span className={styles.swName}>{c.name}</span>
                <span className={styles.swHex}>{c.hex}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {w.mascots && (
        <div className={styles.block}>
          <h4 className={styles.smallHead}>Mascote</h4>
          <ul className={styles.mascots}>
            {w.mascots.map((m) => (
              <li key={m.src} style={{ background: m.on }}>
                <img src={m.src} alt={m.alt} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.block}>
        <h4 className={styles.smallHead}>Aplicações</h4>
        <ul className={styles.gallery}>
          {w.gallery.map((img, i) => (
            <li key={img.src} data-slot={i % 5}>
              <ImageButton img={img} onClick={() => onOpen(i + 1)} />
            </li>
          ))}
        </ul>
      </div>

      <footer className={styles.insertFoot}>
        {w.credits && <p className={styles.credits}>{w.credits}</p>}
        {w.link && (
          <a className={styles.link} href={w.link.href} target="_blank" rel="noreferrer">
            {w.link.label} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </footer>
    </motion.article>
  );
}

function ImageButton({ img, onClick, className, eager }: { img: WorkImage; onClick: () => void; className?: string; eager?: boolean }) {
  return (
    <button
      type="button"
      className={`${styles.imgBtn} ${className ?? ''}`}
      onClick={onClick}
      aria-label={`Ampliar imagem: ${img.alt}`}
      aria-haspopup="dialog"
      data-cursor="ampliar"
      style={{ aspectRatio: String(img.ratio) }}
    >
      <img
        src={img.thumb}
        srcSet={`${img.thumb} 800w, ${img.src} 1600w`}
        sizes="(max-width: 760px) 100vw, 60vw"
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <span className={styles.zoomHint} aria-hidden="true">
        <Maximize2 size={16} />
      </span>
    </button>
  );
}
