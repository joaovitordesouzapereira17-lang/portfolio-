import { sections } from '../../data/sections';
import styles from './SideRail.module.css';

/** Trilho lateral de progresso (desktop): numeração editorial clicável */
export function SideRail({ active }: { active: string }) {
  return (
    <nav className={styles.rail} aria-label="Seções">
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={styles.link}
              aria-current={active === s.id ? 'true' : undefined}
              data-cursor={s.label}
            >
              <span className={styles.bar} aria-hidden="true" />
              <span className={styles.num}>{s.num}</span>
              <span className="visually-hidden">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
