import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import styles from './CoverflowCarousel.module.css';

/* -------------------------------------------------------------------------- */
/*  Carrossel coverflow de pôsteres                                           */
/*  Adaptado do "Glassy Coverflow Carousel" para este projeto: CSS Modules,   */
/*  textos em português, só o layout de pôster e sem modal próprio — o        */
/*  cartão ativo chama `onOpen` (a Videoteca abre a ficha de locadora).       */
/*  Setas ← → / Home / End, arrastar e botões compartilham a seleção.         */
/*  Movimento reduzido: sem transições e sem avanço automático.               */
/* -------------------------------------------------------------------------- */

export interface CoverflowItem {
  id: string;
  title: string;
  subtitle: string;
  /** pôster 2:3; sem imagem, use `render` */
  image?: string;
  /** conteúdo alternativo do pôster (ex.: arte provisória) */
  render?: ReactNode;
}

export interface CoverflowCarouselProps {
  items: CoverflowItem[];
  initialIndex?: number;
  /** Atraso do avanço automático em ms (mínimo 2500). */
  interval?: number;
  /** Avanço automático. Pausa com hover, foco, arraste, aba oculta e movimento reduzido. */
  autoPlay?: boolean;
  /** Nome acessível da região. */
  label?: string;
  /** Texto do botão que aparece sobre o cartão ativo. */
  openLabel?: string;
  className?: string;
  style?: CSSProperties;
  onSelect?: (item: CoverflowItem, index: number) => void;
  /** Clique/Enter no cartão ativo. */
  onOpen?: (item: CoverflowItem, index: number) => void;
}

const wrap = (value: number, length: number) => ((value % length) + length) % length;
const pad = (n: number) => String(n).padStart(2, '0');

export function CoverflowCarousel({
  items,
  initialIndex = 0,
  interval = 6000,
  autoPlay = false,
  label = 'Coleção',
  openLabel = 'abrir ficha',
  className = '',
  style,
  onSelect,
  onOpen,
}: CoverflowCarouselProps) {
  const [index, setIndex] = useState(Number.isFinite(initialIndex) ? Math.trunc(initialIndex) : 0);
  const [playing, setPlaying] = useState(autoPlay);
  const [reduced, setReduced] = useState(false);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 1100, height: 460 });
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [cardFocused, setCardFocused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; time: number; horizontal: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const focusSelection = useRef(false);

  const activeIndex = items.length ? wrap(index, items.length) : 0;
  const active = items[activeIndex];
  const cardWidth = Math.min(270, stageSize.width * 0.5, Math.max(100, (stageSize.height - 28) / 1.5));
  const step = cardWidth * 0.78;
  const running = playing && !reduced && !dragging && pageVisible && !hovered && !cardFocused && items.length > 1;
  const duration = Number.isFinite(interval) ? Math.max(2500, interval) : 6000;
  const before = Math.min(2, Math.floor((items.length - 1) / 2));
  const after = Math.min(2, Math.ceil((items.length - 1) / 2));
  // Vagas virtuais fora do palco reciclam sem atravessar o baralho na volta.
  const slots =
    items.length > 1 ? Array.from({ length: before + after + 3 }, (_, p) => index + p - before - 1) : [index];

  useEffect(() => setPlaying(autoPlay), [autoPlay]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const measure = () => setStageSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((c) => c + 1), duration);
    return () => clearTimeout(timer);
  }, [running, index, duration]);
  useEffect(() => {
    if (active) onSelect?.(active, activeIndex);
  }, [active, activeIndex, onSelect]);
  useEffect(() => {
    if (focusSelection.current) {
      stage.current?.querySelector<HTMLButtonElement>('[data-active]')?.focus({ preventScroll: true });
      focusSelection.current = false;
    }
  }, [index]);

  const select = (next: number) => {
    setIndex(next);
    setDrag(0);
  };
  const open = () => {
    if (performance.now() > suppressClickUntil.current && active) onOpen?.(active, activeIndex);
  };

  const pointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    gesture.current = { x: e.clientX, y: e.clientY, time: performance.now(), horizontal: false };
  };
  const pointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!start.horizontal && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      gesture.current = null;
      return;
    }
    if (!start.horizontal && Math.abs(dx) > 8) {
      start.horizontal = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    if (start.horizontal) setDrag(Math.max(-1.2, Math.min(1.2, dx / step)));
  };
  const pointerUp = (e: PointerEvent<HTMLDivElement>, cancel = false) => {
    const start = gesture.current;
    gesture.current = null;
    if (start?.horizontal) {
      const dx = e.clientX - start.x;
      const velocity = Math.abs(dx) / Math.max(1, performance.now() - start.time);
      if (!cancel && (Math.abs(dx) > Math.min(55, cardWidth * 0.18) || (Math.abs(dx) > 14 && velocity > 0.35)))
        setIndex((c) => c + (dx < 0 ? 1 : -1));
      suppressClickUntil.current = performance.now() + 300;
    }
    setDrag(0);
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (!active) return null;

  return (
    <section
      className={`${styles.shell} ${className}`}
      aria-label={label}
      aria-roledescription="carrossel"
      style={{ '--cf-card-width': `${cardWidth}px`, ...style } as CSSProperties}
      onKeyDown={(e) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key))
          focusSelection.current = (e.target as HTMLElement).closest('[data-card]') !== null;
        if (e.key === 'ArrowRight') { e.preventDefault(); select(index + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1); }
        if (e.key === 'Home') { e.preventDefault(); select(index - activeIndex); }
        if (e.key === 'End') { e.preventDefault(); select(index - activeIndex + items.length - 1); }
      }}
    >
      <div className={styles.atmosphere} aria-hidden="true" />
      <div
        className={styles.stage}
        ref={stage}
        data-dragging={dragging || undefined}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={(e) => pointerUp(e)}
        onPointerCancel={(e) => pointerUp(e, true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setCardFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setCardFocused(false);
        }}
      >
        <div className={styles.floor} aria-hidden="true" />
        {slots.map((slot) => {
          const item = items[wrap(slot, items.length)];
          const d = slot - index;
          const offset = d + drag;
          const abs = Math.abs(offset);
          const hidden = d < -before || d > after;
          const selected = slot === index;
          return (
            <button
              key={slot}
              type="button"
              data-card
              className={styles.card}
              data-active={selected || undefined}
              data-cursor={selected ? 'abrir' : 'ver'}
              tabIndex={selected ? 0 : -1}
              aria-label={selected ? `Abrir a ficha de ${item.title}` : `Ver ${item.title}`}
              aria-current={selected ? 'true' : undefined}
              aria-hidden={hidden || undefined}
              onClick={() => {
                if (performance.now() < suppressClickUntil.current) return;
                if (selected) open();
                else select(index + d);
              }}
              style={
                {
                  transform: `translate3d(${offset * step}px, 0, ${-Math.min(abs, 3) * 130}px) rotateY(${-Math.max(-42, Math.min(42, offset * 30))}deg) scale(${1 - Math.min(abs, 3) * 0.08})`,
                  opacity: hidden ? 0 : 1,
                  zIndex: 10 - Math.abs(d),
                  pointerEvents: hidden ? 'none' : undefined,
                  '--cf-shade': Math.min(abs, 2) * 0.24,
                } as CSSProperties
              }
            >
              <span className={styles.poster}>
                {item.image ? (
                  <img src={item.image} alt="" draggable={false} loading={Math.abs(d) < 2 ? 'eager' : 'lazy'} decoding="async" />
                ) : (
                  item.render
                )}
                <span className={styles.shade} aria-hidden="true" />
                {onOpen && (
                  <span className={styles.watch} aria-hidden="true">
                    {openLabel}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.bottom}>
        <div className={styles.activeInfo}>
          <h3>{active.title}</h3>
          <p className="mono">{active.subtitle}</p>
        </div>
        <div className={styles.dock} role="group" aria-label="Controles do carrossel">
          <span className={`mono ${styles.position}`} aria-hidden="true">
            <span>{pad(activeIndex + 1)}</span>
            <span>/</span>
            <span>{pad(items.length)}</span>
          </span>
          <div className={styles.transport}>
            <button type="button" onClick={() => select(index - 1)} aria-label="Filme anterior" disabled={items.length < 2}>
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              className={styles.playToggle}
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? 'Pausar a passagem automática' : 'Passar os filmes automaticamente'}
              aria-pressed={playing}
              disabled={reduced || items.length < 2}
            >
              {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button type="button" onClick={() => select(index + 1)} aria-label="Próximo filme" disabled={items.length < 2}>
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <p className={`mono ${styles.hint}`}>
          <span>arraste</span>
          <span className={styles.sep}>ou</span>
          <ArrowLeft size={12} aria-hidden="true" />
          <ArrowRight size={12} aria-hidden="true" />
          <span>para navegar</span>
        </p>
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {!playing && `${active.title}. ${activeIndex + 1} de ${items.length}.`}
      </p>
    </section>
  );
}

export default CoverflowCarousel;
