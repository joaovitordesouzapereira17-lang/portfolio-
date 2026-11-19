/**
 * JUKEBOX — dados das faixas.
 *
 * Três formas de tocar música de verdade (use só fontes autorizadas):
 *  - `spotify`: link ou URI de uma faixa do Spotify. Toca pelo player oficial
 *    do Spotify (prévia de 30s para quem não está logado; faixa inteira para quem está).
 *  - `src`: arquivo de áudio próprio/licenciado em /public/audio (ex.: '/audio/faixa.mp3').
 *  - `link`: só um link externo (abre em nova aba).
 *
 * `cover` (opcional): imagem em /public/jukebox. Sem ela, uma capa provisória é gerada.
 * `from` (opcional): de qual filme/trilha a música vem.
 */

export interface DemoPattern {
  bpm: number;
  root: number;
  wave: OscillatorType;
  lead: (number | null)[];
  bass: (number | null)[];
  loops: number;
  kick?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  from?: string;
  year?: string;
  cover?: string;
  spotify?: string;
  src?: string;
  link?: string;
  /** esboço sintetizado no navegador (apenas demonstração) */
  demo?: DemoPattern;
}

export const tracks: Track[] = [
  {
    id: 'friend-in-me',
    title: "You've Got a Friend in Me",
    artist: 'Randy Newman',
    from: 'Toy Story',
    spotify: 'spotify:track:1sINKDxiDfZGUAIFfa0sgb',
  },
  {
    id: 'move-it',
    title: 'I Like to Move It',
    artist: 'Reel 2 Real feat. The Mad Stuntman',
    from: 'Madagascar',
    spotify: 'spotify:track:4l2ljvyXOCVNbD5ff7NpM7',
  },
  {
    id: 'heroes',
    title: '"Heroes"',
    artist: 'David Bowie',
    from: 'As Vantagens de Ser Invisível',
    spotify: 'spotify:track:7Jh1bpe76CNTCgdgAdBw4Z',
  },
  {
    id: 'dont-you',
    title: "Don't You (Forget About Me) — acústica",
    artist: 'Simple Minds',
    from: 'Clube dos Cinco',
    spotify: 'spotify:track:4KPOqOOs935KDbFQrpG9KB',
  },
];
