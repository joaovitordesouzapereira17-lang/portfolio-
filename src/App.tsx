import { useCallback, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { sections, isEnabled, sectionMeta } from './data/sections';
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
import { Works } from './sections/Works/Works';
import { FloatingSticker } from './components/stickers/FloatingSticker';
import { PlaceholderSection } from './sections/Placeholder/PlaceholderSection';

const ids = sections.map((s) => s.id);

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
        {/* Trabalhos e Sobre mim: desativadas em src/data/sections.ts até o conteúdo chegar */}
        {isEnabled('trabalhos') && <Works />}
        {isEnabled('sobre') && (
          <>
        <TornEdge seed="sobre" color="var(--c-paper)" fibre="var(--c-paper-dim)" />
        <PlaceholderSection meta={sectionMeta('sobre')} tone="paper" note="Apresentação pessoal com espaço para fotografia — próxima etapa.">
          <FloatingSticker name="smiley" pos={{ top: '14%', right: '14%' }} rotate={-10} mobile={{ pos: { top: '0.75rem', right: '4%' }, size: '5.5rem' }} />
          <FloatingSticker name="rec" pos={{ bottom: '8%', left: '6%' }} rotate={6} delay={0.15} size="clamp(7rem, 4.5rem + 6vw, 11rem)" mobile={{ pos: { top: '42%', right: '8%' }, size: '7rem' }} />
          <FloatingSticker name="coracao" pos={{ top: '46%', right: '40%' }} rotate={8} delay={0.3} size="clamp(5rem, 3.5rem + 4vw, 8rem)" hideOnMobile />
        </PlaceholderSection>
          </>
        )}
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
