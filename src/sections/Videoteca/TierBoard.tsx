import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { films, tiers, type Film, type Tier } from '../../data/videoteca';
import type { useTierList } from '../../hooks/useTierList';
import { Poster } from './Poster';
import styles from './TierBoard.module.css';

type TL = ReturnType<typeof useTierList>;

interface Props {
  tl: TL;
  onInfo: (film: Film) => void;
}

interface Drag {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
}

/**
 * Quadro da tier list.
 * - Mouse: arraste o pôster até uma fileira.
 * - Toque/teclado: toque no pôster para selecionar, depois toque na fileira.
 */
export function TierBoard({ tl, onInfo }: Props) {
  const { byTier, pool, selected, setSelected, place, placement } = tl;
  const [drag, setDrag] = useState<Drag | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const start = useRef<{ id: string; x: number; y: number; rect: DOMRect } | null>(null);
  const dragged = useRef(false);
  const lastY = useRef(0);
  const lastX = useRef(0);

  // rolagem automática perto das bordas enquanto arrasta
  useEffect(() => {
    if (!drag) return;
    let raf = 0;
    const tick = () => {
      const y = lastY.current;
      const edge = 90;
      let dy = 0;
      if (y < edge) dy = -Math.ceil((edge - y) / 6);
      else if (y > window.innerHeight - edge) dy = Math.ceil((y - (window.innerHeight - edge)) / 6);
      if (dy) {
        window.scrollBy(0, dy);
        const t = (document.elementFromPoint(lastX.current, y) as HTMLElement | null)?.closest<HTMLElement>('[data-drop]');
        setOver(t?.dataset.drop ?? null);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drag !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = (id: string) => films.find((f) => f.id === id)?.title ?? '';

  const put = (id: string, tier: Tier | null) => {
    place(id, tier);
    setAnnounce(tier ? `${title(id)} colocado em ${tier}.` : `${title(id)} voltou para a prateleira.`);
  };

  // Esc cancela seleção
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, setSelected]);

  const onPointerDown = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    // impede seleção de texto e o "arraste nativo" do navegador, que cancelaria o nosso
    e.preventDefault();
    window.getSelection()?.removeAllRanges();
    start.current = { id, x: e.clientX, y: e.clientY, rect: e.currentTarget.getBoundingClientRect() };

    const move = (ev: PointerEvent) => {
      const s = start.current;
      if (!s) return;
      if (!dragged.current && Math.hypot(ev.clientX - s.x, ev.clientY - s.y) < 6) return;
      dragged.current = true;
      lastX.current = ev.clientX;
      lastY.current = ev.clientY;
      setDrag({ id: s.id, x: ev.clientX, y: ev.clientY, dx: s.x - s.rect.left, dy: s.y - s.rect.top, w: s.rect.width });
      const target = (document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null)?.closest<HTMLElement>(
        '[data-drop]',
      );
      setOver(target?.dataset.drop ?? null);
    };

    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      const s = start.current;
      start.current = null;
      if (s && dragged.current) {
        const target = (document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null)?.closest<HTMLElement>(
          '[data-drop]',
        );
        const drop = target?.dataset.drop;
        if (drop) put(s.id, drop === 'pool' ? null : (drop as Tier));
        // evita que o "click" depois do arraste selecione o pôster
        window.setTimeout(() => (dragged.current = false), 0);
      }
      setDrag(null);
      setOver(null);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const onChipClick = (id: string) => {
    if (dragged.current) return;
    const next = selected === id ? null : id;
    setSelected(next);
    if (next) setAnnounce(`${title(id)} selecionado. Escolha uma fileira.`);
  };

  const zoneClick = (tier: Tier | null) => {
    if (!selected) return;
    if ((placement[selected] ?? null) === tier) {
      setSelected(null);
      return;
    }
    put(selected, tier);
  };

  const chip = (f: Film, size: 'sm' | 'lg') => (
    <li key={f.id} className={styles.chipWrap} data-size={size}>
      <button
        type="button"
        className={styles.chip}
        aria-pressed={selected === f.id}
        aria-label={`${f.title} (${f.year})${placement[f.id] ? `, no tier ${placement[f.id]}` : ''}`}
        onPointerDown={(e) => onPointerDown(e, f.id)}
        onClick={(e) => {
          e.stopPropagation();
          onChipClick(f.id);
        }}
        data-dragging={drag?.id === f.id || undefined}
        data-cursor="arrastar"
      >
        <Poster film={f} />
      </button>
      <button
        type="button"
        className={styles.info}
        onClick={(e) => {
          e.stopPropagation();
          onInfo(f);
        }}
        aria-label={`Ficha de ${f.title}`}
      >
        <Info size={12} aria-hidden="true" />
      </button>
    </li>
  );

  const targeting = Boolean(selected || drag);
  const ghost = drag ? films.find((f) => f.id === drag.id) : null;

  return (
    <div
      className={styles.wrap}
      data-targeting={targeting || undefined}
      onDragStart={(e) => e.preventDefault()}
    >
      <p className="visually-hidden" aria-live="polite">
        {announce}
      </p>

      <div className={styles.board}>
        {tiers.map((t) => (
          <div
            key={t.id}
            className={styles.row}
            data-tier={t.id}
            data-drop={t.id}
            data-over={over === t.id || undefined}
            onClick={() => zoneClick(t.id)}
          >
            <button
              type="button"
              className={styles.label}
              disabled={!selected}
              onClick={(e) => {
                e.stopPropagation();
                zoneClick(t.id);
              }}
              aria-label={selected ? `Colocar ${title(selected)} em ${t.id} — ${t.label}` : `Tier ${t.id} — ${t.label}`}
            >
              <span className={styles.letter}>{t.id}</span>
              <span className={styles.caption}>{t.label}</span>
            </button>
            <ul className={styles.zone}>
              {byTier[t.id].map((f) => chip(f, 'sm'))}
              {byTier[t.id].length === 0 && (
                <li className={styles.zoneHint} aria-hidden="true">
                  {targeting ? 'solte aqui' : ''}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div
        className={styles.shelf}
        data-drop="pool"
        data-over={over === 'pool' || undefined}
        onClick={() => zoneClick(null)}
      >
        <div className={styles.shelfHead}>
          <span className="mono">Prateleira</span>
          <span className="mono">
            {pool.length ? `faltam ${pool.length} de ${films.length}` : 'tudo classificado ✓'}
          </span>
        </div>
        {pool.length > 0 ? (
          <ul className={styles.shelfList}>{pool.map((f) => chip(f, 'lg'))}</ul>
        ) : (
          <p className={styles.shelfEmpty}>
            {selected ? 'toque aqui para devolver o filme à prateleira' : 'prateleira vazia — sua lista está pronta'}
          </p>
        )}
      </div>

      {ghost &&
        drag &&
        createPortal(
          <div
            className={styles.ghost}
            style={{ width: drag.w, transform: `translate(${drag.x - drag.dx}px, ${drag.y - drag.dy}px) rotate(4deg)` }}
            aria-hidden="true"
          >
            <Poster film={ghost} />
          </div>,
          document.body,
        )}
    </div>
  );
}
