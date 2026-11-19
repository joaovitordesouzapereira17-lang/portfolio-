import { useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { site } from '../../data/site';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { MaskText } from '../../components/ui/MaskText';
import { RetroWindow } from '../../components/ui/RetroWindow';
import { Sticker } from '../../components/ui/Sticker';
import { Marquee } from '../../components/ui/Marquee';
import { CropMarks } from '../../components/decor/CropMarks';
import { fadeUp, pasteIn } from '../../lib/motion';
import styles from './Hero.module.css';

/**
 * 01 — INÍCIO
 * Folha de rosto: nome em escala de cartaz, camada vermelha "fora de registro"
 * que reage ao cursor, recortes sobrepostos e janela leia-me.txt arrastável.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const interactive = fine && !reduce;

  // Cursor normalizado (-1..1) dentro da seção
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 80, damping: 18 });
  const sy = useSpring(ny, { stiffness: 80, damping: 18 });

  // Camadas com profundidades diferentes
  const misX = useTransform(sx, [-1, 1], [-14, 14]);
  const misY = useTransform(sy, [-1, 1], [-8, 8]);
  const deepX = useTransform(sx, [-1, 1], [18, -18]);
  const deepY = useTransform(sy, [-1, 1], [12, -12]);
  const nearX = useTransform(sx, [-1, 1], [-30, 30]);
  const nearY = useTransform(sy, [-1, 1], [-20, 20]);

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    nx.set((px / r.width) * 2 - 1);
    ny.set((py / r.height) * 2 - 1);
    setCoords({ x: Math.round(px), y: Math.round(py) });
  };

  const onLeave = () => {
    nx.set(0);
    ny.set(0);
  };

  const pad = (n: number) => String(n).padStart(4, '0');

  return (
    <section
      id="inicio"
      ref={ref}
      className={styles.hero}
      aria-labelledby="hero-title"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <CropMarks inset="calc(var(--header-h) + 0.75rem) var(--gutter) 0.75rem" />

      {/* ——— Camada de fundo: recortes geométricos ——— */}
      <motion.div className={styles.bgLayer} style={interactive ? { x: deepX, y: deepY } : undefined} aria-hidden="true">
        <motion.span className={styles.wineSlab} variants={pasteIn} initial="hidden" animate="show" custom={-3} />
        <motion.span className={styles.blueChip} variants={pasteIn} initial="hidden" animate="show" custom={8} />
        <span className={styles.halftone} />
        <span className={styles.gridLines} />
      </motion.div>

      {/* ——— Cabeçalho editorial ——— */}
      <motion.div className={styles.meta} variants={fadeUp} initial="hidden" animate="show">
        <p className="mono">
          Portfólio <span className={styles.dim}>/</span> Edição {site.edition}
        </p>
        <p className={`mono ${styles.metaCenter}`}>Folha de rosto</p>
        <p className="mono">
          Nº 01 <span className={styles.dim}>—</span> 06
        </p>
      </motion.div>

      {/* ——— Nome ——— */}
      <h1 id="hero-title" className={styles.name}>
        <span className="visually-hidden">{site.name}</span>

        <span className={styles.first} aria-hidden="true">
          <MaskText lines={[site.firstName.toUpperCase()]} onView={false} offset={2} bleed="0.32em" />
        </span>

        <span className={styles.lastWrap} aria-hidden="true">
          {/* cópia vermelha fora de registro */}
          <motion.span className={styles.lastGhost} style={interactive ? { x: misX, y: misY } : undefined}>
            <MaskText lines={[site.lastName.toUpperCase()]} onView={false} offset={4} />
          </motion.span>
          <span className={styles.last}>
            <MaskText lines={[site.lastName.toUpperCase()]} onView={false} offset={4} />
          </span>
        </span>
      </h1>

      {/* ——— Áreas de atuação (índice a/b/c) ——— */}
      <motion.ul className={styles.roles} initial="hidden" animate="show" aria-label="Áreas de atuação">
        {site.roles.map((role, i) => (
          <motion.li key={role} variants={fadeUp} custom={8 + i}>
            <span className={styles.roleKey}>{String.fromCharCode(97 + i)})</span>
            {role}
          </motion.li>
        ))}
      </motion.ul>

      {/* ——— Janela leia-me ——— */}
      <motion.div
        className={styles.winSlot}
        style={interactive ? { x: nearX, y: nearY } : undefined}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.6 } }}
      >
        <RetroWindow
          title="leia-me.txt"
          rotate={-2.5}
          dragBounds={ref}
          tone="blue"
          status={fine ? 'arraste pela barra ↔' : 'toque em − para minimizar'}
        >
          <p className={styles.intro}>{site.intro}</p>
        </RetroWindow>
      </motion.div>

      {/* ——— Chamadas ——— */}
      <motion.div className={styles.ctaRow} variants={fadeUp} initial="hidden" animate="show" custom={12}>
        <a href="#trabalhos" className={styles.cta} data-cursor="ver">
          <span className={styles.ctaIdx}>02</span>
          <span>Explorar trabalhos</span>
          <ArrowRight size={18} aria-hidden="true" />
        </a>
        <a href="#sobre" className={styles.ctaGhost} data-cursor="ler">
          Sobre mim
        </a>
      </motion.div>

      <motion.div
        className={styles.stickerSlot}
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 12, transition: { delay: 1.3, type: 'spring', stiffness: 160, damping: 14 } }}
      >
        <Sticker
          href="#trabalhos"
          label="Ir para trabalhos"
          text="Explore os trabalhos ✶ role para baixo ✶ "
        />
      </motion.div>

      {/* ——— Fita ——— */}
      <div className={styles.tape} aria-hidden="true">
        <Marquee items={[...site.roles, 'Portfólio ' + site.edition, 'João Vitor']} speed={30} />
      </div>

      {/* ——— Indicadores de interface ——— */}
      <div className={`mono ${styles.hud}`} aria-hidden="true">
        <span>
          {fine ? (
            <>
              X <b>{pad(coords.x)}</b> &nbsp;Y <b>{pad(coords.y)}</b>
            </>
          ) : (
            <>toque · role</>
          )}
        </span>
        <span className={styles.hudScroll}>
          role <span className={styles.scrollBar} />
        </span>
      </div>
    </section>
  );
}
