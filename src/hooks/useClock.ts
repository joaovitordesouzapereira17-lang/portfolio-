import { useEffect, useState } from 'react';

/** Hora local do visitante, atualizada a cada segundo */
export function useClock(): string {
  const fmt = () =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return time;
}
