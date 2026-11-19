/**
 * VIDEOTECA — filmes de referência.
 *
 * Os itens abaixo são ESPAÇOS VAZIOS demonstrativos: nenhum filme, avaliação
 * ou opinião foi inventado. Para preencher, edite cada objeto:
 *  - title, year, director: dados do filme
 *  - comment: seu comentário pessoal (opcional)
 *  - poster: imagem em /public/videoteca (ex.: '/videoteca/filme.jpg')
 */
export interface Film {
  id: string;
  title?: string;
  year?: string;
  director?: string;
  comment?: string;
  poster?: string;
}

export const films: Film[] = Array.from({ length: 9 }, (_, i) => ({
  id: `slot-${String(i + 1).padStart(2, '0')}`,
}));
