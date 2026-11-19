import { useCallback, useEffect, useRef, useState } from 'react';
import type { Track } from '../data/jukebox';
import { JukeboxEngine, demoDuration } from '../lib/audioEngine';

export function trackDuration(t: Track, fileDuration?: number): number {
  if (t.demo) return demoDuration(t.demo);
  return fileDuration && Number.isFinite(fileDuration) ? fileDuration : 0;
}

/** Estado e controles do player. Nada toca até o usuário apertar play. */
export function useJukebox(tracks: Track[]) {
  const engine = useRef<JukeboxEngine | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [fileDur, setFileDur] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [error, setError] = useState<string | null>(null);

  const getEngine = () => (engine.current ??= new JukeboxEngine());
  const track = tracks[index];
  const playable = (t: Track) => Boolean(t.src || t.demo);
  const duration = trackDuration(track, fileDur);

  const start = useCallback(
    async (i: number, offset = 0) => {
      const t = tracks[i];
      setIndex(i);
      setPosition(offset);
      setError(null);
      if (!playable(t)) {
        setPlaying(false);
        return;
      }
      try {
        await getEngine().play(t, offset);
        setPlaying(true);
      } catch {
        setPlaying(false);
        setError('Não foi possível reproduzir esta faixa.');
      }
    },
    [tracks],
  );

  const pause = useCallback(() => {
    const e = engine.current;
    if (!e) return;
    setPosition(e.position());
    e.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void start(index, position >= duration - 0.2 ? 0 : position);
  }, [playing, pause, start, index, position, duration]);

  const select = useCallback(
    (i: number) => {
      if (i === index) toggle();
      else void start(i, 0);
    },
    [index, toggle, start],
  );

  const next = useCallback(() => {
    const i = (index + 1) % tracks.length;
    if (playing) void start(i, 0);
    else {
      setIndex(i);
      setPosition(0);
    }
  }, [index, playing, start, tracks.length]);

  const prev = useCallback(() => {
    // como em players reais: volta ao começo se já passou de 3s
    if (position > 3) {
      if (playing) void start(index, 0);
      else setPosition(0);
      return;
    }
    const i = (index - 1 + tracks.length) % tracks.length;
    if (playing) void start(i, 0);
    else {
      setIndex(i);
      setPosition(0);
    }
  }, [index, playing, position, start, tracks.length]);

  const seek = useCallback(
    (t: number) => {
      if (playing) void start(index, t);
      else setPosition(t);
    },
    [playing, start, index],
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    engine.current?.setVolume(v);
  }, []);

  // avanço automático ao terminar a faixa
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    getEngine().onEnded = () => {
      const last = index === tracks.length - 1;
      if (last) {
        engine.current?.pause();
        setPlaying(false);
        setIndex(0);
        setPosition(0);
      } else {
        void start(index + 1, 0);
      }
    };
  }, [index, start, tracks.length]);

  // posição (10x por segundo é suficiente para o display)
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      const e = engine.current;
      if (!e) return;
      setPosition(e.position());
      const d = e.fileDuration();
      if (Number.isFinite(d)) setFileDur(d);
    }, 100);
    return () => window.clearInterval(t);
  }, [playing]);

  useEffect(() => () => engine.current?.dispose(), []);

  const analyser = useCallback(() => engine.current?.analyser ?? null, []);

  return {
    track,
    index,
    playing,
    position,
    duration,
    volume,
    error,
    playable: playable(track),
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
