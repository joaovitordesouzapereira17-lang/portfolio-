import type { SectionMeta } from '../../data/sections';
import { SectionHeader } from '../../components/ui/SectionHeader';
import styles from './PlaceholderSection.module.css';

interface Props {
  meta: SectionMeta;
  tone: 'black' | 'wine' | 'blue' | 'purple' | 'paper';
  note: string;
}

/**
 * Seção provisória da ETAPA 1 — mantém a navegação funcionando
 * enquanto a linguagem visual é validada. Será substituída na etapa 2.
 */
export function PlaceholderSection({ meta, tone, note }: Props) {
  return (
    <section id={meta.id} className={styles.section} data-tone={tone} aria-label={meta.label}>
      <SectionHeader num={meta.num} title={meta.label} kicker={meta.blurb} />
      <div className={styles.stamp}>
        <span className="mono">Em montagem</span>
        <p>{note}</p>
      </div>
    </section>
  );
}
