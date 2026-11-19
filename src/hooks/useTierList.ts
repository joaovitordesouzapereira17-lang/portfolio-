import { useCallback, useEffect, useMemo, useState } from 'react';
import { films, tiers, type Film, type Tier } from '../data/videoteca';

export type Placement = Record<string, Tier>;

const KEY = 'jv-tierlist-v1';

function load(): Placement {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Placement;
    // ignora filmes que não existem mais
    return Object.fromEntries(Object.entries(parsed).filter(([id]) => films.some((f) => f.id === id)));
  } catch {
    return {};
  }
}

/** Estado da tier list do visitante (salvo só no navegador dele) */
export function useTierList() {
  const [placement, setPlacement] = useState<Placement>(load);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(placement));
    } catch {
      /* armazenamento indisponível: segue só em memória */
    }
  }, [placement]);

  const place = useCallback((id: string, tier: Tier | null) => {
    setPlacement((p) => {
      const next = { ...p };
      if (tier) next[id] = tier;
      else delete next[id];
      return next;
    });
    setSelected(null);
  }, []);

  const reset = useCallback(() => {
    setPlacement({});
    setSelected(null);
  }, []);

  const byTier = useMemo(() => {
    const map = Object.fromEntries(tiers.map((t) => [t.id, [] as Film[]])) as Record<Tier, Film[]>;
    for (const f of films) {
      const t = placement[f.id];
      if (t) map[t].push(f);
    }
    return map;
  }, [placement]);

  const pool = films.filter((f) => !placement[f.id]);
  const done = pool.length === 0;

  return { placement, byTier, pool, done, selected, setSelected, place, reset };
}

const order: Tier[] = ['S', 'A', 'B', 'C', 'D'];

/** Filme que define o perfil: o primeiro do tier mais alto */
export function topFilm(byTier: Record<Tier, Film[]>): Film | null {
  for (const t of order) if (byTier[t].length) return byTier[t][0];
  return null;
}

/** Compatibilidade com a lista do João (só quando todos os filmes têm myTier) */
export function compatibility(placement: Placement): number | null {
  if (!films.every((f) => f.myTier)) return null;
  const score =
    films.reduce((acc, f) => {
      const a = order.indexOf(placement[f.id]);
      const b = order.indexOf(f.myTier!);
      return acc + (a < 0 ? 0 : 1 - Math.abs(a - b) / 4);
    }, 0) / films.length;
  return Math.round(score * 100);
}
