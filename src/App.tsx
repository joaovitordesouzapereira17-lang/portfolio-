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
import { Jukebox } from './sections/Jukebox/Jukebox';
import { Videoteca } from './sections/Videoteca/Videoteca';
import { TornEdge } from './components/decor/TornEdge';
import { Contact } from './sections/Contact/Contact';
import { FloatingSticker } from './components/stickers/FloatingSticker';
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
        {/* Seções ainda provisórias: Trabalhos e Sobre mim */}
        <PlaceholderSection meta={byId.trabalhos} tone="black" note="Galeria de projetos com dados separados — próxima etapa.">
          <FloatingSticker name="estrela" pos={{ top: '12%', right: '18%' }} rotate={10} />
          <FloatingSticker name="autoral" pos={{ bottom: '10%', left: '38%' }} rotate={-8} delay={0.15} size="clamp(6rem, 4rem + 5vw, 9.5rem)" />
          <FloatingSticker name="raio" pos={{ top: '8%', left: '46%' }} rotate={12} delay={0.3} size="clamp(5.5rem, 4rem + 4vw, 8.5rem)" hideOnMobile />
        </PlaceholderSection>
        <TornEdge seed="sobre" color="var(--c-paper)" fibre="var(--c-paper-dim)" />
        <PlaceholderSection meta={byId.sobre} tone="paper" note="Apresentação pessoal com espaço para fotografia — próxima etapa.">
          <FloatingSticker name="smiley" pos={{ top: '14%', right: '14%' }} rotate={-10} />
          <FloatingSticker name="rec" pos={{ bottom: '8%', left: '6%' }} rotate={6} delay={0.15} size="clamp(7rem, 4.5rem + 6vw, 11rem)" />
          <FloatingSticker name="coracao" pos={{ top: '46%', right: '40%' }} rotate={8} delay={0.3} size="clamp(5rem, 3.5rem + 4vw, 8rem)" hideOnMobile />
        </PlaceholderSection>
        <TornEdge seed="jukebox" color="var(--c-blue)" />
        <Jukebox />
        <Videoteca />
        <TornEdge seed="contato" color="var(--c-wine)" />
        <Contact />
      </main>

      <Grain />
      <Cursor />
    </MotionConfig>
  );
}
