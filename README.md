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

## Status

Etapa 1 — identidade visual, navegação e Início. Seções 02–07 estão provisórias ("em montagem").
