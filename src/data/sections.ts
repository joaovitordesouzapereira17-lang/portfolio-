export type SectionId = 'inicio' | 'trabalhos' | 'sobre' | 'jukebox' | 'videoteca' | 'contato';

export interface SectionMeta {
  id: SectionId;
  num: string;
  label: string;
  /** Descrição curta usada no índice */
  blurb: string;
}

/**
 * Todas as seções, na ordem do site.
 * `enabled: false` esconde a seção do menu, do trilho lateral e da página —
 * para reativar Trabalhos e Sobre mim quando o conteúdo chegar, troque para true.
 * A numeração (01, 02…) é recalculada sozinha.
 */
const all: (Omit<SectionMeta, 'num'> & { enabled: boolean })[] = [
  { id: 'inicio', label: 'Início', blurb: 'capa / apresentação', enabled: true },
  { id: 'trabalhos', label: 'Trabalhos', blurb: 'projetos selecionados', enabled: true },
  { id: 'sobre', label: 'Sobre mim', blurb: 'quem, como, com o quê', enabled: false },
  { id: 'jukebox', label: 'Jukebox', blurb: 'trilhas da videoteca', enabled: true },
  { id: 'videoteca', label: 'Videoteca', blurb: 'filmes de referência', enabled: true },
  { id: 'contato', label: 'Contato', blurb: 'vamos conversar', enabled: true },
];

export const sections: SectionMeta[] = all
  .filter((s) => s.enabled)
  .map(({ enabled: _e, ...s }, i) => ({ ...s, num: String(i + 1).padStart(2, '0') }));

export const isEnabled = (id: SectionId) => sections.some((s) => s.id === id);

/** Metadados de uma seção (inclusive desativadas, para quando forem reativadas) */
export const sectionMeta = (id: SectionId): SectionMeta =>
  sections.find((s) => s.id === id) ?? { ...all.find((s) => s.id === id)!, num: '—' };
