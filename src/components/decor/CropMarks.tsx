import styles from './CropMarks.module.css';

/** Marcas de corte de gráfica nos quatro cantos do container pai (position: relative) */
export function CropMarks({ inset = '1rem' }: { inset?: string }) {
  return (
    <div className={styles.marks} style={{ ['--inset' as string]: inset }} aria-hidden="true">
      <span className={styles.tl} />
      <span className={styles.tr} />
      <span className={styles.bl} />
      <span className={styles.br} />
    </div>
  );
}
