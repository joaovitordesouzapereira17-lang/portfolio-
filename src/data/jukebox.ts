/**
 * JUKEBOX — dados das faixas.
 *
 * Para adicionar música real (somente com autorização / licença):
 *  - `src`: arquivo de áudio em /public/audio (ex.: '/audio/minha-faixa.mp3')
 *  - `link`: página externa para ouvir (Spotify, YouTube, Bandcamp, SoundCloud…)
 *  - `cover`: imagem da capa em /public/jukebox (ex.: '/jukebox/capa.jpg')
 *
 * As faixas com `demo` são esboços sintetizados no próprio navegador
 * (Web Audio), sem nenhum arquivo ou música de terceiros. Apague-as quando
 * colocar as faixas reais.
 */

export interface DemoPattern {
  bpm: number;
  /** nota MIDI de referência */
  root: number;
  wave: OscillatorType;
  /** semitons relativos à raiz, por colcheia; null = pausa */
  lead: (number | null)[];
  bass: (number | null)[];
  /** repetições do padrão */
  loops: number;
  kick?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string;
  cover?: string;
  src?: string;
  link?: string;
  demo?: DemoPattern;
}

export const tracks: Track[] = [
  {
    id: 'demo-01',
    title: 'Demo 01 — Pulso',
    artist: 'Sintetizador do navegador',
    album: 'Faixas demonstrativas',
    demo: {
      bpm: 112,
      root: 64,
      wave: 'square',
      lead: [0, null, 7, null, 12, 10, 7, null, 3, null, 5, 7, null, 3, 2, null],
      bass: [-24, null, null, -24, null, null, -17, null, -20, null, null, -20, null, null, -19, null],
      loops: 6,
      kick: true,
    },
  },
  {
    id: 'demo-02',
    title: 'Demo 02 — Fita cassete',
    artist: 'Sintetizador do navegador',
    album: 'Faixas demonstrativas',
    demo: {
      bpm: 88,
      root: 60,
      wave: 'triangle',
      lead: [12, null, 7, 3, null, 7, 12, null, 14, null, 10, 7, null, 5, 3, null],
      bass: [-12, null, null, null, -12, null, -5, null, -9, null, null, null, -9, null, -7, null],
      loops: 6,
    },
  },
  {
    id: 'demo-03',
    title: 'Demo 03 — Modem',
    artist: 'Sintetizador do navegador',
    album: 'Faixas demonstrativas',
    demo: {
      bpm: 132,
      root: 69,
      wave: 'sawtooth',
      lead: [0, 3, 7, 10, 12, 10, 7, 3, 0, 3, 7, 10, 15, 12, 10, 7],
      bass: [-24, null, -24, null, -24, null, -22, null, -27, null, -27, null, -26, null, -22, null],
      loops: 6,
      kick: true,
    },
  },
  {
    id: 'demo-04',
    title: 'Demo 04 — Madrugada',
    artist: 'Sintetizador do navegador',
    album: 'Faixas demonstrativas',
    demo: {
      bpm: 76,
      root: 57,
      wave: 'sine',
      lead: [12, null, null, 15, null, 19, null, null, 17, null, null, 15, null, 12, null, null],
      bass: [-12, null, null, null, null, null, null, null, -16, null, null, null, null, null, null, null],
      loops: 6,
    },
  },
];
