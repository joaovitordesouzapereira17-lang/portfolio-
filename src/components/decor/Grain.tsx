import styles from './Grain.module.css';

/** Camada de ruído de impressão sobre o site inteiro (estática, sem custo de animação) */
export function Grain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
