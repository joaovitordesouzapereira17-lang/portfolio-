import { films } from '../../data/videoteca';
import { PosterArt } from '../../components/decor/PosterArt';

export const filmNum = (i: number) => String(i + 1).padStart(2, '0');
export const filmTitle = (i: number) => films[i].title || `Filme ${filmNum(i)}`;

/** Pôster real (se informado) ou provisório gerado */
export function Poster({ i }: { i: number }) {
  const f = films[i];
  return f.poster ? (
    <img src={f.poster} alt="" loading="lazy" decoding="async" />
  ) : (
    <PosterArt variant={i} num={filmNum(i)} />
  );
}
