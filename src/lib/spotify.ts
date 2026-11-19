/**
 * Integração com o player oficial do Spotify (Embed iFrame API).
 * O script só é carregado quando o visitante aperta play numa faixa do Spotify.
 * Sem login no Spotify, o próprio Spotify toca uma prévia de ~30s; logado, toca a faixa inteira.
 */

export interface SpotifyPlayback {
  isPaused: boolean;
  isBuffering: boolean;
  /** ms */
  duration: number;
  /** ms */
  position: number;
}

export interface SpotifyController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  seek(seconds: number): void;
  destroy(): void;
  addListener(event: 'ready', cb: () => void): void;
  addListener(event: 'playback_update', cb: (e: { data: SpotifyPlayback }) => void): void;
}

interface SpotifyIFrameAPI {
  createController(
    el: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    cb: (c: SpotifyController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

export function loadSpotifyApi(): Promise<SpotifyIFrameAPI> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    const s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    s.onerror = () => {
      apiPromise = null;
      reject(new Error('spotify-api'));
    };
    document.body.appendChild(s);
  });
  return apiPromise;
}

/** Aceita 'spotify:track:ID' ou 'https://open.spotify.com/track/ID?...' */
export function toSpotifyUri(value: string): string {
  if (value.startsWith('spotify:')) return value;
  const m = value.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/);
  return m ? `spotify:${m[1]}:${m[2]}` : value;
}

export function spotifyUrl(value: string): string {
  const [, type, id] = toSpotifyUri(value).split(':');
  return `https://open.spotify.com/${type}/${id}`;
}
