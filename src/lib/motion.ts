import type { Transition, Variants } from 'motion/react';

/** Curvas compartilhadas — mesmas do CSS (tokens.css) */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeSnap = [0.7, 0, 0.2, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 120, damping: 20, mass: 0.6 };

/**
 * Preferência "reduzir movimento" do sistema.
 * Quando ligada, nenhuma entrada esconde conteúdo: tudo já nasce no estado final
 * (o MotionConfig só desliga transformações; opacidade e atrasos seguiriam rodando).
 */
export const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Use em `initial={enter({...})}`: devolve `false` (sem estado inicial) com movimento reduzido */
export const enter = <T,>(from: T): T | false => (REDUCED ? false : from);

const still: Variants = { hidden: {}, show: {} };

/** Revelação por máscara: o filho sobe de dentro de um container com overflow hidden */
export const maskReveal: Variants = REDUCED
  ? still
  : {
      hidden: { y: '105%' },
      show: (i: number = 0) => ({
        y: '0%',
        transition: { duration: 0.9, ease: easeOut, delay: 0.08 * i },
      }),
    };

export const fadeUp: Variants = REDUCED
  ? still
  : {
      hidden: { opacity: 0, y: 24 },
      show: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: easeOut, delay: 0.06 * i },
      }),
    };

/** "Recorte colado": entra de leve rotação/escala, como papel batendo na mesa */
export const pasteIn: Variants = REDUCED
  ? { hidden: (r: number = 0) => ({ rotate: r }), show: (r: number = 0) => ({ rotate: r }) }
  : {
      hidden: { opacity: 0, scale: 1.08, rotate: 0 },
      show: (r: number = 0) => ({
        opacity: 1,
        scale: 1,
        rotate: r,
        transition: { duration: 0.5, ease: easeSnap },
      }),
    };
