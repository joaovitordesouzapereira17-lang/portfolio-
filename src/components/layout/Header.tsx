import { Plus } from 'lucide-react';
import { sections } from '../../data/sections';
import { site } from '../../data/site';
import { useClock } from '../../hooks/useClock';
import styles from './Header.module.css';

interface Props {
  active: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuButtonRef: React.Ref<HTMLButtonElement>;
}

export function Header({ active, menuOpen, onToggleMenu, menuButtonRef }: Props) {
  const time = useClock();
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <header className={styles.header}>
      <a href="#inicio" className={styles.logo} aria-label={`${site.name} — voltar ao início`} data-cursor="topo">
        <span className={styles.logoMark}>JV</span>
      </a>

      <p className={`mono ${styles.where}`} aria-live="polite">
        <span className={styles.num}>{current.num}</span>
        <span className={styles.slash}>/</span>
        <span>{current.label}</span>
      </p>

      <p className={`mono ${styles.status}`} aria-hidden="true">
        <span className={styles.rec} /> REC <span className={styles.time}>{time}</span>
      </p>

      <button
        ref={menuButtonRef}
        type="button"
        className={styles.menuBtn}
        aria-expanded={menuOpen}
        aria-controls="index-menu"
        onClick={onToggleMenu}
        data-cursor={menuOpen ? 'fechar' : 'índice'}
      >
        <span className="mono">{menuOpen ? 'Fechar' : 'Índice'}</span>
        <Plus size={16} strokeWidth={2} className={styles.plus} data-open={menuOpen || undefined} aria-hidden="true" />
      </button>
    </header>
  );
}
