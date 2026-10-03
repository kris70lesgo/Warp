import Link from "next/link";
import type { CSSProperties } from "react";
import { WarpMark } from "@/components/brand";
import styles from "./landing-page.module.css";

const glyphs: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["010", "110", "010", "010", "010", "010", "111"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  I: ["111", "010", "010", "010", "010", "010", "111"],
  a: ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
  e: ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
  g: ["00000", "00000", "01111", "10001", "01111", "00001", "01110"],
  i: ["1", "0", "1", "1", "1", "1", "1"],
  l: ["10", "10", "10", "10", "10", "10", "01"],
  n: ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
  t: ["010", "010", "111", "010", "010", "010", "001"],
  r: ["00000", "00000", "10110", "11001", "10000", "10000", "10000"],
};

function DotBitmap({ value, word = false }: { value: string; word?: boolean }) {
  const pitchX = word ? 4 : 5;
  const radius = word ? 1.8 : 1.55;
  const chars = [...value];
  let cursor = 0;
  const dots: Array<{ x: number; y: number }> = [];

  for (const char of chars) {
    const rows = glyphs[char];
    if (!rows) continue;
    const width = Math.max(...rows.map((row) => row.length));
    rows.forEach((row, y) => {
      [...row].forEach((pixel, x) => {
        if (pixel === "1") dots.push({ x: cursor + x * pitchX + 1.55, y: y * 4 + 1.55 });
      });
    });
    cursor += width * pitchX + pitchX;
  }

  return (
    <svg
      className={word ? styles.dotWordArt : styles.dotMetricArt}
      viewBox={`0 0 ${Math.max(cursor - pitchX, 1)} 28`}
      role="img"
      aria-label={value}
      focusable="false"
    >
      {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={radius} />)}
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.sendArrow}>
      <path d="M8 14V2M3.5 6.5 8 2l4.5 4.5" />
    </svg>
  );
}

function Paperclip() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={styles.paperclip}>
      <path d="m7.1 10.8 5.8-5.9a3.4 3.4 0 0 1 4.8 4.8l-8.1 8.1a5 5 0 0 1-7.1-7.1l8.1-8.1" />
    </svg>
  );
}

function SpeedGauge() {
  const ticks = Array.from({ length: 23 }, (_, index) => {
    const angle = (190 + index * 5) * Math.PI / 180;
    const outer = 142;
    const inner = index % 5 === 0 ? 129 : 133;
    return {
      x1: 163 + Math.cos(angle) * inner,
      y1: 163 + Math.sin(angle) * inner,
      x2: 163 + Math.cos(angle) * outer,
      y2: 163 + Math.sin(angle) * outer,
      major: index % 5 === 0,
    };
  });

  return (
    <svg className={styles.gauge} viewBox="0 0 326 326" aria-hidden="true">
      <defs>
        <linearGradient id="warpGaugeArc" x1="7" y1="136" x2="312" y2="109" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9ab7" stopOpacity=".06" />
          <stop offset=".08" stopColor="#ff8caf" stopOpacity=".44" />
          <stop offset=".34" stopColor="#ff6796" stopOpacity=".94" />
          <stop offset=".58" stopColor="#ff6796" />
          <stop offset=".82" stopColor="#ffe7ed" stopOpacity=".74" />
          <stop offset=".94" stopColor="#fff8fa" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="warpGaugeShadow" x1="11" y1="136" x2="308" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6e1639" stopOpacity=".04" />
          <stop offset=".09" stopColor="#6e1639" stopOpacity=".17" />
          <stop offset=".52" stopColor="#72163d" stopOpacity=".18" />
          <stop offset=".78" stopColor="#7b1a43" stopOpacity=".1" />
          <stop offset="1" stopColor="#7b1a43" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="warpRadarBeam">
          <stop offset=".3" stopColor="#650f35" stopOpacity="0" />
          <stop offset=".45" stopColor="#650f35" stopOpacity=".025" />
          <stop offset=".7" stopColor="#650f35" stopOpacity=".065" />
          <stop offset=".9" stopColor="#650f35" stopOpacity=".08" />
          <stop offset="1" stopColor="#650f35" stopOpacity=".05" />
        </radialGradient>
        <linearGradient id="warpRadarEdge" x1="238" y1="33" x2="190.5" y2="115.4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe7ef" stopOpacity=".19" />
          <stop offset=".48" stopColor="#ffd1df" stopOpacity=".11" />
          <stop offset=".82" stopColor="#ffc6d7" stopOpacity=".045" />
          <stop offset="1" stopColor="#ffc6d7" stopOpacity="0" />
        </linearGradient>
        <filter id="warpRadarSoft"><feGaussianBlur stdDeviation="1.35" /></filter>
        <filter id="warpRadarHalo"><feGaussianBlur stdDeviation="5.2" /></filter>
        <filter id="warpGaugeBlur"><feGaussianBlur stdDeviation="11" /></filter>
      </defs>
      <path d="M11.34 136.26A154 154 0 0 1 307.71 110.33" fill="none" stroke="url(#warpGaugeShadow)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M6.91 135.48A158.5 158.5 0 0 1 311.94 108.79" fill="none" stroke="url(#warpGaugeArc)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19.22 137.65A146 146 0 0 1 236 36.56" fill="none" stroke="rgba(255,166,194,.31)" strokeWidth="1.15" />
      <path d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="#6a1238" opacity=".08" filter="url(#warpRadarHalo)" />
      <path d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="url(#warpRadarBeam)" filter="url(#warpRadarSoft)" />
      <path d="M238 33.1 190.5 115.4" stroke="url(#warpRadarEdge)" strokeWidth="1.25" strokeLinecap="round" filter="url(#warpRadarSoft)" />
      {ticks.map((tick, index) => (
        <line
          key={index}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="rgba(255,188,210,.34)"
          strokeWidth={tick.major ? 1.5 : 1}
        />
      ))}
      <ellipse cx="225" cy="166" rx="92" ry="76" fill="#fff" opacity=".055" filter="url(#warpGaugeBlur)" />
    </svg>
  );
}

function ContextWall() {
  return (
    <>
      <div className={styles.contextGlow} />
      <svg className={styles.contextBackdrop} viewBox="0 0 429 554" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wallBase" x2=".2" y2="1">
            <stop stopColor="#d4b0ee" stopOpacity=".2" />
            <stop offset=".58" stopColor="#bd8fca" stopOpacity=".32" />
            <stop offset="1" stopColor="#76425d" stopOpacity=".5" />
          </linearGradient>
          <linearGradient id="wallTop" x2="1" y2=".8">
            <stop stopColor="#d5c2ff" stopOpacity=".24" />
            <stop offset=".5" stopColor="#f2a0ee" stopOpacity=".36" />
            <stop offset="1" stopColor="#ff96da" stopOpacity=".38" />
          </linearGradient>
          <linearGradient id="wallMiddle" x2="1" y2=".2">
            <stop stopColor="#d6b5ec" stopOpacity=".42" />
            <stop offset=".55" stopColor="#e68fba" stopOpacity=".32" />
            <stop offset="1" stopColor="#e858b8" stopOpacity=".52" />
          </linearGradient>
          <linearGradient id="wallDeep" x2="1">
            <stop stopColor="#532b63" stopOpacity=".48" />
            <stop offset=".48" stopColor="#db538a" stopOpacity=".42" />
            <stop offset="1" stopColor="#566cab" stopOpacity=".44" />
          </linearGradient>
          <filter id="wallSoft"><feGaussianBlur stdDeviation="3.4" /></filter>
          <filter id="wallNoise"><feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="71" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <linearGradient id="wallFade" x2="0" y2="1">
            <stop stopColor="#000" />
            <stop offset=".54" stopColor="#000" />
            <stop offset=".62" stopColor="#000" stopOpacity=".18" />
            <stop offset=".65" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <mask id="wallMask"><rect width="429" height="554" fill="url(#wallFade)" /></mask>
        </defs>
        <rect x="-24" y="-8" width="480" height="570" fill="url(#wallBase)" />
        <g mask="url(#wallMask)" filter="url(#wallSoft)">
          <rect x="-24" y="22" width="106" height="149" rx="15" fill="#c8b4ea" fillOpacity=".42" />
          <rect x="88" y="22" width="247" height="150" rx="15" fill="url(#wallTop)" />
          <rect x="346" y="22" width="111" height="147" rx="15" fill="#ffe3df" fillOpacity=".48" />
          <rect x="-24" y="177" width="108" height="174" rx="15" fill="#d7b9e8" fillOpacity=".45" />
          <rect x="88" y="177" width="247" height="174" rx="15" fill="url(#wallMiddle)" />
          <rect x="344" y="175" width="113" height="176" rx="15" fill="#e858b8" fillOpacity=".52" />
          <rect x="-24" y="384" width="480" height="170" rx="20" fill="url(#wallDeep)" />
        </g>
        <g opacity=".55" filter="url(#wallSoft)" fill="none" stroke="#f8e9ff">
          <path d="M81 30v324M338 30v324M0 167h429" strokeWidth="8" />
        </g>
        <rect x="0" y="0" width="429" height="554" filter="url(#wallNoise)" opacity=".13" mask="url(#wallMask)" />
      </svg>
      <div className={styles.contextWindow} aria-hidden="true">
        <div className={styles.windowLines}><i /><i /><i /></div>
        <div className={styles.windowCode}>
          <span>supplier_profile</span><span>evidence_context</span><span>claims · sources · documents</span>
        </div>
        <div className={styles.windowResults}>
          <span className={styles.resultNode}><b>REGISTRY</b><i>verified</i></span>
          <span className={styles.resultNode}><b>CLAIMS</b><i>cross-checked</i></span>
          <span className={styles.resultNode}><b>SOURCES</b><i>linked</i></span>
        </div>
      </div>
    </>
  );
}

function ConnectionsMap() {
  return (
    <svg className={styles.connectionsMap} viewBox="0 0 429 238" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="networkFade" x2="0" y2="1">
          <stop stopColor="#000" />
          <stop offset=".5" stopColor="#000" />
          <stop offset=".67" stopColor="#000" stopOpacity=".46" />
          <stop offset=".83" stopColor="#000" stopOpacity=".15" />
          <stop offset=".96" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <mask id="networkMask"><rect width="429" height="238" fill="url(#networkFade)" /></mask>
      </defs>
      <g mask="url(#networkMask)" fill="none" strokeLinecap="round">
        <g stroke="#fff" strokeWidth="1">
          <path opacity=".2" d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76" />
          <path opacity=".3" d="M0 117h46c15 0 22 8 26 25 5 23 12 31 31 31h174c18 0 25-8 30-31 4-17 11-25 26-25h96" />
          <path opacity=".34" d="M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90" />
          <path opacity=".16" d="M0 228h120c17 0 25-5 28-18 4-15 10-20 28-20h81c18 0 25 6 28 20 4 13 11 18 28 18h116" />
          <path opacity=".26" d="M0 5H429M0 61H429M0 117H429" />
          <path opacity=".09" d="M0 173H429" />
        </g>
        <g stroke="#fff8dd" strokeWidth="1.15">
          <path opacity=".52" d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110" />
          <path opacity=".94" d="M0 117h88c15 0 22-8 25-25 4-24 12-31 31-31h129c20 0 27 7 31 31 3 17 10 25 26 25h99" />
        </g>
        <g>
          <circle cx="45" cy="117" r="6.5" fill="#fff" />
          <circle cx="133" cy="61" r="6.5" fill="#fff4a7" />
          <circle cx="189" cy="61" r="6.5" fill="#fff1a4" />
          <circle cx="319" cy="61" r="6.5" fill="#fff4a6" />
          <circle cx="319" cy="117" r="6.5" fill="#fff2a0" />
        </g>
      </g>
    </svg>
  );
}

const capabilityCards = [
  {
    kind: "speed",
    title: <>Investigation speed<br />From hours to minutes</>,
    metric: "4",
    unit: "hrs",
    caption: <>Manual supplier research<br />compressed to minutes</>,
    href: "/incidents/INC-1042",
    poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/167977c6-8539-46b1-9a15-8dba566f50b8.png",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130045_1a612b69-4854-4b34-8043-ccb91f2c60af.mp4",
  },
  {
    kind: "context",
    title: <>Evidence graph<br />Supplier context</>,
    metric: "3",
    unit: "suppliers",
    caption: <>Alternatives compared<br />within one incident</>,
    href: "/evidence",
    poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0446d1d5-e65e-4db5-8090-3e30d09afc43.png",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130054_dd005674-d693-4d81-80a5-357f7f10b3a3.mp4",
  },
  {
    kind: "connections",
    title: <>Intelligent connections<br />Cross-source context</>,
    metric: "1",
    unit: "graph",
    caption: <>Claims, sources, documents<br />and decisions linked</>,
    href: "/evidence",
    poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/da8d0242-4dee-4f6d-813f-a5887e86ad77.png",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_130103_7550f407-f14b-40a6-9616-7a26d7a8bd9f.mp4",
  },
] as const;

const cardClasses = {
  speed: styles.cardSpeed,
  context: styles.cardContext,
  connections: styles.cardConnections,
} as const;

const metricClasses = {
  speed: styles.metricSpeed,
  context: styles.metricContext,
  connections: styles.metricConnections,
} as const;

function CapabilityCard({ card, index }: { card: typeof capabilityCards[number]; index: number }) {
  return (
    <article className={`${styles.card} ${cardClasses[card.kind]}`} style={{ "--entrance-delay": `${0.46 + index * 0.12}s` } as CSSProperties}>
      <video className={styles.cardMedia} autoPlay muted loop playsInline preload="auto" poster={card.poster} aria-hidden="true">
        <source src={card.video} type="video/mp4" />
      </video>
      {card.kind === "speed" ? <SpeedGauge /> : card.kind === "context" ? <ContextWall /> : <ConnectionsMap />}
      <svg className={styles.cardGrain} viewBox="0 0 429 554" preserveAspectRatio="none" aria-hidden="true">
        <defs><filter id={`cardNoise-${card.kind}`} x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency=".54" numOctaves="3" seed="27" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncR type="linear" slope="1.8" intercept="-.25" /><feFuncG type="linear" slope="1.8" intercept="-.25" /><feFuncB type="linear" slope="1.8" intercept="-.25" /><feFuncA type="table" tableValues="0 .52" /></feComponentTransfer>
        </filter></defs>
        <rect width="429" height="554" filter={`url(#cardNoise-${card.kind})`} />
      </svg>
      <h3 className={styles.cardTitle}>{card.title}</h3>
      <div className={`${styles.metric} ${metricClasses[card.kind]}`}>
        <DotBitmap value={card.metric} />
        <span className={styles.metricUnit}>{card.unit}</span>
      </div>
      <p className={styles.cardCaption}>{card.caption}</p>
      <Link className={styles.learnMore} href={card.href}>Learn More</Link>
    </article>
  );
}

function SocialIcon({ kind }: { kind: "linkedin" | "github" | "medium" }) {
  if (kind === "linkedin") return <svg viewBox="0 0 30 30" aria-hidden="true"><path fill="currentColor" d="M5.1 3.6A2.9 2.9 0 1 0 5.1 9.4a2.9 2.9 0 0 0 0-5.8ZM2.7 11.4h4.8v15.9H2.7zm7.7 0H15v2.2h.1a5.5 5.5 0 0 1 4.9-2.7c5.2 0 6.2 3.4 6.2 7.8v8.6h-4.8v-7.6c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4v7.7h-4.8V11.4Z" /></svg>;
  if (kind === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.31-3.76-1.31-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.43.11-2.98 0 0 .94-.3 3.06 1.15a10.63 10.63 0 0 1 5.57 0c2.12-1.45 3.06-1.15 3.06-1.15.61 1.55.23 2.7.11 2.98.72.78 1.15 1.78 1.15 3 0 4.28-2.62 5.23-5.11 5.5.4.35.75 1.02.75 2.06V22c0 .29.2.63.76.52A11.1 11.1 0 0 0 12 .9Z" /></svg>;
  return <svg viewBox="0 0 1043.63 592.71" aria-hidden="true"><path fill="currentColor" d="M588.67 296.36c0 163.68-131.67 296.35-294.34 296.35S0 460.04 0 296.36 131.67 0 294.33 0s294.34 132.68 294.34 296.36M910.04 296.36c0 154.12-65.84 279.08-147.17 279.08S615.7 450.48 615.7 296.36 681.54 17.28 762.87 17.28s147.17 124.96 147.17 279.08M1043.63 296.36c0 137.98-23.17 249.83-51.75 249.83s-51.75-111.85-51.75-249.83S963.3 46.53 991.88 46.53s51.75 111.85 51.75 249.83" /></svg>;
}

export default function LandingPage() {
  return (
    <main className={styles.landing}>
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <video className={styles.heroVideo} autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroScrim} />
        <div className={styles.heroFrame}>
          <input className={styles.menuToggle} id="warp-menu" type="checkbox" aria-label="Toggle navigation" />
          <header className={styles.navbar}>
            <Link href="/" className={styles.brand} aria-label="Warp home">
              <WarpMark className={styles.brandMark} />
              <span>Warp</span>
            </Link>
            <nav className={styles.navLinks} aria-label="Primary navigation">
              <a href="#performance">Platform</a><a href="#evidence">Evidence</a><a href="#how">How it works</a><Link href="/dashboard">Dashboard</Link>
            </nav>
            <Link className={styles.navCta} href="/dashboard"><span>Open Warp</span></Link>
            <label htmlFor="warp-menu" className={styles.burger} aria-label="Open navigation"><i /><i /></label>
            <nav className={styles.mobileSheet} aria-label="Mobile navigation">
              <a href="#performance">Platform</a><a href="#evidence">Evidence</a><a href="#how">How it works</a><Link href="/dashboard">Dashboard</Link>
              <Link className={styles.mobileSheetCta} href="/dashboard">Open Warp</Link>
            </nav>
          </header>

          <div className={styles.heroContent}>
            <h1 id="hero-title" className={styles.heroTitle}>When suppliers fail, Warp finds what&apos;s next.</h1>
            <div className={styles.promptCard} aria-label="Warp investigation preview">
              <p className={styles.promptPlaceholder}>Investigate a supplier disruption with evidence from every source...</p>
              <div className={styles.toolbar}>
                <div className={styles.promptChips} aria-label="Investigation capabilities">
                  <span className={styles.promptChip}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2.5h7l3 3v8H3zM10 2.5v3h3M5.5 8h5M5.5 10.5h5" /></svg><span>Supplier evidence</span></span>
                  <span className={styles.promptChip}><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.3" /><path d="m10.2 10.2 3.3 3.3" /></svg><span>Live sources</span></span>
                  <span className={styles.promptChip}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 13 4v3.5c0 3.2-2 5.3-5 6.7-3-1.4-5-3.5-5-6.7V4zM5.6 7.8l1.6 1.6 3.3-3.2" /></svg><span>Human review</span></span>
                </div>
                <div className={styles.toolbarRight}>
                  <span className={styles.modelLabel}>Evidence graph <svg viewBox="0 0 8 5" aria-hidden="true"><path d="m1 1 3 3 3-3" /></svg></span>
                  <span className={styles.attachIcon} aria-hidden="true"><Paperclip /></span>
                  <Link className={styles.sendButton} href="/incidents/INC-1042" aria-label="Open live supplier incident"><ArrowUp /></Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.proof}>
            <p>AI prepares. Humans authorize.</p>
            <div className={styles.proofBrands} aria-label="Technology partners">
              <span className={styles.sanityWordmark}>sanity<span>®</span></span>
              <span className={styles.gleifWordmark}>GLEIF</span>
              <span className={styles.xanoWordmark}>xano</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.performance} id="performance" aria-labelledby="performance-title">
        <video className={`${styles.stageMotion} ${styles.stageMotionWide}`} autoPlay muted loop playsInline preload="auto" poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/5c3ec08f-2dbf-4c0a-8588-f6106a789443.webp" aria-hidden="true">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125226_45cb4f38-aa7e-47e1-885d-ae0b69745369.mp4" type="video/mp4" />
        </video>
        <video className={`${styles.stageMotion} ${styles.stageMotionNarrow}`} autoPlay muted loop playsInline preload="none" poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/0f4926a4-e660-4df2-9195-2bfb3e341bdd.webp" aria-hidden="true">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_125242_daae1570-386d-4bd5-8896-80499e2371e0.mp4" type="video/mp4" />
        </video>
        <svg className={styles.paperTexture} aria-hidden="true" width="0" height="0">
          <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" seed="8" /></filter>
          <pattern id="paperFiber" width="24" height="24" patternTransform="rotate(17)" patternUnits="userSpaceOnUse"><path d="M0 12h24" stroke="#aaa" strokeOpacity=".08" /></pattern>
          <rect width="100%" height="100%" filter="url(#paperNoise)" />
        </svg>
        <div className={styles.performanceInner}>
          <header className={styles.masthead}>
            <h2 id="performance-title" className={styles.performanceTitle}>
              <span className={styles.headlineLine}>Built for <span className={styles.dotWord}><DotBitmap value="Intelligent" word /></span></span>
              <span className={styles.headlineLine}>Performance</span>
            </h2>
            <p className={styles.intro}>Every response brings supplier records, documents and live signals into a linked evidence graph—so teams can assess alternatives and decide with confidence.</p>
          </header>
          <div className={styles.cards} id="evidence" aria-label="Warp response capabilities">
            {capabilityCards.map((card, index) => <CapabilityCard key={card.kind} card={card} index={index} />)}
          </div>
        </div>
      </section>

      <section className={styles.footerScene} id="how" aria-label="About Warp">
        <video className={styles.footerVideo} autoPlay muted loop playsInline preload="none" poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/693205bf-8048-456a-879e-4e0a1b85a098.webp" aria-label="Painted alpine panorama with a lone hiker facing a snow-capped peak above clouds">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_123836_11a3c5e0-713f-4bef-a8e9-7dd93bdea3b0.mp4" type="video/mp4" />
        </video>
        <div className={styles.footerScrim} />
        <footer className={styles.glassFooter}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrandRow}><WarpMark className={styles.footerMark} /><span className={styles.footerWordmark}>Warp</span></div>
            <p className={styles.footerTagline}>Every supplier decision grounded in evidence, ready for human review.</p>
            <nav className={styles.footerNav} aria-label="Footer navigation">
              <div className={`${styles.footerColumn} ${styles.footerColOne}`}><h3>PLATFORM</h3><ul><li><Link href="/dashboard">Incident response</Link></li><li><Link href="/evidence">Supplier evidence</Link></li><li><Link href="/suppliers">Supplier network</Link></li><li><a href="#performance">Decision workflow</a></li></ul></div>
              <div className={`${styles.footerColumn} ${styles.footerColTwo}`}><h3>CAPABILITIES</h3><ul><li><Link href="/evidence">Evidence graph</Link></li><li><Link href="/integrations">Live intelligence</Link></li><li><Link href="/documents">Document analysis</Link></li><li><Link href="/approvals">Human approvals</Link></li></ul></div>
              <div className={`${styles.footerColumn} ${styles.footerColThree}`}><h3>RESOURCES</h3><ul><li><Link href="/business">Why Warp</Link></li><li><Link href="/audit">Audit ledger</Link></li><li><a href="#top">Back to top</a></li><li><Link href="/integrations">Integrations</Link></li></ul></div>
            </nav>
            <div className={styles.footerRule} />
            <div className={styles.footerBottom}>
              <p className={styles.legal}>© 2026 Warp. AI prepares. Humans authorize.</p>
              <div className={styles.socials}>
                <span role="img" aria-label="LinkedIn profile coming soon"><SocialIcon kind="linkedin" /></span>
                <a href="https://github.com/kris70lesgo/Warp" aria-label="Warp on GitHub"><SocialIcon kind="github" /></a>
                <span role="img" aria-label="Medium profile coming soon"><SocialIcon kind="medium" /></span>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
