import type { Film } from '../../data/videoteca';
import { films } from '../../data/videoteca';
import { PosterArt } from '../../components/decor/PosterArt';

/** Pôster real (se informado) ou provisório gerado com o título */
export function Poster({ film }: { film: Film }) {
  return film.poster ? (
    <img src={film.poster} alt="" loading="lazy" decoding="async" draggable={false} />
  ) : (
    <PosterArt variant={films.indexOf(film)} title={film.title} year={film.year} />
  );
}
