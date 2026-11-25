/**
 * Stickers do portfólio — redesenhados a partir da folha "Stickers" do Figma
 * (arquivo "João Vitor — Identidade do Portfólio"). SVG inline: nítidos,
 * usam as fontes do site e herdam a paleta dos tokens.
 * Todos ocupam uma caixa 260×260 (overflow visível para a borda de papel).
 */
import type { ReactElement } from 'react';
import styles from './Stickers.module.css';

const C = {
  black: 'var(--c-black)',
  wine: 'var(--c-wine)',
  red: 'var(--c-red)',
  blue: 'var(--c-blue)',
  purple: 'var(--c-purple)',
  paper: 'var(--c-paper)',
  paperDim: 'var(--c-paper-dim)',
};
const display = { fontFamily: 'var(--f-display)' };
const mono = { fontFamily: 'var(--f-mono)', fontWeight: 700 };

function starPoints(cx: number, cy: number, points: number, outer: number, inner: number, rot = -Math.PI / 2) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = rot + (i * Math.PI) / points;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** pixel art: cada caractere != '.' vira um quadrado; `border` desenha a borda de papel */
function Pixels({ map, px, ox, oy, colors, border }: { map: string[]; px: number; ox: number; oy: number; colors: Record<string, string>; border: number }) {
  const cells: { x: number; y: number; ch: string }[] = [];
  map.forEach((row, y) => [...row].forEach((ch, x) => ch !== '.' && cells.push({ x: ox + x * px, y: oy + y * px, ch })));
  return (
    <>
      {cells.map((c, i) => (
        <rect key={`b${i}`} x={c.x - border} y={c.y - border} width={px + border * 2} height={px + border * 2} fill={C.paper} />
      ))}
      {cells.map((c, i) => (
        <rect key={`p${i}`} x={c.x} y={c.y} width={px + 0.5} height={px + 0.5} fill={colors[c.ch]} />
      ))}
    </>
  );
}

const Selo = () => (
  <>
    <circle cx="130" cy="130" r="110" fill={C.red} stroke={C.paper} strokeWidth="7" />
    <defs>
      <path id="selo-ring" d="M130,130 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
    </defs>
    <g className={styles.spin}>
      <text style={{ ...mono, fontSize: 16, letterSpacing: '0.24em' }} fill={C.black}>
        <textPath href="#selo-ring" textLength="530">
          EXPLORE O PORTFÓLIO ✶ ROLE PARA BAIXO ✶
        </textPath>
      </text>
    </g>
    <circle cx="130" cy="130" r="46" fill={C.black} />
    <path d="M130 108 V150 M114 136 L130 152 L146 136" stroke={C.paper} strokeWidth="6" fill="none" strokeLinecap="square" />
  </>
);

const Estrela = () => (
  <>
    <polygon points={starPoints(130, 130, 14, 112, 87)} fill={C.red} stroke={C.paper} strokeWidth="7" strokeLinejoin="round" />
    <g transform="rotate(-8 130 130)">
      <text x="130" y="142" textAnchor="middle" style={{ ...display, fontSize: 58 }} fill={C.paper}>
        NOVO!
      </text>
      <text x="130" y="168" textAnchor="middle" style={{ ...mono, fontSize: 13 }} fill={C.black}>
        2026
      </text>
    </g>
  </>
);

const Smiley = () => (
  <>
    <circle cx="130" cy="130" r="105" fill={C.purple} stroke={C.paper} strokeWidth="7" />
    <ellipse cx="103" cy="97" rx="13" ry="23" fill={C.black} />
    <ellipse cx="157" cy="97" rx="13" ry="23" fill={C.black} />
    <path d="M78 146 Q130 206 182 146" stroke={C.black} strokeWidth="12" fill="none" strokeLinecap="round" />
    <ellipse cx="79" cy="79" rx="17" ry="9" fill={C.paper} opacity="0.35" transform="rotate(30 79 79)" />
  </>
);

const heartMap = [
  '..XXX...XXX..',
  '.XXXXX.XXXXX.',
  'XXHHXXXXXXXXX',
  'XXHXXXXXXXXXX',
  'XXXXXXXXXXXXX',
  '.XXXXXXXXXXX.',
  '..XXXXXXXXX..',
  '...XXXXXXX...',
  '....XXXXX....',
  '.....XXX.....',
  '......X......',
];
const Coracao = () => <Pixels map={heartMap} px={15} ox={32.5} oy={47.5} border={7} colors={{ X: C.red, H: C.paper }} />;

const Raio = () => (
  <>
    <path
      d="M155 15 L55 145 L130 145 L95 245 L225 95 L145 95 L195 15 Z"
      fill={C.blue}
      stroke={C.paper}
      strokeWidth="8"
      strokeLinejoin="round"
    />
    <polygon points={starPoints(206, 50, 4, 20, 5)} fill={C.paper} />
  </>
);

const Ticket = () => (
  <>
    <path
      d="M18 70 H242 Q248 70 248 76 V116 A14 14 0 0 0 248 144 V184 Q248 190 242 190 H18 Q12 190 12 184 V144 A14 14 0 0 0 12 116 V76 Q12 70 18 70 Z"
      fill={C.paper}
      stroke={C.wine}
      strokeWidth="2.5"
    />
    <line x1="180" y1="76" x2="180" y2="184" stroke={C.wine} strokeWidth="2" strokeDasharray="6 5" />
    <text x="30" y="122" style={{ ...display, fontSize: 34 }} fill={C.wine}>
      ADMIT ONE
    </text>
    <text x="32" y="150" style={{ ...mono, fontSize: 9, letterSpacing: '0.06em' }} fill={C.black}>
      VIDEOTECA JV · SESSÃO 01
    </text>
    <text x="214" y="124" textAnchor="middle" style={{ ...mono, fontSize: 13 }} fill={C.red}>
      <tspan x="214">Nº</tspan>
      <tspan x="214" dy="16">013</tspan>
    </text>
  </>
);

const cursorMap = [
  'B...........',
  'BB..........',
  'BWB.........',
  'BWWB........',
  'BWWWB.......',
  'BWWWWB......',
  'BWWWWWB.....',
  'BWWWWWWB....',
  'BWWWWWWWB...',
  'BWWWWWWWWB..',
  'BWWWWWBBBBB.',
  'BWWBWWB.....',
  'BWB.BWWB....',
  'BB..BWWB....',
  'B....BWWB...',
  '.....BWWB...',
  '......BB....',
];
const Cursor = () => <Pixels map={cursorMap} px={12} ox={62} oy={28} border={8} colors={{ B: C.black, W: C.paper }} />;

const Disquete = () => (
  <>
    <rect x="30" y="30" width="200" height="200" rx="10" fill={C.blue} stroke={C.paper} strokeWidth="7" />
    <rect x="75" y="30" width="110" height="64" fill={C.paperDim} />
    <rect x="140" y="40" width="26" height="44" fill={C.blue} />
    <rect x="55" y="128" width="150" height="96" rx="4" fill={C.paper} />
    <text x="68" y="168" style={{ ...display, fontSize: 26 }} fill={C.black}>
      PORTFÓLIO
    </text>
    <text x="70" y="190" style={{ ...mono, fontSize: 10 }} fill={C.red}>
      1.44 MB · 2026
    </text>
    <rect x="68" y="200" width="124" height="1.5" fill={C.black} opacity="0.3" />
    <rect x="68" y="210" width="124" height="1.5" fill={C.black} opacity="0.3" />
  </>
);

const Rec = () => (
  <>
    <rect x="30" y="88" width="200" height="84" rx="42" fill={C.black} stroke={C.paper} strokeWidth="7" />
    <circle cx="75" cy="130" r="17" fill={C.red} className={styles.recDot} />
    <text x="104" y="140" style={{ ...display, fontSize: 42 }} fill={C.paper}>
      REC
    </text>
    <text x="105" y="157" style={{ ...mono, fontSize: 10 }} fill={C.paper} opacity="0.7">
      00:12:08:24
    </text>
  </>
);

const Autoral = () => (
  <>
    <polygon points={starPoints(130, 130, 24, 112, 96)} fill={C.purple} stroke={C.paper} strokeWidth="6" strokeLinejoin="round" />
    <circle cx="130" cy="130" r="84" fill="none" stroke={C.paper} strokeWidth="2" strokeDasharray="4 4" />
    <text x="130" y="135" textAnchor="middle" style={{ ...display, fontSize: 56 }} fill={C.paper}>
      100%
    </text>
    <text x="130" y="168" textAnchor="middle" style={{ fontFamily: 'var(--f-grotesk)', fontWeight: 900, fontSize: 20 }} fill={C.black}>
      AUTORAL
    </text>
  </>
);

const Cassete = () => (
  <>
    <rect x="14" y="55" width="232" height="150" rx="10" fill={C.black} stroke={C.paper} strokeWidth="7" />
    <rect x="30" y="70" width="200" height="72" rx="4" fill={C.red} />
    <text x="40" y="88" style={{ ...mono, fontSize: 10 }} fill={C.paper}>
      TRILHA · LADO A
    </text>
    <rect x="68" y="96" width="124" height="34" rx="17" fill={C.black} />
    <g className={styles.reel}>
      <circle cx="95" cy="113" r="15" fill={C.paper} />
      <circle cx="95" cy="113" r="6" fill={C.black} />
    </g>
    <g className={styles.reel}>
      <circle cx="165" cy="113" r="15" fill={C.paper} />
      <circle cx="165" cy="113" r="6" fill={C.black} />
    </g>
    <path d="M55 190 L70 162 H190 L205 190 Z" fill={C.paperDim} />
    <circle cx="76" cy="176" r="4" fill={C.black} />
    <circle cx="184" cy="176" r="4" fill={C.black} />
  </>
);


const globeMap = [
  '.....HOOOOO.....',
  '...HHOOLLOOOO...',
  '..HOLLLLLOOOLO..',
  '.HOLLLLLLOOLLLO.',
  '.OOLLLLLOOOLLLO.',
  'OOOOLLLOOOOOLLOO',
  'OOOOOLLOOOOOOLOO',
  'OOOOOLLLLOOOOOOO',
  'OOOOOOLLLLOOOLOO',
  'OOOOOOLLLLOOLLLO',
  '.OOOOOOLLLOOLLL.',
  '.OOOOOOLLOOOOLO.',
  '..OOOOOLOOOOOO..',
  '...OOOOOOOOOO...',
  '.....OOOOOO.....',
];
const Globo = () => <Pixels map={globeMap} px={14} ox={18} oy={25} border={7} colors={{ O: C.blue, L: C.red, H: C.paper }} />;

const Monitor = () => (
  <>
    <rect x="30" y="26" width="200" height="156" rx="10" fill={C.paperDim} stroke={C.paper} strokeWidth="7" />
    <rect x="48" y="42" width="164" height="112" rx="6" fill={C.black} />
    <polyline
      points="56,102 98,102 110,72 124,134 138,90 148,102 204,102"
      fill="none"
      stroke={C.red}
      strokeWidth="4"
      strokeLinejoin="round"
      className={styles.pulse}
    />
    <rect x="98" y="182" width="64" height="12" fill={C.paperDim} />
    <rect x="22" y="192" width="216" height="46" rx="6" fill={C.paperDim} stroke={C.paper} strokeWidth="7" />
    <rect x="40" y="211" width="14" height="8" fill={C.red} />
    <rect x="150" y="212" width="70" height="6" fill={C.black} />
  </>
);

const Lixeira = () => (
  <>
    <path d="M62 78 H198 L184 244 H76 Z" fill={C.paperDim} stroke={C.paper} strokeWidth="7" strokeLinejoin="round" />
    {[92, 114, 136, 158].map((x, i) => (
      <path key={x} d={`M${x + 4 * i - 6} 96 L${x + 2 * i - 2} 228`} stroke={C.black} strokeWidth="6" strokeLinecap="round" />
    ))}
    <rect x="48" y="52" width="164" height="24" rx="5" fill={C.paperDim} stroke={C.paper} strokeWidth="7" />
    <path d="M104 52 V36 Q104 28 112 28 H148 Q156 28 156 36 V52" fill="none" stroke={C.paper} strokeWidth="14" />
    <path d="M104 52 V36 Q104 28 112 28 H148 Q156 28 156 36 V52" fill="none" stroke={C.paperDim} strokeWidth="7" />
  </>
);

const Lupa = () => (
  <>
    <line x1="150" y1="150" x2="226" y2="226" stroke={C.paper} strokeWidth="40" strokeLinecap="round" />
    <line x1="150" y1="150" x2="226" y2="226" stroke={C.black} strokeWidth="26" strokeLinecap="round" />
    <circle cx="108" cy="108" r="78" fill={C.paper} />
    <circle cx="108" cy="108" r="66" fill={C.paperDim} opacity="0.45" stroke={C.black} strokeWidth="14" />
    <path d="M70 92 A42 42 0 0 1 104 62" fill="none" stroke={C.paper} strokeWidth="9" strokeLinecap="round" />
  </>
);

const Celular = () => (
  <g transform="rotate(-12 130 130)">
    <rect x="72" y="8" width="116" height="112" rx="22" fill={C.blue} stroke={C.paper} strokeWidth="7" />
    <rect x="88" y="26" width="84" height="74" rx="6" fill={C.paper} />
    <text x="96" y="46" style={{ ...mono, fontSize: 10 }} fill={C.blue}>
      ✉ 1 NOVA
    </text>
    <rect x="96" y="56" width="68" height="4" fill={C.black} opacity="0.35" />
    <rect x="96" y="66" width="52" height="4" fill={C.black} opacity="0.35" />
    <rect x="96" y="76" width="60" height="4" fill={C.black} opacity="0.35" />
    <rect x="84" y="118" width="92" height="16" rx="4" fill={C.paperDim} />
    <rect x="72" y="132" width="116" height="120" rx="18" fill={C.blue} stroke={C.paper} strokeWidth="7" />
    <circle cx="130" cy="160" r="15" fill={C.paper} />
    <circle cx="130" cy="160" r="6" fill={C.red} />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={89 + (i % 3) * 29} y={184 + Math.floor(i / 3) * 15} width="24" height="10" rx="3" fill={C.paper} opacity="0.9" />
    ))}
  </g>
);

const Aviso = () => (
  <>
    <rect x="34" y="30" width="216" height="164" fill={C.blue} stroke={C.paper} strokeWidth="7" />
    <rect x="12" y="52" width="216" height="168" fill={C.paper} stroke={C.paper} strokeWidth="7" />
    <rect x="12" y="52" width="216" height="168" fill="none" stroke={C.black} strokeWidth="2" />
    <rect x="17" y="57" width="206" height="28" fill={C.blue} />
    <text x="27" y="76" style={{ ...mono, fontSize: 13 }} fill={C.paper}>
      aviso.exe
    </text>
    <rect x="198" y="61" width="20" height="19" fill={C.paper} stroke={C.black} strokeWidth="1.5" />
    <path d="M203 66 L213 76 M213 66 L203 76" stroke={C.black} strokeWidth="2.5" />
    <text x="120" y="132" textAnchor="middle" style={{ fontFamily: 'var(--f-grotesk)', fontWeight: 800, fontSize: 21 }} fill={C.black}>
      Mandar um oi?
    </text>
    <rect x="84" y="152" width="72" height="38" fill={C.paper} stroke={C.black} strokeWidth="2" />
    <rect x="90" y="158" width="60" height="26" fill="none" stroke={C.black} strokeWidth="1" strokeDasharray="2 2" />
    <text x="120" y="178" textAnchor="middle" style={{ fontFamily: 'var(--f-grotesk)', fontSize: 18 }} fill={C.black}>
      OK
    </text>
  </>
);

const filePath = 'M52 18 H168 L212 62 V244 H52 Z';
const Arquivo = ({ label, color, children }: { label: string; color: string; children: ReactElement }) => (
  <>
    <path d={filePath} fill={C.paper} stroke={C.paper} strokeWidth="12" strokeLinejoin="round" />
    <path d={filePath} fill={C.paper} stroke={C.black} strokeWidth="3" strokeLinejoin="round" />
    <path d="M168 18 V62 H212" fill={C.paperDim} stroke={C.black} strokeWidth="3" strokeLinejoin="round" />
    <rect x="30" y="70" width="148" height="52" fill={color} stroke={C.paper} strokeWidth="4" />
    <text x="104" y="111" textAnchor="middle" style={{ ...display, fontSize: 40 }} fill={C.paper}>
      {label}
    </text>
    {children}
  </>
);

const ArquivoJpg = () => (
  <Arquivo label="JPG" color={C.blue}>
    <>
      <path d="M78 186 Q132 140 186 186 Q132 232 78 186 Z" fill={C.paper} stroke={C.black} strokeWidth="5" />
      <circle cx="132" cy="186" r="19" fill={C.black} />
      <circle cx="139" cy="179" r="5" fill={C.paper} />
    </>
  </Arquivo>
);

const ArquivoFilme = () => (
  <Arquivo label="FILME" color={C.wine}>
    <>
      {[140, 162, 184, 206, 228].map((y) => (
        <g key={y}>
          <rect x="60" y={y - 8} width="12" height="10" fill={C.black} />
          <rect x="192" y={y - 8} width="12" height="10" fill={C.black} />
        </g>
      ))}
      <path d="M114 152 L162 184 L114 216 Z" fill={C.red} />
    </>
  </Arquivo>
);

export const stickerArt = {
  selo: Selo,
  estrela: Estrela,
  smiley: Smiley,
  coracao: Coracao,
  raio: Raio,
  ticket: Ticket,
  cursor: Cursor,
  disquete: Disquete,
  rec: Rec,
  autoral: Autoral,
  cassete: Cassete,
  globo: Globo,
  monitor: Monitor,
  lixeira: Lixeira,
  lupa: Lupa,
  celular: Celular,
  aviso: Aviso,
  jpg: ArquivoJpg,
  filme: ArquivoFilme,
} satisfies Record<string, () => ReactElement>;

export type StickerName = keyof typeof stickerArt;
