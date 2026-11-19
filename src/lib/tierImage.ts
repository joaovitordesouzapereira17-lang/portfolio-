import { films, tiers, type Film, type Tier } from '../data/videoteca';

/**
 * Gera a imagem (PNG 1080×1350, formato de post) da tier list do visitante.
 * Desenha tudo em canvas: pôsteres reais quando existem, blocos tipográficos quando não.
 */

const C = { black: '#101014', wine: '#68152F', red: '#C8203D', blue: '#272A91', purple: '#7139A8', paper: '#ECE6DC' };
const tierColor: Record<Tier, string> = { S: C.red, A: C.wine, B: C.purple, C: C.blue, D: '#4a4650' };
const fallback = [C.wine, C.blue, C.purple, C.paper, '#3a3842', C.red];

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const r = Math.max(w / img.width, h / img.height);
  const sw = w / r;
  const sh = h / r;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

export async function renderTierImage(
  byTier: Record<Tier, Film[]>,
  persona: { title: string; line: string } | null,
  memberNo: string,
): Promise<Blob | null> {
  await Promise.all([
    document.fonts.load('80px Anton'),
    document.fonts.load('24px "Space Mono"'),
  ]).catch(() => undefined);

  const W = 1080;
  const H = 1350;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;

  const imgs = new Map<string, HTMLImageElement | null>();
  await Promise.all(films.map(async (f) => imgs.set(f.id, f.poster ? await loadImg(f.poster) : null)));

  // fundo + ruído leve
  ctx.fillStyle = C.black;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(236,230,220,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
  }

  // perfuração de película
  ctx.fillStyle = '#08080b';
  ctx.fillRect(0, 0, W, 34);
  ctx.fillStyle = 'rgba(236,230,220,0.85)';
  for (let x = 8; x < W; x += 36) ctx.fillRect(x, 11, 18, 12);

  // cabeçalho
  ctx.fillStyle = C.paper;
  ctx.font = '22px "Space Mono", monospace';
  ctx.fillText(`VIDEOTECA JV · SÓCIO Nº ${memberNo}`, 60, 92);
  ctx.font = '112px Anton, Impact, sans-serif';
  ctx.fillText('MINHA TIER LIST', 56, 210);
  if (persona) {
    ctx.fillStyle = C.red;
    ctx.font = '44px Anton, Impact, sans-serif';
    const label = persona.title.toUpperCase();
    const lw = ctx.measureText(label).width;
    ctx.fillRect(56, 236, lw + 28, 62);
    ctx.fillStyle = C.paper;
    ctx.fillText(label, 70, 284);
  }

  // fileiras
  const top = 330;
  const bottom = H - 90;
  const rowH = (bottom - top) / tiers.length;
  const labelW = 150;
  const areaX = 60 + labelW + 20;
  const areaW = W - areaX - 60;

  tiers.forEach((t, i) => {
    const y = top + i * rowH;
    ctx.fillStyle = tierColor[t.id];
    ctx.fillRect(60, y + 6, labelW, rowH - 12);
    ctx.fillStyle = C.paper;
    ctx.font = '84px Anton, Impact, sans-serif';
    const tw = ctx.measureText(t.id).width;
    ctx.fillText(t.id, 60 + (labelW - tw) / 2, y + rowH / 2 + 22);
    ctx.font = '15px "Space Mono", monospace';
    const cw = ctx.measureText(t.label.toUpperCase()).width;
    ctx.fillText(t.label.toUpperCase(), 60 + (labelW - cw) / 2, y + rowH - 26);

    ctx.strokeStyle = 'rgba(236,230,220,0.16)';
    ctx.strokeRect(areaX, y + 6, areaW, rowH - 12);

    const list = byTier[t.id];
    if (!list.length) return;
    const gap = 10;
    let ph = rowH - 32;
    let pw = ph / 1.5;
    const need = list.length * (pw + gap);
    if (need > areaW - 20) {
      pw = (areaW - 20) / list.length - gap;
      ph = pw * 1.5;
    }
    list.forEach((f, k) => {
      const x = areaX + 10 + k * (pw + gap);
      const py = y + (rowH - ph) / 2;
      const img = imgs.get(f.id);
      if (img) drawCover(ctx, img, x, py, pw, ph);
      else {
        const bg = fallback[films.indexOf(f) % fallback.length];
        ctx.fillStyle = bg;
        ctx.fillRect(x, py, pw, ph);
        ctx.fillStyle = bg === C.paper ? C.black : C.paper;
        ctx.font = `${Math.max(11, pw / 6)}px Anton, Impact, sans-serif`;
        const words = f.title.toUpperCase().split(' ');
        words.slice(0, 5).forEach((w, wi) => ctx.fillText(w, x + 6, py + ph - 8 - (Math.min(words.length, 5) - 1 - wi) * (pw / 5.4)));
      }
    });
  });

  // rodapé
  ctx.fillStyle = 'rgba(236,230,220,0.6)';
  ctx.font = '20px "Space Mono", monospace';
  ctx.fillText('feita no portfólio de João Vitor', 60, H - 40);
  const date = new Date().toLocaleDateString('pt-BR');
  const dw = ctx.measureText(date).width;
  ctx.fillText(date, W - 60 - dw, H - 40);

  return new Promise((res) => cv.toBlob((b) => res(b), 'image/png'));
}
