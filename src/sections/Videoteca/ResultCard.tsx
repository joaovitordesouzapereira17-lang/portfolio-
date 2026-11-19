import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, RotateCcw, X } from 'lucide-react';
import { tiers, type Film, type Tier } from '../../data/videoteca';
import { compatibility, topFilm, type Placement } from '../../hooks/useTierList';
import { useDialog } from '../../hooks/useDialog';
import { seeded } from '../../lib/seed';
import { renderTierImage } from '../../lib/tierImage';
import { Poster } from './Poster';
import styles from './ResultCard.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onRestart: () => void;
  byTier: Record<Tier, Film[]>;
  placement: Placement;
}

/** O "final" da tier list: carteirinha de sócio da Videoteca, com perfil e imagem para baixar */
export function ResultCard({ open, onClose, onRestart, byTier, placement }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  useDialog(open, ref, onClose);

  const top = topFilm(byTier);
  const persona = top?.persona ?? null;
  const compat = compatibility(placement);
  const signature = JSON.stringify(placement);
  const memberNo = String(Math.floor(seeded(signature)() * 9000) + 1000);
  const today = new Date().toLocaleDateString('pt-BR');

  const download = async () => {
    setBusy(true);
    try {
      const blob = await renderTierImage(byTier, persona, memberNo);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'minha-tier-list-videoteca-jv.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={ref}
            className={styles.card}
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={{ y: 120, rotate: -8, scale: 0.9 }}
            animate={{ y: 0, rotate: -1.5, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 18 } }}
            exit={{ y: 80, opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className={styles.holo} aria-hidden="true" />

            <header className={styles.head}>
              <p className="mono">Videoteca JV · carteirinha de sócio</p>
              <p className="mono">
                Nº {memberNo} · {today}
              </p>
            </header>

            <div className={styles.main}>
              {top && (
                <div className={styles.photo}>
                  <Poster film={top} />
                  <span className={styles.photoTag}>seu topo</span>
                </div>
              )}
              <div className={styles.who}>
                <p className={`mono ${styles.kicker}`}>seu perfil de cinéfilo</p>
                <h3 id="result-title" className={styles.persona}>
                  {persona?.title ?? 'Cinéfilo de carteirinha'}
                </h3>
                <p className={styles.line}>{persona?.line}</p>
                {compat !== null && (
                  <p className={styles.compat}>
                    <strong>{compat}%</strong> compatível com o gosto do João
                  </p>
                )}
              </div>
            </div>

            <ol className={styles.mini} aria-label="Resumo da sua tier list">
              {tiers.map((t) => (
                <li key={t.id} data-tier={t.id}>
                  <span className={styles.miniLetter}>{t.id}</span>
                  <span className={styles.miniFilms}>
                    {byTier[t.id].length ? byTier[t.id].map((f) => f.title).join(' · ') : '—'}
                  </span>
                </li>
              ))}
            </ol>

            <div className={styles.barcode} aria-hidden="true" />

            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={download} disabled={busy} data-autofocus>
                <Download size={16} aria-hidden="true" /> {busy ? 'gerando…' : 'baixar imagem'}
              </button>
              <button type="button" onClick={onRestart}>
                <RotateCcw size={15} aria-hidden="true" /> refazer
              </button>
              <button type="button" onClick={onClose} aria-label="Fechar">
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <span className={styles.stamp} aria-hidden="true">
              aprovado
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
