/**
 * TRABALHOS — projetos do portfólio.
 *
 * Para adicionar um projeto, copie o objeto da Daidai e troque os campos.
 * Imagens em /public/trabalhos/<projeto>/ (webp ~1600px + versão -800 para miniatura).
 * Textos tirados do material do próprio projeto; nada inventado.
 */

export type WorkCategory =
  | 'Design gráfico'
  | 'Identidade visual'
  | 'Social media'
  | 'Audiovisual'
  | 'Projeto acadêmico'
  | 'Projeto pessoal';

export interface WorkImage {
  src: string;
  thumb: string;
  alt: string;
  /** proporção largura/altura, evita salto de layout */
  ratio: number;
}

export interface Work {
  id: string;
  title: string;
  /** detalhe tipográfico opcional (ex.: ideograma do nome) */
  glyph?: string;
  tagline: string;
  year: string;
  categories: WorkCategory[];
  summary: string[];
  deliverables: string[];
  tools?: string[];
  palette?: { name: string; hex: string; ink: string }[];
  mascots?: { src: string; alt: string; on: string }[];
  cover: WorkImage;
  gallery: WorkImage[];
  /** créditos de terceiros e uso de IA, como no material original */
  credits?: string;
  link?: { label: string; href: string };
  /** cores do "encarte" do projeto dentro do site */
  theme: { paper: string; ink: string; accent: string; accentInk: string };
}

const d = (name: string, alt: string, ratio = 1.5): WorkImage => ({
  src: `/trabalhos/daidai/${name}.webp`,
  thumb: `/trabalhos/daidai/${name}-800.webp`,
  alt,
  ratio,
});

export const works: Work[] = [
  {
    id: 'daidai-coffee',
    title: 'Daidai Coffee',
    glyph: '橙',
    tagline: 'Sua pausa em tom de laranja',
    year: '2026',
    categories: ['Identidade visual', 'Projeto acadêmico'],
    summary: [
      'Marca para uma cafeteria alternativa pensada para jovens criativos: estudantes, designers, artistas e publicitários. A proposta é uma pausa genuína na rotina acelerada, com referências à cultura japonesa usadas com contexto, e não como decoração.',
      'Daidai (橙) é um cítrico japonês de casca laranja. O nome traz a cor da marca e o ritmo da repetição “dai-dai”: o movimento que segue e a pausa que mantém.',
    ],
    deliverables: [
      'Conceito, posicionamento e arquétipos',
      'Naming',
      'Paleta e tipografia',
      'Mascote em várias poses',
      'Grafismos de apoio',
      'Tom de voz e vocabulário',
      'Embalagens e aplicações',
      'Mídia kit de patrocínio',
    ],
    palette: [
      { name: 'Laranja Daidai', hex: '#FF7722', ink: '#2A1810' },
      { name: 'Polpa', hex: '#FAC388', ink: '#2A1810' },
      { name: 'Brasa', hex: '#C4531F', ink: '#FFF6EA' },
      { name: 'Folha', hex: '#5F7A3B', ink: '#FFF6EA' },
      { name: 'Grão', hex: '#2A1810', ink: '#FFF6EA' },
      { name: 'Creme', hex: '#FFF6EA', ink: '#2A1810' },
    ],
    mascots: [
      { src: '/trabalhos/daidai/tigre-cafe.webp', alt: 'Tigre laranja segurando uma caneca', on: '#FFF6EA' },
      { src: '/trabalhos/daidai/tigre-cafe-polpa.webp', alt: 'Tigre em polpa segurando uma caneca', on: '#FF7722' },
      { src: '/trabalhos/daidai/tigre-croissant.webp', alt: 'Tigre sentado segurando um croissant', on: '#C4531F' },
      { src: '/trabalhos/daidai/tigre-acenando.webp', alt: 'Tigre sentado acenando com a pata', on: '#5F7A3B' },
    ],
    cover: d('copos', 'Copos de café Daidai Coffee em laranja e polpa, com o tigre e a frase “Sua pausa em tom de laranja”', 4 / 3),
    gallery: [
      d('poster', 'Cartaz verde “Alimente a tua curiosidade”, com o tigre lendo um livro, apoiado numa escada de pedra'),
      d('kit', 'Sacola, copo, garrafa de café gelado e papel de embrulho com grafismos da Daidai sobre uma mesa preta', 4 / 3),
      d('embalagem', 'Embalagem de grãos de especialidade Daidai Coffee ao lado de um copo com o tigre'),
      d('caixas', 'Caixas de bolo Fuji Cake em polpa e laranja com selo do tigre', 4 / 3),
      d('ecobag', 'Ecobag creme com o tigre acenando, pendurada numa parede de tijolos à noite'),
    ],
    credits:
      'Projeto acadêmico. Ilustração do tigre de autoria não identificada, adaptada (recolorida) para uso acadêmico; grafismos gerados com apoio de IA, depois selecionados, vetorizados e ajustados pelo autor.',
    theme: { paper: '#FFF6EA', ink: '#2A1810', accent: '#FF7722', accentInk: '#2A1810' },
  },
];
