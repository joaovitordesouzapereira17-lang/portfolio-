# João Vitor — Portfólio

Editorial alternativo + Y2K + cultura digital. React · TypeScript · Vite · CSS Modules · Motion · Lucide.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # checagem de tipos + build de produção
```

## Estrutura

```
src/
  data/            conteúdo editável (textos, links, seções; depois projetos, músicas, filmes)
  styles/          tokens.css (paleta, tipo, espaço, movimento) + global.css
  lib/motion.ts    curvas e variants compartilhadas
  hooks/           useActiveSection, useClock, useMediaQuery
  components/
    layout/        Header, IndexMenu (sumário em tela cheia), SideRail
    ui/            MaskText, RetroWindow, Sticker, Marquee, SectionHeader
    decor/         Grain, CropMarks, Cursor
  sections/        uma pasta por seção (Hero, …)
```

## Onde editar

- Textos de apresentação e links de contato: `src/data/site.ts` (links vazios não viram botão).
- Nomes/ordem das seções: `src/data/sections.ts`. Para mostrar/esconder uma seção, troque `enabled` (Trabalhos e Sobre mim estão desligadas até o conteúdo chegar).
- Cores e fontes: `src/styles/tokens.css`.
- Jukebox: `src/data/jukebox.ts` — `spotify` (link ou URI de faixa; toca pelo player oficial do Spotify: prévia de 30s sem login, faixa inteira logado), `src` (arquivo próprio/licenciado em `public/audio`), `link` (externo) e `cover`.
- Videoteca / tier list: `src/data/videoteca.ts` — `title`, `year`, `director`, `poster` (em `public/videoteca`, de preferência .webp ~480px), `comment`, `persona` (perfil que o visitante recebe se o filme ficar no topo) e `myTier` (sua nota; com todos preenchidos, a carteirinha mostra a compatibilidade do visitante com você).

## Status

- Etapa 1 — identidade visual, navegação e Início.
- Etapa 2 — Jukebox e Videoteca. Mural removido.
- Etapa 3 — Jukebox com Spotify; Videoteca virou tier list interativa com carteirinha final (PNG).
- Pendentes: Trabalhos e Sobre mim (desligadas em `sections.ts`, aguardando conteúdo).
