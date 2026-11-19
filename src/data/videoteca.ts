/**
 * VIDEOTECA — filmes favoritos + tier list interativa.
 *
 * Cada filme:
 *  - poster: imagem em /public/videoteca (sem ela, um pôster provisório é gerado)
 *  - comment: comentário pessoal (opcional, aparece na ficha)
 *  - persona: perfil que o visitante recebe se esse filme ficar no topo da tier list dele
 *  - myTier: SUA classificação (S, A, B, C ou D). Quando todos os filmes tiverem
 *    `myTier`, a carteirinha final mostra a compatibilidade do visitante com você.
 */

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

export const tiers: { id: Tier; label: string }[] = [
  { id: 'S', label: 'obra-prima' },
  { id: 'A', label: 'revejo sempre' },
  { id: 'B', label: 'gosto muito' },
  { id: 'C', label: 'assisti, ok' },
  { id: 'D', label: 'não é pra mim' },
];

export interface Film {
  id: string;
  title: string;
  year: string;
  director: string;
  poster?: string;
  comment?: string;
  persona: { title: string; line: string };
  myTier?: Tier;
}

export const films: Film[] = [
  {
    id: 'scooby-doo',
    title: 'Scooby-Doo',
    year: '2002',
    director: 'Raja Gosnell',
    poster: '/videoteca/scooby-doo.webp',
    persona: { title: 'Detetive de sessão da tarde', line: 'Resolve qualquer mistério — desde que tenha lanche no caminho.' },
  },
  {
    id: 'madagascar',
    title: 'Madagascar',
    year: '2005',
    director: 'Eric Darnell e Tom McGrath',
    poster: '/videoteca/madagascar.webp',
    persona: { title: 'Espírito de férias', line: 'Sai da rotina na primeira oportunidade. E dança no caminho.' },
  },
  {
    id: 'shrek',
    title: 'Shrek',
    year: '2001',
    director: 'Andrew Adamson e Vicky Jenson',
    poster: '/videoteca/shrek.webp',
    persona: { title: 'Ogro de coração mole', line: 'Casca grossa por fora, camadas (como cebolas) por dentro.' },
  },
  {
    id: 'toy-story',
    title: 'Toy Story',
    year: '1995',
    director: 'John Lasseter',
    poster: '/videoteca/toy-story.webp',
    persona: { title: 'Guardião da infância', line: 'Ainda sabe onde guardou os brinquedos. Ao infinito e além.' },
  },
  {
    id: 'o-rei-leao',
    title: 'O Rei Leão',
    year: '1994',
    director: 'Roger Allers e Rob Minkoff',
    poster: '/videoteca/o-rei-leao.webp',
    persona: { title: 'Rei do drama', line: 'Chora no mesmo momento todas as vezes. Hakuna matata depois.' },
  },
  {
    id: 'o-cao-e-a-raposa',
    title: 'O Cão e a Raposa',
    year: '1981',
    director: 'Ted Berman, Richard Rich e Art Stevens',
    poster: '/videoteca/o-cao-e-a-raposa.webp',
    persona: { title: 'Amizade acima de tudo', line: 'Acredita que amigo de infância é para sempre — mesmo contra o mundo.' },
  },
  {
    id: 'reflexoes-de-um-liquidificador',
    title: 'Reflexões de um Liquidificador',
    year: '2010',
    director: 'André Klotzel',
    poster: '/videoteca/reflexoes-de-um-liquidificador.webp',
    persona: { title: 'Filósofo de cozinha', line: 'Pensar é moer, moer é pensar. Gosta do estranho e do brasileiro.' },
  },
  {
    id: 'efeito-borboleta',
    title: 'Efeito Borboleta',
    year: '2004',
    director: 'Eric Bress e J. Mackye Gruber',
    persona: { title: 'Viajante de linhas do tempo', line: 'Repassa cada escolha mil vezes antes de dormir.' },
  },
  {
    id: 'o-homem-do-futuro',
    title: 'O Homem do Futuro',
    year: '2011',
    director: 'Cláudio Torres',
    persona: { title: 'Saudosista do futuro', line: 'Voltaria no tempo só para refazer aquela festa.' },
  },
  {
    id: 'clube-dos-cinco',
    title: 'Clube dos Cinco',
    year: '1985',
    director: 'John Hughes',
    persona: { title: 'Rebelde da detenção', line: 'Não cabe em um rótulo só — e faz questão disso.' },
  },
  {
    id: 'la-la-land',
    title: 'La La Land',
    year: '2016',
    director: 'Damien Chazelle',
    poster: '/videoteca/la-la-land.webp',
    persona: { title: 'Sonhador de jazz', line: 'Escolhe o sonho, mesmo sabendo o preço. Dança em estacionamento.' },
  },
  {
    id: 'as-vantagens-de-ser-invisivel',
    title: 'As Vantagens de Ser Invisível',
    year: '2012',
    director: 'Stephen Chbosky',
    poster: '/videoteca/as-vantagens-de-ser-invisivel.webp',
    persona: { title: 'Infinito por um instante', line: 'Observa tudo em silêncio e guarda as músicas certas para a hora certa.' },
  },
  {
    id: 'sociedade-dos-poetas-mortos',
    title: 'Sociedade dos Poetas Mortos',
    year: '1989',
    director: 'Peter Weir',
    poster: '/videoteca/sociedade-dos-poetas-mortos.webp',
    persona: { title: 'Carpe diem ambulante', line: 'Sobe na mesa para ver o mundo de outro ângulo.' },
  },
];
