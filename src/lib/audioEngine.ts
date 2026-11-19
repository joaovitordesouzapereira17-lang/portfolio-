import type { DemoPattern, Track } from '../data/jukebox';

/**
 * Motor de áudio do Jukebox.
 * - Nunca toca sozinho: o AudioContext só é criado após um clique.
 * - Arquivos (`src`) usam um único <audio>; demos são sintetizadas.
 * - Um AnalyserNode alimenta o equalizador com dados reais.
 */

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export function demoDuration(p: DemoPattern): number {
  const step = 60 / p.bpm / 2;
  return p.lead.length * step * p.loops;
}

export class JukeboxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  analyser: AnalyserNode | null = null;
  private audio: HTMLAudioElement | null = null;
  private audioNode: MediaElementAudioSourceNode | null = null;
  private synthBus: GainNode | null = null;
  private synthStart = 0;
  private synthDuration = 0;
  private endTimer = 0;
  private mode: 'none' | 'synth' | 'file' = 'none';
  private volume = 0.7;
  onEnded: () => void = () => {};

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.master = ctx.createGain();
    this.master.gain.value = this.volume;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.78;
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);
    this.ctx = ctx;
    return ctx;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.master) this.master.gain.value = v;
  }

  /** Inicia a faixa a partir de `offset` segundos. Deve ser chamado por um gesto do usuário. */
  async play(track: Track, offset = 0) {
    this.stop();
    const ctx = this.ensure();
    if (ctx.state === 'suspended') await ctx.resume();

    if (track.src) {
      if (!this.audio) {
        this.audio = new Audio();
        this.audio.preload = 'metadata';
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audioNode = ctx.createMediaElementSource(this.audio);
        this.audioNode.connect(this.master!);
      }
      if (!this.audio.src.endsWith(track.src)) this.audio.src = track.src;
      this.audio.currentTime = offset;
      this.mode = 'file';
      await this.audio.play();
    } else if (track.demo) {
      this.mode = 'synth';
      this.playSynth(track.demo, offset);
    }
  }

  private playSynth(p: DemoPattern, offset: number) {
    const ctx = this.ctx!;
    const step = 60 / p.bpm / 2;
    const total = demoDuration(p);
    const bus = ctx.createGain();
    bus.gain.value = 0.22;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    bus.connect(filter);
    filter.connect(this.master!);
    this.synthBus = bus;

    const t0 = ctx.currentTime + 0.05 - offset;
    this.synthStart = t0;
    this.synthDuration = total;
    const steps = p.lead.length * p.loops;

    const voice = (freq: number, at: number, len: number, type: OscillatorType, gain: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(gain, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      o.connect(g).connect(bus);
      o.start(at);
      o.stop(at + len + 0.02);
    };

    const kick = (at: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(140, at);
      o.frequency.exponentialRampToValueAtTime(42, at + 0.18);
      g.gain.setValueAtTime(0.9, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      o.connect(g).connect(bus);
      o.start(at);
      o.stop(at + 0.25);
    };

    for (let i = 0; i < steps; i++) {
      const at = t0 + i * step;
      if (at < ctx.currentTime) continue;
      const k = i % p.lead.length;
      const l = p.lead[k];
      const b = p.bass[k];
      if (l !== null) voice(midiToHz(p.root + l), at, step * 0.9, p.wave, 0.32);
      if (b !== null) voice(midiToHz(p.root + b), at, step * 1.8, 'sine', 0.55);
      if (p.kick && k % 4 === 0) kick(at);
    }

    this.endTimer = window.setTimeout(() => this.onEnded(), (t0 + total - ctx.currentTime) * 1000);
  }

  pause() {
    this.stop();
  }

  private stop() {
    window.clearTimeout(this.endTimer);
    if (this.synthBus && this.ctx) {
      const bus = this.synthBus;
      bus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.015);
      window.setTimeout(() => bus.disconnect(), 120);
      this.synthBus = null;
    }
    this.audio?.pause();
    this.mode = 'none';
  }

  /** posição atual em segundos */
  position(): number {
    if (this.mode === 'file' && this.audio) return this.audio.currentTime;
    if (this.mode === 'synth' && this.ctx) {
      return Math.min(Math.max(0, this.ctx.currentTime - this.synthStart), this.synthDuration);
    }
    return 0;
  }

  /** duração do arquivo carregado (NaN até ler metadados) */
  fileDuration(): number {
    return this.audio?.duration ?? NaN;
  }

  dispose() {
    this.stop();
    this.ctx?.close();
  }
}
