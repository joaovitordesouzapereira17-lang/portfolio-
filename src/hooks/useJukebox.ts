import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { Track } from '../data/jukebox';
import { JukeboxEngine, demoDuration } from '../lib/audioEngine';
import { loadSpotifyApi, toSpotifyUri, type SpotifyController } from '../lib/spotify';

export function trackDuration(t: Track, known?: number): number {
  if (t.demo) return demoDuration(t.demo);
  return known && Number.isFinite(known) ? known : 0;
}

export const isPlayable = (t: Track) => Boolean(t.spotify || t.src || t.demo);

/**
 * Estado e controles do player. Nada toca até o usuário apertar play.
 * Fontes: Spotify (embed oficial), arquivo local (`src`) ou demo sintetizada.
 * @param spotifyHost container onde o player do Spotify é montado
 */
export function useJukebox(tracks: Track[], spotifyHost: RefObject<HTMLDivElement | null>) {
  const engine = useRef<JukeboxEngine | null>(null);
  const sp = useRef<SpotifyController | null>(null);
  const spLoaded = useRef<string | null>(null);
  const spActive = useRef(false);
  const spWasPlaying = useRef(false);
  const onEndedRef = useRef<() => void>(() => {});

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [knownDur, setKnownDur] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [error, setError] = useState<string | null>(null);
  const [spotifyMounted, setSpotifyMounted] = useState(false);

  const getEngine = () => (engine.current ??= new JukeboxEngine());
  const track = tracks[index];
  const duration = trackDuration(track, knownDur);

  /** Cria (uma vez) o controlador do Spotify dentro do container */
  const ensureSpotify = useCallback(
    async (uri: string): Promise<SpotifyController> => {
      if (sp.current) return sp.current;
      const api = await loadSpotifyApi();
      const host = spotifyHost.current;
      if (!host) throw new Error('host');
      const el = document.createElement('div');
      host.appendChild(el);
      return new Promise((resolve) => {
        api.createController(el, { uri, width: '100%', height: 80 }, (c) => {
          sp.current = c;
          spLoaded.current = uri;
          c.addListener('playback_update', ({ data }) => {
            if (!spActive.current) return;
            const pos = data.position / 1000;
            const dur = data.duration / 1000;
            setPosition(pos);
            if (dur > 0) setKnownDur(dur);
            const nowPlaying = !data.isPaused;
            setPlaying(nowPlaying);
            if (nowPlaying) setLoading(false);
            // fim da faixa (ou da prévia de 30s)
            if (spWasPlaying.current && data.isPaused && dur > 0 && pos >= dur - 1.2) onEndedRef.current();
            spWasPlaying.current = nowPlaying;
          });
          setSpotifyMounted(true);
          let done = false;
          c.addListener('ready', () => {
            if (done) return;
            done = true;
            resolve(c);
          });
        });
      });
    },
    [spotifyHost],
  );

  const stopOthers = (next: Track) => {
    if (!next.spotify && sp.current && spActive.current) sp.current.pause();
    if (next.spotify) engine.current?.pause();
    spActive.current = Boolean(next.spotify);
  };

  const start = useCallback(
    async (i: number, offset = 0) => {
      const t = tracks[i];
      if (i !== index) setKnownDur(0);
      setIndex(i);
      setPosition(offset);
      setError(null);
      stopOthers(t);
      if (!isPlayable(t)) {
        setPlaying(false);
        return;
      }
      try {
        if (t.spotify) {
          const uri = toSpotifyUri(t.spotify);
          setLoading(true);
          const c = await ensureSpotify(uri);
          spWasPlaying.current = false;
          if (spLoaded.current !== uri) {
            c.loadUri(uri);
            spLoaded.current = uri;
            c.play();
          } else if (offset > 0) {
            c.seek(offset);
            c.resume();
          } else {
            c.play();
          }
          setPlaying(true);
        } else {
          await getEngine().play(t, offset);
          setPlaying(true);
        }
      } catch {
        setPlaying(false);
        setLoading(false);
        setError(
          t.spotify
            ? 'Não consegui carregar o Spotify aqui. Use o botão "abrir no Spotify".'
            : 'Não foi possível reproduzir esta faixa.',
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracks, index, ensureSpotify],
  );

  const pause = useCallback(() => {
    if (track.spotify) {
      sp.current?.pause();
    } else {
      const e = engine.current;
      if (e) {
        setPosition(e.position());
        e.pause();
      }
    }
    setPlaying(false);
  }, [track]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void start(index, duration && position >= duration - 0.5 ? 0 : position);
  }, [playing, pause, start, index, position, duration]);

  const select = useCallback(
    (i: number) => {
      if (i === index) toggle();
      else void start(i, 0);
    },
    [index, toggle, start],
  );

  const go = useCallback(
    (i: number) => {
      if (playing) void start(i, 0);
      else {
        stopOthers(tracks[i]);
        setIndex(i);
        setPosition(0);
        setKnownDur(0);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playing, start, tracks],
  );

  const next = useCallback(() => go((index + 1) % tracks.length), [go, index, tracks.length]);

  const prev = useCallback(() => {
    if (position > 3) {
      if (playing) void start(index, 0);
      else setPosition(0);
      return;
    }
    go((index - 1 + tracks.length) % tracks.length);
  }, [go, index, playing, position, start, tracks.length]);

  const seek = useCallback(
    (t: number) => {
      if (track.spotify && sp.current && spActive.current) {
        sp.current.seek(t);
        setPosition(t);
      } else if (playing) void start(index, t);
      else setPosition(t);
    },
    [playing, start, index, track],
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    engine.current?.setVolume(v);
  }, []);

  // avanço automático
  onEndedRef.current = () => {
    const last = index === tracks.length - 1;
    if (last) {
      setPlaying(false);
      setPosition(0);
    } else {
      void start(index + 1, 0);
    }
  };
  useEffect(() => {
    getEngine().onEnded = () => onEndedRef.current();
  }, []);

  // posição para fontes locais (Spotify informa via evento)
  useEffect(() => {
    if (!playing || track.spotify) return;
    const t = window.setInterval(() => {
      const e = engine.current;
      if (!e) return;
      setPosition(e.position());
      const d = e.fileDuration();
      if (Number.isFinite(d)) setKnownDur(d);
    }, 100);
    return () => window.clearInterval(t);
  }, [playing, track]);

  useEffect(
    () => () => {
      engine.current?.dispose();
      sp.current?.destroy();
    },
    [],
  );

  const analyser = useCallback(() => (spActive.current ? null : engine.current?.analyser ?? null), []);

  return {
    track,
    index,
    playing,
    loading,
    position,
    duration,
    volume,
    error,
    spotifyMounted,
    playable: isPlayable(track),
    analyser,
    toggle,
    select,
    next,
    prev,
    seek,
    setVolume,
  };
}

export const formatTime = (s: number) => {
  const v = Math.max(0, Math.floor(s));
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
};
