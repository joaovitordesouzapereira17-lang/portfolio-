import { useRef } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { sectionMeta } from '../../data/sections';
import { tracks, type Track } from '../../data/jukebox';
import { useJukebox, formatTime, trackDuration } from '../../hooks/useJukebox';
import { spotifyUrl } from '../../lib/spotify';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Tape } from '../../components/ui/Tape';
import { CoverArt } from '../../components/decor/CoverArt';
import { fadeUp, enter } from '../../lib/motion';
import { Equalizer } from './Equalizer';
import { HalftoneSky } from '../../components/decor/HalftoneSky';
import { FloatingSticker } from '../../components/stickers/FloatingSticker';
import styles from './Jukebox.module.css';

const meta = sectionMeta('jukebox');

function Cover({ track, i }: { track: Track; i: number }) {
  return track.cover ? (
    <img src={track.cover} alt="" loading="lazy" decoding="async" />
  ) : (
    <CoverArt variant={i} label={(track.from ?? track.artist).toUpperCase()} />
  );
}

/**
 * 04 — JUKEBOX
 * Caixa de CD + player estilo software dos anos 2000 + lista de faixas.
 * Sem áudio automático: o som só começa num clique.
 */
export function Jukebox() {
  const spotifyHost = useRef<HTMLDivElement>(null);
  const j = useJukebox(tracks, spotifyHost);
  const ext = j.track.spotify ? spotifyUrl(j.track.spotify) : j.track.link;
  const total = String(tracks.length).padStart(2, '0');
  const n = String(j.index + 1).padStart(2, '0');

  return (
    <section id="jukebox" className={styles.section} aria-label={meta.label}>
      <div className={styles.head}>
        <SectionHeader num={meta.num} title={meta.label} kicker={meta.blurb} />
        <motion.p className={styles.notice} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Tape tilt={2} tone="paper">nada toca sozinho</Tape>
          <span>
            Trilhas dos filmes da minha videoteca. Aperte play: o som vem do player oficial do Spotify (prévia de 30s
            sem login, faixa inteira se você estiver logado).
          </span>
        </motion.p>
      </div>

      <HalftoneSky />
      <FloatingSticker name="celular" pos={{ bottom: '3%', left: '31%' }} rotate={8} delay={0.25} size="clamp(6rem, 4rem + 5vw, 10rem)" hideOnMobile />
      <FloatingSticker name="smiley" pos={{ top: '6%', left: '42%' }} rotate={-10} size="clamp(6rem, 4rem + 4vw, 9rem)" hideOnMobile />
      <FloatingSticker name="cassete" pos={{ bottom: '6%', left: '6%' }} rotate={-9} delay={0.2} size="clamp(7rem, 4.5rem + 7vw, 12rem)" mobile={{ pos: { top: '5rem', right: '4%' }, size: '6.5rem' }} />

      <div className={styles.grid}>
        {/* ——— Caixa de CD ——— */}
        <motion.div
          className={styles.caseCol}
          initial={enter({ opacity: 0, rotate: -8, y: 40 })}
          whileInView={{ opacity: 1, rotate: -3, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.disc} data-playing={j.playing || undefined} aria-hidden="true">
            <span className={styles.discHole} />
          </div>
          <div className={styles.jewel}>
            <div className={styles.hinge} aria-hidden="true" />
            <div className={styles.coverBig}>
              <Cover track={j.track} i={j.index} key={j.track.id} />
            </div>
            <span className={styles.gloss} aria-hidden="true" />
          </div>
          <Tape tilt={-4} tone="red" className={styles.caseTape}>
            {j.playing ? 'tocando agora' : 'selecionada'} · {n}
          </Tape>
        </motion.div>

        {/* ——— Player ——— */}
        <div className={styles.playerCol}>
          <div className={styles.player} role="region" aria-label="Player">
            <div className={styles.bar}>
              <span className={styles.barIcon} aria-hidden="true" />
              <span>jukebox.exe</span>
              <span className={styles.barRight}>{j.playing ? '▶ play' : '■ stop'}</span>
            </div>

            <div className={styles.lcd}>
              <div className={styles.lcdTop}>
                <span>
                  FAIXA {n}/{total}
                  {j.track.spotify && <em className={styles.demoTag}>SPOTIFY</em>}
                  {j.track.demo && <em className={styles.demoTag}>DEMO</em>}
                  {j.loading && <em className={styles.loadTag}>carregando…</em>}
                </span>
                <span className={styles.time} aria-hidden="true">
                  {formatTime(j.position)}
                  <small> / {j.duration ? formatTime(j.duration) : '--:--'}</small>
                </span>
              </div>
              <p className={styles.nowTitle} aria-live="polite">
                <span className="visually-hidden">Faixa atual: </span>
                <span className={styles.nowTitleInner} data-run={j.playing || undefined}>
                  {j.track.title}
                </span>
              </p>
              <p className={styles.nowArtist}>
                {j.track.artist}
                {j.track.from && <span> · trilha de {j.track.from}</span>}
              </p>
              <Equalizer playing={j.playing} getAnalyser={j.analyser} />
            </div>

            <div className={styles.controls}>
              <button type="button" className={styles.ctrl} onClick={j.prev} aria-label="Faixa anterior">
                <SkipBack size={18} />
              </button>
              {j.playable ? (
                <button
                  type="button"
                  className={`${styles.ctrl} ${styles.playBtn}`}
                  onClick={j.toggle}
                  aria-label={j.playing ? 'Pausar' : 'Tocar'}
                  data-cursor={j.playing ? 'pausar' : 'tocar'}
                >
                  {j.playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                </button>
              ) : j.track.link ? (
                <a className={`${styles.ctrl} ${styles.playBtn}`} href={j.track.link} target="_blank" rel="noreferrer" aria-label="Ouvir na fonte externa">
                  <ExternalLink size={20} />
                </a>
              ) : (
                <span className={`${styles.ctrl} ${styles.playBtn}`} aria-label="Sem fonte de áudio" role="img">
                  ∅
                </span>
              )}
              <button type="button" className={styles.ctrl} onClick={j.next} aria-label="Próxima faixa">
                <SkipForward size={18} />
              </button>

              <label className={styles.seek}>
                <span className="visually-hidden">Posição na faixa</span>
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, j.duration)}
                  step={0.1}
                  value={Math.min(j.position, j.duration || 1)}
                  onChange={(e) => j.seek(Number(e.target.value))}
                  disabled={!j.playable}
                  style={{ ['--fill' as string]: `${j.duration ? (j.position / j.duration) * 100 : 0}%` }}
                  aria-valuetext={`${formatTime(j.position)} de ${formatTime(j.duration)}`}
                />
              </label>

              {!j.track.spotify && (
              <div className={styles.vol}>
                <button
                  type="button"
                  className={styles.volIcon}
                  onClick={() => j.setVolume(j.volume > 0 ? 0 : 0.7)}
                  aria-label={j.volume > 0 ? 'Silenciar' : 'Ativar som'}
                >
                  {j.volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <input
                  aria-label="Volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={j.volume}
                  onChange={(e) => j.setVolume(Number(e.target.value))}
                  style={{ ['--fill' as string]: `${j.volume * 100}%` }}
                />
              </div>
              )}
            </div>

            {/* player oficial do Spotify — montado só depois do primeiro play */}
            <div className={styles.embedWrap} data-mounted={j.spotifyMounted || undefined}>
              <div ref={spotifyHost} className={styles.embedHost} />
            </div>

            {ext && (
              <a className={styles.extLink} href={ext} target="_blank" rel="noreferrer">
                {j.track.spotify ? 'abrir no Spotify' : 'ouvir na fonte'} <ExternalLink size={12} aria-hidden="true" />
              </a>
            )}
            {j.error && (
              <p className={styles.error} role="alert">
                {j.error}
              </p>
            )}
          </div>

          {/* ——— Lista ——— */}
          <ol className={styles.list} aria-label="Lista de faixas">
            {tracks.map((t, i) => {
              const active = i === j.index;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={styles.row}
                    onClick={() => j.select(i)}
                    aria-current={active ? 'true' : undefined}
                    aria-label={`${active && j.playing ? 'Pausar' : 'Tocar'} ${t.title} — ${t.artist}`}
                    data-cursor={active && j.playing ? 'pausar' : 'tocar'}
                  >
                    <span className={styles.rowNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.thumb}>
                      <Cover track={t} i={i} />
                    </span>
                    <span className={styles.rowText}>
                      <span className={styles.rowTitle}>{t.title}</span>
                      <span className={styles.rowArtist}>{t.artist}</span>
                    </span>
                    <span className={styles.rowState} aria-hidden="true">
                      {active && j.playing ? (
                        <Equalizer bars={4} playing getAnalyser={j.analyser} size="sm" />
                      ) : (
                        <Play size={14} />
                      )}
                    </span>
                    <span className={styles.rowDur}>
                      {t.demo ? formatTime(trackDuration(t)) : (t.from ?? '—')}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
