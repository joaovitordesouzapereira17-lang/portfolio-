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
- Nomes/ordem das seções: `src/data/sections.ts`.
- Cores e fontes: `src/styles/tokens.css`.
- Jukebox: `src/data/jukebox.ts` — `src` (arquivo autorizado em `public/audio`), `link` (plataforma externa) e `cover` (imagem em `public/jukebox`). As faixas DEMO são sintetizadas no navegador e podem ser apagadas.
- Videoteca: `src/data/videoteca.ts` — `title`, `year`, `director`, `comment` e `poster` (imagem em `public/videoteca`). Sem pôster, um provisório é gerado.

## Status

- Etapa 1 — identidade visual, navegação e Início.
- Etapa 2 — Jukebox e Videoteca. Mural removido.
- Pendentes: Trabalhos, Sobre mim e Contato (provisórias, "em montagem").
