import { useCallback, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { sections } from './data/sections';
import { useActiveSection } from './hooks/useActiveSection';
import { Header } from './components/layout/Header';
import { SideRail } from './components/layout/SideRail';
import { IndexMenu } from './components/layout/IndexMenu';
import { Grain } from './components/decor/Grain';
import { Cursor } from './components/decor/Cursor';
import { Hero } from './sections/Hero/Hero';
import { PlaceholderSection } from './sections/Placeholder/PlaceholderSection';

const ids = sections.map((s) => s.id);
const byId = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<string, (typeof sections)[number]>;

export default function App() {
  const active = useActiveSection(ids);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuBtn.current?.focus();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header
        active={active}
        menuOpen={menuOpen}
        onToggleMenu={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        menuButtonRef={menuBtn}
      />
      <IndexMenu open={menuOpen} active={active} onClose={closeMenu} />
      <SideRail active={active} />

      <main id="conteudo">
        <Hero />
        {/* Etapa 1: seções abaixo são provisórias, apenas para validar navegação e ritmo de cores */}
        <PlaceholderSection meta={byId.trabalhos} tone="black" note="Galeria de projetos com dados separados — próxima etapa." />
        <PlaceholderSection meta={byId.sobre} tone="paper" note="Apresentação pessoal com espaço para fotografia — próxima etapa." />
        <PlaceholderSection meta={byId.jukebox} tone="blue" note="Player visual sem áudio automático — próxima etapa." />
        <PlaceholderSection meta={byId.videoteca} tone="black" note="Pôsteres em grade assimétrica com fichas — próxima etapa." />
        <PlaceholderSection meta={byId.mural} tone="purple" note="Parede de referências em colagem — próxima etapa." />
        <PlaceholderSection meta={byId.contato} tone="wine" note="Links configuráveis em src/data/site.ts — próxima etapa." />
      </main>

      <Grain />
      <Cursor />
    </MotionConfig>
  );
}
