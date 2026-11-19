export type SectionId =
  | 'inicio'
  | 'trabalhos'
  | 'sobre'
  | 'jukebox'
  | 'videoteca'
  | 'contato';

export interface SectionMeta {
  id: SectionId;
  num: string;
  label: string;
  /** Descrição curta usada no índice */
  blurb: string;
}

export const sections: SectionMeta[] = [
  { id: 'inicio', num: '01', label: 'Início', blurb: 'capa / apresentação' },
  { id: 'trabalhos', num: '02', label: 'Trabalhos', blurb: 'projetos selecionados' },
  { id: 'sobre', num: '03', label: 'Sobre mim', blurb: 'quem, como, com o quê' },
  { id: 'jukebox', num: '04', label: 'Jukebox', blurb: 'trilha de trabalho' },
  { id: 'videoteca', num: '05', label: 'Videoteca', blurb: 'filmes de referência' },
  { id: 'contato', num: '06', label: 'Contato', blurb: 'vamos conversar' },
];
