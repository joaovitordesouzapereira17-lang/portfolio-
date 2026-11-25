import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react';
import { sections } from '../../data/sections';
import { site } from '../../data/site';
import { MaskText } from '../../components/ui/MaskText';
import { Marquee } from '../../components/ui/Marquee';
import { Tape } from '../../components/ui/Tape';
import { CropMarks } from '../../components/decor/CropMarks';
import { fadeUp } from '../../lib/motion';
import { FloatingSticker } from '../../components/stickers/FloatingSticker';
import styles from './Contact.module.css';

const meta = sections.find((s) => s.id === 'contato')!;

interface Channel {
  key: string;
  label: string;
  display: string;
  href: string;
  copy: string;
  external?: boolean;
  extra?: { label: string; href: string };
}

const formatPhone = (d: string) =>
  d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d;

function channels(): Channel[] {
  const c = site.contact;
  const list: Channel[] = [];
  if (c.email) list.push({ key: 'email', label: 'E-mail', display: c.email, href: `mailto:${c.email}`, copy: c.email });
  if (c.phone)
    list.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      display: formatPhone(c.phone),
      href: `https://wa.me/55${c.phone}`,
      copy: formatPhone(c.phone),
      external: true,
      extra: { label: 'ligar', href: `tel:+55${c.phone}` },
    });
  if (c.linkedin)
    list.push({
      key: 'linkedin',
      label: 'LinkedIn',
      display: c.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com/, ''),
      href: c.linkedin,
      copy: c.linkedin,
      external: true,
    });
  if (c.instagram)
    list.push({ key: 'instagram', label: 'Instagram', display: c.instagram, href: c.instagram, copy: c.instagram, external: true });
  if (c.behance)
    list.push({ key: 'behance', label: 'Behance', display: c.behance, href: c.behance, copy: c.behance, external: true });
  return list;
}

/**
 * 06 — CONTATO
 * Fecho da revista: chamada tipográfica, canais em lista editorial
 * (abrir / copiar) e rodapé.
 */
export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);
  const list = channels();

  const copy = async (ch: Channel) => {
    try {
      await navigator.clipboard.writeText(ch.copy);
      setCopied(ch.key);
      window.setTimeout(() => setCopied((k) => (k === ch.key ? null : k)), 1800);
    } catch {
      window.prompt('Copie o contato:', ch.copy);
    }
  };

  return (
    <section id="contato" className={styles.section} aria-labelledby="contato-title">
      <CropMarks inset="1.25rem var(--gutter)" />

      <FloatingSticker name="disquete" pos={{ top: '7rem', right: '26%' }} rotate={-14} size="clamp(6rem, 4rem + 5vw, 10rem)" hideOnMobile />
      <FloatingSticker name="coracao" pos={{ bottom: '7.5rem', right: '9%' }} rotate={10} delay={0.2} size="clamp(5rem, 3.5rem + 4vw, 8.5rem)" />

      <div className={styles.top}>
        <motion.p className={`mono ${styles.kicker}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className={styles.num}>{meta.num}</span>
          <span>{meta.blurb}</span>
        </motion.p>

        <h2 id="contato-title" className={styles.title}>
          <MaskText lines={['Tem um']} className={styles.titleSmall} />
          <MaskText lines={['projeto?']} className={styles.titleBig} offset={1} />
          <MaskText lines={['vamos conversar.']} className={styles.titleOutline} offset={2} />
        </h2>

        <motion.div
          className={styles.sticker}
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 10 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 170, damping: 13, delay: 0.4 }}
          aria-hidden="true"
        >
          <span>manda</span>
          <span>um oi</span>
        </motion.div>
      </div>

      <ul className={styles.list}>
        {list.map((ch, i) => (
          <motion.li
            key={ch.key}
            className={styles.item}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            custom={i}
          >
            <a
              className={styles.link}
              href={ch.href}
              {...(ch.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              data-cursor="abrir"
            >
              <span className={styles.idx}>{String.fromCharCode(97 + i)})</span>
              <span className={styles.label}>{ch.label}</span>
              <span className={styles.value}>
                {ch.display.includes('@') ? (
                  <>
                    {ch.display.split('@')[0]}
                    <wbr />@{ch.display.split('@')[1]}
                  </>
                ) : (
                  ch.display
                )}
              </span>
              <ArrowUpRight className={styles.arrow} size={28} strokeWidth={1.6} aria-hidden="true" />
            </a>
            <div className={styles.actions}>
              {ch.extra && (
                <a className={styles.mini} href={ch.extra.href}>
                  {ch.extra.label}
                </a>
              )}
              <button
                type="button"
                className={styles.mini}
                onClick={() => copy(ch)}
                aria-label={`Copiar ${ch.label}`}
                data-done={copied === ch.key || undefined}
              >
                {copied === ch.key ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                <span aria-live="polite">{copied === ch.key ? 'copiado!' : 'copiar'}</span>
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className={styles.tape} aria-hidden="true">
        <Marquee items={['Design gráfico', 'Audiovisual', 'Publicidade', 'Vamos criar junto']} speed={26} reverse />
      </div>

      <footer className={styles.footer}>
        <p className="mono">
          © {site.edition} {site.name}
        </p>
        <Tape tilt={-2} tone="paper" className={styles.footTape}>
          feito à mão · react + muito café
        </Tape>
        <a href="#inicio" className={`mono ${styles.toTop}`} data-cursor="topo">
          voltar ao início <ArrowUp size={14} aria-hidden="true" />
        </a>
      </footer>
    </section>
  );
}
