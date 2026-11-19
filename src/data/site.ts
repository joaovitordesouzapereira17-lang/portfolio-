/**
 * Dados gerais do site.
 * Edite aqui textos de apresentação e links de contato.
 * Contatos vazios ('') simplesmente não aparecem na seção Contato.
 */
export const site = {
  name: 'João Vitor',
  firstName: 'João',
  lastName: 'Vitor',
  roles: ['Design gráfico', 'Audiovisual', 'Publicidade'],
  intro:
    'Designer gráfico, editor de vídeo e estudante de Publicidade e Propaganda. Este site é um caderno de trabalho: peças, cortes, referências e coisas que me formam.',
  edition: '2026',
  contact: {
    email: 'joaovitordesouzapereira17@gmail.com',
    /** só números, com DDD — vira link de WhatsApp e de ligação */
    phone: '11970934843',
    linkedin: 'https://www.linkedin.com/in/joaovitordesouzapereira',
    instagram: '',
    behance: '',
  },
} as const;
