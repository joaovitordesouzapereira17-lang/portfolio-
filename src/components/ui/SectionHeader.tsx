import { motion } from 'motion/react';
import { MaskText } from './MaskText';
import { fadeUp } from '../../lib/motion';
import styles from './SectionHeader.module.css';

interface Props {
  num: string;
  title: string;
  kicker?: string;
}

/** Abertura de seção: numeração editorial + título revelado por máscara */
export function SectionHeader({ num, title, kicker }: Props) {
  return (
    <header className={styles.head}>
      <motion.p className={`mono ${styles.kicker}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <span className={styles.num}>{num}</span>
        {kicker && <span>{kicker}</span>}
      </motion.p>
      <MaskText as="h2" lines={[title.toUpperCase()]} className={styles.title} />
    </header>
  );
}
