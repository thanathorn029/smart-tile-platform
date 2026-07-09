"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const Icon = ({
  children,
  size = 16,
  strokeWidth = 2,
  style,
}: {
  children: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) => (
  <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

const Calculator = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h8" />
  </Icon>
);

const LayoutGrid = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </Icon>
);

const PanelTop = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="4" rx="1" />
    <rect x="3" y="9" width="14" height="12" rx="1" />
  </Icon>
);

const Package = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4.03a2 2 0 0 0-2 0l-7 4.03A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.03a2 2 0 0 0 2 0l7-4.03A2 2 0 0 0 21 16z" />
    <path d="M16 3.13v4.07M8 3.13v4.07" />
  </Icon>
);

const Layers = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M12 3 4 7.5l8 4.5 8-4.5L12 3z" />
    <path d="m4 12.5 8 4.5 8-4.5" />
    <path d="m4 17 8 4.5 8-4.5" />
  </Icon>
);

const Info = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </Icon>
);

const Ruler = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M3 17 17 3l4 4L7 21z" />
    <path d="m14 6 2 2M10.5 9.5l2 2M7 13l2 2" />
  </Icon>
);

const Copy = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Icon>
);

const Check = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const ChevronUp = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M18 15 12 9l-6 6" />
  </Icon>
);

type SurfaceType = "floor" | "wall";

type TileOption = {
  id: string;
  label: string;
  sub: string;
  coverage: number; // ตร.ม. ต่อกล่องกระเบื้อง
  notch: string; // ขนาดเกรียงหวีแนะนำ
  adhesiveCoverage: number; // ตร.ม. ต่อกระสอบปูนกาว (ตามขนาดเกรียงหวี)
};

type AdhesiveBrand = {
  id: string;
  name: string;
  tag: string;
  color: string;
  description: string;
  link: string;
};

const FLOOR_TILES: TileOption[] = [
  { id: "f30", label: "30 x 30 ซม.", sub: "(12 x 12 นิ้ว)", coverage: 1, notch: "6 มม.", adhesiveCoverage: 6 },
  { id: "f40", label: "40 x 40 ซม.", sub: "(16 x 16 นิ้ว)", coverage: 1, notch: "6–8 มม.", adhesiveCoverage: 5 },
  { id: "f60", label: "60 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44, notch: "8–10 มม.", adhesiveCoverage: 4 },
];

const WALL_TILES: TileOption[] = [
  { id: "w1016", label: "10 x 16 ซม.", sub: "", coverage: 1, notch: "6 มม.", adhesiveCoverage: 6 },
  { id: "w3045", label: "30 x 45 ซม.", sub: "", coverage: 1, notch: "6–8 มม.", adhesiveCoverage: 5 },
  { id: "w3060", label: "30 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44, notch: "8–10 มม.", adhesiveCoverage: 4 },
];

const ADHESIVE_BRANDS: AdhesiveBrand[] = [
  {
    id: "cotto-standard",
    name: "COTTO Standard",
    tag: "COTTO",
    color: "#2C6ECB",
    description: "กาวซีเมนต์สำหรับงานพื้นและผนังภายในอาคาร ติดแน่นและประหยัด เหมาะกับกระเบื้องมาตรฐาน",
    link: "https://www.cotto.com/product/tile-adhesive",
  },
  {
    id: "cotto-premium",
    name: "COTTO Premium",
    tag: "COTTO",
    color: "#D4AF37",
    description: "ปูนกาวเกรดพรีเมียม ทนต่อการใช้งานหนักและกระเบื้องขนาดใหญ่ ปูได้เสถียรลดโอกาสโก่งตัว",
    link: "https://www.cotto.com/product/tile-adhesive",
  },
  {
    id: "cotto-silver",
    name: "COTTO Silver",
    tag: "COTTO",
    color: "#9aa0ac",
    description: "สูตรแรงยึดเกาะสูงพิเศษ ออกแบบมาสำหรับปูทับพื้นผิวเดิมโดยเฉพาะ ห้ามใช้สูตรธรรมดาแทน",
    link: "https://www.cotto.com/product/tile-adhesive",
  },
  {
    id: "jorakay-green",
    name: "จระเข้เขียว",
    tag: "Jorakay",
    color: "#2FA35B",
    description: "ปูนกาวมาตรฐานสำหรับกระเบื้องทั่วไปและกระเบื้องขนาดใหญ่ ใช้ได้ทั้งภายในและภายนอก",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive/green-crocodile-tile-adhesive",
  },
  {
    id: "jorakay-red",
    name: "จระเข้แดง",
    tag: "Jorakay",
    color: "#E14B4B",
    description: "แรงยึดเกาะสูงพิเศษ เหมาะสำหรับกระเบื้องสระว่ายน้ำ กระเบื้องแผ่นใหญ่ และพื้นที่ที่ต้องแช่น้ำ",
    link: "https://www.dcctoyou.com/jorakay",
  },
  {
    id: "jorakay-silver",
    name: "จระเข้เงิน",
    tag: "Jorakay",
    color: "#c7cad1",
    description: "สำหรับกระเบื้องขนาดใหญ่มาก หินอ่อน หินแกรนิต และงานปูทับกระเบื้องเดิม ช่วยลดปัญหาโก่งตัว",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive",
  },
  {
    id: "jorakay-gold",
    name: "จระเข้ทอง",
    tag: "Jorakay",
    color: "#D4AF37",
    description: "ปูนขาว ไม่ทำให้โมเสกแก้วหรือหินอ่อนเปลี่ยนสี เกรดพรีเมียม ทนทุกสภาพอากาศ",
    link: "https://xn--12cfjb8g6bl2ezag5e8e9e.com/articles/crocodile-gold-cement-glue/",
  },
];

const GROUT_COVERAGE = 5; // ตร.ม. ต่อถุงยาแนว
const WASTE_OPTIONS = [0, 5, 10];
const BLUE = "#5B9BD5";
const RED = "#ED1B2E";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** Tweens a number toward its target so result changes feel alive instead of snapping. */
function useAnimatedNumber(target: number, duration = 380) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const diff = target - from;
    if (diff === 0) return;
    let raf = 0;
    let startTime: number | null = null;

    function tick(ts: number) {
      if (startTime === null) startTime = ts;
      const progress = Math.min(1, (ts - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + diff * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        setValue(target);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

/** Tracks whether the viewport matches a max-width breakpoint, so inline styles
 *  (which otherwise always beat CSS classes) can be swapped at runtime. */
function useIsNarrow(breakpoint: number) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isNarrow;
}

export default function TileMaterialCalculator() {
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("floor");
  const [area, setArea] = useState<number>(20);
  const [tileId, setTileId] = useState<string>(FLOOR_TILES[0].id);
  const [waste, setWaste] = useState<number>(10);
  const [overlay, setOverlay] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Breakpoints matching the CSS media queries below — used to override the
  // hard-coded inline gridTemplateColumns/position values on small screens.
  const isTablet = useIsNarrow(980);
  const isMobile = useIsNarrow(650);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const tiles = surfaceType === "floor" ? FLOOR_TILES : WALL_TILES;
  const activeTile = tiles.find((t) => t.id === tileId) ?? tiles[0];

  const effectiveArea = useMemo(() => {
    const a = Number(area) || 0;
    return Math.max(0, a) * (1 + waste / 100);
  }, [area, waste]);

  const results = useMemo(() => {
    const a = effectiveArea;
    return {
      boxes: Math.ceil(a / activeTile.coverage),
      adhesiveBags: Math.ceil(a / activeTile.adhesiveCoverage),
      groutBags: Math.ceil(a / GROUT_COVERAGE),
    };
  }, [effectiveArea, activeTile]);

  const animatedBoxes = useAnimatedNumber(results.boxes);
  const animatedAdhesive = useAnimatedNumber(results.adhesiveBags);
  const animatedGrout = useAnimatedNumber(results.groutBags);

  const recommendedAdhesive = useMemo(() => {
    if (overlay) {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-silver")!,
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-silver")!,
      ];
      return {
        brands,
        title: "งานปูทับกระเบื้องเดิม",
        detail: "ห้ามใช้ปูนกาวสูตรธรรมดา แนะนำ COTTO Silver และจระเข้เงิน เพราะให้แรงยึดเกาะสูงพอสำหรับปูทับพื้นผิวเดิม",
      };
    }

    if (surfaceType === "wall") {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-standard")!,
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-green")!,
      ];
      return {
        brands,
        title: "ผนังและงานภายในอาคาร",
        detail: "แนะนำทั้ง COTTO Standard และจระเข้เขียว ใช้คู่กันได้ดีในงานผนังภายในอาคาร",
      };
    }

    if (activeTile.id === "f60") {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-premium")!,
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-red")!,
      ];
      return {
        brands,
        title: "กระเบื้องพื้นขนาดใหญ่",
        detail: "แนะนำทั้ง COTTO Premium และจระเข้แดง สำหรับงานพื้นกระเบื้องขนาดใหญ่และพื้นที่รับแรงสูง",
      };
    }

    const brands = [
      ADHESIVE_BRANDS.find((b) => b.id === "cotto-standard")!,
      ADHESIVE_BRANDS.find((b) => b.id === "jorakay-green")!,
    ];
    return {
      brands,
      title: "งานพื้นทั่วไป",
      detail: "แนะนำทั้ง COTTO Standard และจระเข้เขียว สำหรับงานพื้นทั่วไป คุ้มค่าและเสถียร",
    };
  }, [overlay, surfaceType, activeTile]);

  function handleSurfaceChange(type: SurfaceType) {
    setSurfaceType(type);
    const list = type === "floor" ? FLOOR_TILES : WALL_TILES;
    setTileId(list[0].id);
  }

  function adjustArea(delta: number) {
    setArea((prev) => round2(Math.max(0, (Number(prev) || 0) + delta)));
  }

  function scrollToResult() {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function copySummary() {
    const lines = [
      `สรุปวัสดุปูกระเบื้อง (${surfaceType === "floor" ? "พื้น" : "ผนัง"} ${activeTile.label})`,
      `พื้นที่: ${round2(Number(area) || 0)} ตร.ม.${waste > 0 ? ` (เผื่อเสีย +${waste}% = ${round2(effectiveArea)} ตร.ม.)` : ""}`,
      `กระเบื้อง: ${results.boxes} กล่อง`,
      `ปูนกาว: ${results.adhesiveBags} กระสอบ (${recommendedAdhesive.brands.map((b) => b.name).join(" / ")})`,
      `ยาแนว: ${results.groutBags} ถุง`,
      `เกรียงหวีแนะนำ: ${activeTile.notch}`,
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  // Responsive overrides for inline styles — inline `style` always beats CSS
  // classes (even with !important on non-!important inline declarations it's
  // the reverse, but mixing both was fragile), so we compute the correct
  // values here based on tracked breakpoints instead of relying on CSS alone.
  const gridStyle: React.CSSProperties = {
    ...styles.grid,
    gridTemplateColumns: isTablet ? "1fr" : styles.grid.gridTemplateColumns,
    gap: isMobile ? 14 : styles.grid.gap,
  };
  const rightColStyle: React.CSSProperties = {
    ...styles.rightCol,
    position: isTablet ? "static" : styles.rightCol.position,
    top: isTablet ? "auto" : styles.rightCol.top,
  };
  const tileGridStyle: React.CSSProperties = {
    ...styles.tileGrid,
    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : styles.tileGrid.gridTemplateColumns,
  };
  const recommendedBrandRowStyle: React.CSSProperties = {
    ...styles.recommendedBrandRow,
    gridTemplateColumns: isTablet ? "1fr" : styles.recommendedBrandRow.gridTemplateColumns,
  };

  return (
    <div className="dtc-page" style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        .dtc-root, .dtc-root * {
          box-sizing: border-box;
          font-family: 'Sarabun', sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .dtc-heading { font-family: 'Kanit', sans-serif; }
        .dtc-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .dtc-page {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          padding: 40px 20px;
          overflow-x: hidden;
          isolation: isolate;
        }
        .dtc-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 56px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 56px);
          mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 85%);
          pointer-events: none;
          z-index: 0;
        }
        .dtc-root { position: relative; z-index: 1; }

        .dtc-glass {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
        }
        .dtc-input:focus { outline: none; border-color: ${RED}; box-shadow: 0 0 0 3px rgba(237,27,46,0.25); }
        .dtc-tile-card, .dtc-brand-card, .dtc-toggle-btn, .dtc-waste-btn, .dtc-step-btn, .dtc-copy-btn, .dtc-mobile-bar {
          transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-user-select: none;
          user-select: none;
        }
        .dtc-tile-card:hover, .dtc-brand-card:hover { border-color: rgba(237,27,46,0.5) !important; }
        button:focus-visible, .dtc-tile-card:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(237,27,46,0.4); }
        .dtc-toggle-btn:active, .dtc-waste-btn:active, .dtc-tile-card:active, .dtc-step-btn:active, .dtc-copy-btn:active {
          transform: scale(0.96);
        }
        .dtc-card-enter { animation: dtcFadeUp 0.4s ease both; }
        @keyframes dtcFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dtc-fill-tile { animation: dtcPop 0.3s ease both; }
        @keyframes dtcPop {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dtc-card-enter, .dtc-fill-tile { animation: none; }
          .dtc-tile-card, .dtc-brand-card, .dtc-toggle-btn, .dtc-waste-btn, .dtc-step-btn, .dtc-copy-btn { transition: none; }
        }
        .dtc-grid { display: grid; gap: 20px; align-items: start; }
        .dtc-tile-grid { display: grid; gap: 10px; }
        .dtc-brand-grid { display: grid; gap: 10px; }
        .dtc-mobile-bar { display: none; }
        @media (max-width: 980px) {
          .dtc-mobile-bar { display: none; }
        }
        @media (max-width: 650px) {
          .dtc-page { padding: 24px 14px 8px; }
          .dtc-root {
            padding: 0 2px calc(84px + env(safe-area-inset-bottom));
          }
          .dtc-mobile-bar {
            display: flex;
            position: fixed;
            left: calc(12px + env(safe-area-inset-left));
            right: calc(12px + env(safe-area-inset-right));
            bottom: calc(14px + env(safe-area-inset-bottom));
            z-index: 30;
          }
        }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="dtc-root" style={styles.container}>
        {/* Step indicator */}
        <div style={styles.stepsRow}>
          {[
            { n: 1, label: "พื้นผิว" },
            { n: 2, label: "พื้นที่" },
            { n: 3, label: "ขนาด" },
            { n: 4, label: "ปูนกาว" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={styles.stepItem}>
                <div className="dtc-mono" style={styles.stepCircle}>{s.n}</div>
                <span style={styles.stepLabel}>{s.label}</span>
              </div>
              {i < 3 && <div style={styles.stepLine} />}
            </React.Fragment>
          ))}
        </div>

        <div className="dtc-grid" style={gridStyle}>
          {/* Left column: inputs */}
          <div style={styles.leftCol}>
            {/* Surface type */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<Layers size={16} />} text="1. ประเภทพื้นผิว" />
              <div style={styles.toggleRow}>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => handleSurfaceChange("floor")}
                  style={{ ...styles.toggleBtn, ...(surfaceType === "floor" ? styles.toggleBtnActive : {}) }}
                >
                  <LayoutGrid size={18} />
                  พื้น
                </button>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => handleSurfaceChange("wall")}
                  style={{ ...styles.toggleBtn, ...(surfaceType === "wall" ? styles.toggleBtnActive : {}) }}
                >
                  <PanelTop size={18} />
                  ผนัง
                </button>
              </div>
            </div>

            {/* Area input */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<Calculator size={16} />} text="2. พื้นที่ที่ต้องการปู" />
              <div style={styles.areaInputRow}>
                <button
                  type="button"
                  className="dtc-step-btn"
                  aria-label="ลดพื้นที่ 1 ตารางเมตร"
                  onClick={() => adjustArea(-1)}
                  style={styles.stepBtn}
                >
                  −
                </button>
                <input
                  className="dtc-input dtc-mono"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  style={styles.areaInput}
                />
                <button
                  type="button"
                  className="dtc-step-btn"
                  aria-label="เพิ่มพื้นที่ 1 ตารางเมตร"
                  onClick={() => adjustArea(1)}
                  style={styles.stepBtn}
                >
                  +
                </button>
                <span style={styles.areaUnit}>ตร.ม.</span>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={styles.wasteLabel}>เผื่อเสีย (ตัด/แตกหัก)</div>
                <div style={styles.toggleRow}>
                  {WASTE_OPTIONS.map((w) => (
                    <button
                      key={w}
                      className="dtc-waste-btn"
                      onClick={() => setWaste(w)}
                      style={{ ...styles.wasteBtn, ...(waste === w ? styles.wasteBtnActive : {}) }}
                    >
                      {w === 0 ? "ไม่เผื่อ" : `+${w}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay option */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<Package size={16} />} text="ปูทับกระเบื้องเดิมหรือไม่" />
              <div style={styles.toggleRow}>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => setOverlay(false)}
                  style={{ ...styles.toggleBtn, ...(!overlay ? styles.toggleBtnActive : {}) }}
                >
                  ปูใหม่
                </button>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => setOverlay(true)}
                  style={{ ...styles.toggleBtn, ...(overlay ? styles.toggleBtnActive : {}) }}
                >
                  ปูทับของเดิม
                </button>
              </div>
            </div>

            {/* Tile size selection */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<LayoutGrid size={16} />} text={`3. ขนาดกระเบื้อง${surfaceType === "floor" ? "พื้น" : "ผนัง"}`} />
              <div className="dtc-tile-grid" style={tileGridStyle}>
                {tiles.map((t) => (
                  <div
                    key={t.id}
                    className="dtc-tile-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setTileId(t.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setTileId(t.id)}
                    style={{ ...styles.tileCard, ...(tileId === t.id ? styles.tileCardActive : {}) }}
                  >
                    <div style={styles.tileSize}>{t.label}</div>
                    {t.sub && <div style={styles.tileSub}>{t.sub}</div>}
                    <div className="dtc-mono" style={styles.tileCoverage}>{t.coverage} ตร.ม./กล่อง</div>
                  </div>
                ))}
              </div>
              <div style={styles.notchHint}>
                <Ruler size={13} style={{ opacity: 0.85, flexShrink: 0, color: BLUE }} />
                <span>
                  เกรียงหวีแนะนำสำหรับขนาดนี้: <b className="dtc-mono" style={{ color: "#fff", fontWeight: 700 }}>{activeTile.notch}</b>
                </span>
              </div>
            </div>

            {/* Adhesive brand */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<Package size={16} />} text="4. ยี่ห้อปูนกาวที่แนะนำ" />
              <div style={styles.notePill}>ระบบเลือกให้อัตโนมัติตามหน้างาน</div>
              <div className="dtc-brand-grid" style={recommendedBrandRowStyle}>
                {recommendedAdhesive.brands.map((brand) => (
                  <div key={brand.id} className="dtc-brand-card" style={styles.recommendedBrandCard}>
                    <div style={{ ...styles.brandDot, background: brand.color }} />
                    <div>
                      <div style={styles.brandName}>{brand.name}</div>
                      <div style={styles.brandTag}>{brand.tag}</div>
                      <div style={styles.brandDescription}>{brand.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.hintRow}>
                <Info size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
                <div>
                  <div style={styles.hintText}>
                    ปูนกาว 1 กระสอบ ปูได้ {activeTile.adhesiveCoverage} ตร.ม. ด้วยเกรียงหวี {activeTile.notch} · ยาแนว 1 ถุง ปูได้ {GROUT_COVERAGE} ตร.ม.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: results */}
          <div className="dtc-right-col" style={rightColStyle} ref={resultRef}>
            <div className="dtc-glass dtc-card-enter" style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div className="dtc-heading" style={styles.resultTitle}>สรุปวัสดุที่ต้องใช้</div>
                <div style={styles.resultArea}>
                  <span className="dtc-mono">{round2(effectiveArea)}</span> ตร.ม.{" "}
                  {waste > 0 && (
                    <span style={styles.resultAreaBase}>
                      (รวมเผื่อเสีย จาก <span className="dtc-mono">{round2(Number(area) || 0)}</span>)
                    </span>
                  )}
                </div>
              </div>

              <ResultRow label={`กระเบื้อง ${activeTile.label}`} value={animatedBoxes} unit="กล่อง" dotColor={RED} />
              <TileFillPreview count={results.boxes} />

              <ResultRow
                label="ปูนกาว"
                value={animatedAdhesive}
                unit="กระสอบ"
                dotColor={recommendedAdhesive.brands[0].color}
                accent={recommendedAdhesive.brands[0].color}
              />
              <ResultRow label="ยาแนว" value={animatedGrout} unit="ถุง" dotColor={BLUE} />

              <div style={styles.recommendationBox}>
                <div style={styles.recommendationTitle}>{recommendedAdhesive.title}</div>
                <div style={styles.recommendationText}>{recommendedAdhesive.detail}</div>
                <div style={styles.recommendationList}>
                  {recommendedAdhesive.brands.map((b) => (
                    <a key={b.id} href={b.link} style={{ ...styles.recommendationBadge, background: b.color }} target="_blank" rel="noreferrer">
                      {b.name}
                    </a>
                  ))}
                </div>
              </div>

              <button className="dtc-copy-btn" onClick={copySummary} style={styles.copyBtn}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "คัดลอกแล้ว" : "คัดลอกสรุปเพื่อส่งให้ลูกค้า"}
              </button>

              <div style={styles.disclaimer}>
                ตัวเลขเป็นการประมาณการเบื้องต้น ปริมาณจริงอาจแตกต่างกันตามลวดลาย รอยต่อ และหน้างานจริง
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky summary bar */}
      <div className="dtc-mobile-bar" style={styles.mobileBar} onClick={scrollToResult} role="button" tabIndex={0}>
        <div style={styles.mobileBarStats}>
          <div style={styles.mobileBarStat}>
            <span className="dtc-mono" style={styles.mobileBarNum}>{animatedBoxes}</span>
            <span style={styles.mobileBarUnit}>กล่อง</span>
          </div>
          <div style={styles.mobileBarDivider} />
          <div style={styles.mobileBarStat}>
            <span className="dtc-mono" style={styles.mobileBarNum}>{animatedAdhesive}</span>
            <span style={styles.mobileBarUnit}>ปูนกาว</span>
          </div>
          <div style={styles.mobileBarDivider} />
          <div style={styles.mobileBarStat}>
            <span className="dtc-mono" style={styles.mobileBarNum}>{animatedGrout}</span>
            <span style={styles.mobileBarUnit}>ยาแนว</span>
          </div>
        </div>
        <div style={styles.mobileBarAction}>
          ดูรายละเอียด
          <ChevronUp size={16} />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={styles.sectionLabel}>
      <span style={styles.sectionLabelIcon}>{icon}</span>
      {text}
    </div>
  );
}

function ResultRow({
  label,
  value,
  unit,
  accent,
  dotColor,
}: {
  label: string;
  value: number;
  unit: string;
  accent?: string;
  dotColor?: string;
}) {
  return (
    <div style={styles.resultRow}>
      <span style={styles.resultRowLabel}>
        {dotColor && <span style={{ ...styles.resultDot, background: dotColor }} />}
        {label}
      </span>
      <span className="dtc-mono" style={{ ...styles.resultRowValue, color: accent || "#fff" }}>
        {value} <span style={styles.resultRowUnit}>{unit}</span>
      </span>
    </div>
  );
}

/** Literal visual read: each square is one box of tile, so the quantity is felt, not just read. */
function TileFillPreview({ count, max = 30 }: { count: number; max?: number }) {
  const shown = Math.min(count, max);
  const overflow = count - shown;
  return (
    <div style={styles.tileFillWrap}>
      <div style={styles.tileFillGrid}>
        {Array.from({ length: shown }).map((_, i) => (
          <div
            key={i}
            className="dtc-fill-tile"
            style={{ ...styles.fillTile, animationDelay: `${Math.min(i * 14, 300)}ms` }}
          />
        ))}
        {overflow > 0 && (
          <div className="dtc-mono" style={styles.fillTileMore}>+{overflow}</div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "radial-gradient(circle at 15% 0%, #221f1a 0%, #171512 45%, #0d0c0a 100%)",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  stepsRow: { display: "flex", alignItems: "center", marginBottom: 22, padding: "0 4px" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 44 },
  stepCircle: {
    width: 27,
    height: 27,
    borderRadius: "50%",
    background: "rgba(91,155,213,0.14)",
    border: `1px solid ${BLUE}66`,
    color: BLUE,
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: { color: "#8a857c", fontSize: 10.5 },
  stepLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.1)", margin: "0 4px 18px" },
  grid: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20, alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { position: "sticky", top: 20 },
  card: { padding: "18px 20px" },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#cac6be",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  sectionLabelIcon: { color: RED, display: "flex" },
  toggleRow: { display: "flex", gap: 10 },
  toggleBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "13px 0",
    minHeight: 48,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#cac6be",
    fontSize: 15,
    fontWeight: 500,
    borderRadius: 12,
  },
  toggleBtnActive: {
    background: `linear-gradient(135deg, ${RED}, #a80f1d)`,
    borderColor: RED,
    color: "#fff",
  },
  areaInputRow: { display: "flex", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: 20,
    lineHeight: 1,
    fontWeight: 500,
  },
  areaInput: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 22,
    fontWeight: 600,
    padding: "10px 14px",
    width: "100%",
    textAlign: "center",
  },
  areaUnit: { color: "#9a958b", fontSize: 14, minWidth: 40 },
  wasteLabel: { color: "#9a958b", fontSize: 12.5, marginBottom: 8 },
  wasteBtn: {
    flex: 1,
    padding: "10px 0",
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#cac6be",
    fontSize: 13,
  },
  wasteBtnActive: { background: "rgba(237,27,46,0.18)", borderColor: RED, color: "#ff8891" },
  tileGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  tileCard: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: "14px 10px",
    textAlign: "center",
    minHeight: 76,
  },
  tileCardActive: { borderColor: RED, background: "rgba(237,27,46,0.14)" },
  tileSize: { color: "#fff", fontSize: 14, fontWeight: 600 },
  tileSub: { color: "#9a958b", fontSize: 10.5, marginTop: 2 },
  tileCoverage: { color: "#9a958b", fontSize: 11, marginTop: 6 },
  notchHint: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 10,
    background: "rgba(91,155,213,0.08)",
    border: `1px solid ${BLUE}33`,
    color: "#b7c9db",
    fontSize: 12,
  },
  notePill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(237,27,46,0.14)",
    color: "#ffd1d6",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 14,
  },
  recommendedBrandRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  recommendedBrandCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  brandDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 3 },
  brandName: { color: "#fff", fontSize: 14, fontWeight: 600 },
  brandTag: { color: "#9a958b", fontSize: 10.5, letterSpacing: 0.5 },
  hintRow: { display: "flex", gap: 6, marginTop: 12, alignItems: "flex-start" },
  hintText: { color: "#847f76", fontSize: 11.5, lineHeight: 1.5 },
  resultCard: { padding: "22px 24px" },
  resultHeader: { marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  resultTitle: { color: "#fff", fontSize: 18, fontWeight: 600 },
  resultArea: { color: "#9a958b", fontSize: 12.5, marginTop: 6 },
  resultAreaBase: { color: "#635e56" },
  brandDescription: { color: "#a7a29a", fontSize: 12.5, marginTop: 4, maxWidth: 320 },
  recommendationBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.08)",
  },
  recommendationTitle: { color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 6 },
  recommendationText: { color: "#cac6be", fontSize: 13, lineHeight: 1.6, marginBottom: 10 },
  recommendationList: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 },
  recommendationBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    textDecoration: "none",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  resultRowLabel: { color: "#cac6be", fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 },
  resultDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  resultRowValue: { fontSize: 20, fontWeight: 700 },
  resultRowUnit: { fontSize: 11, fontWeight: 500, color: "#9a958b", fontFamily: "'Sarabun', sans-serif" },
  tileFillWrap: { padding: "2px 0 14px 15px" },
  tileFillGrid: { display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 280 },
  fillTile: {
    width: 12,
    height: 12,
    borderRadius: 3,
    background: `linear-gradient(135deg, ${RED}, #a80f1d)`,
    boxShadow: `0 0 0 1px rgba(255,255,255,0.08)`,
  },
  fillTileMore: {
    color: "#9a958b",
    fontSize: 10.5,
    display: "flex",
    alignItems: "center",
    paddingLeft: 4,
  },
  copyBtn: {
    width: "100%",
    marginTop: 16,
    padding: "13px 0",
    minHeight: 46,
    borderRadius: 12,
    border: `1px solid ${RED}66`,
    background: "rgba(237,27,46,0.12)",
    color: "#ff8891",
    fontSize: 13.5,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disclaimer: { color: "#635e56", fontSize: 11, lineHeight: 1.6, marginTop: 16 },
  mobileBar: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 18,
    background: "rgba(23,21,18,0.92)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  mobileBarStats: { display: "flex", alignItems: "center", gap: 10 },
  mobileBarStat: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 },
  mobileBarNum: { color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: 1.1 },
  mobileBarUnit: { color: "#9a958b", fontSize: 10 },
  mobileBarDivider: { width: 1, height: 24, background: "rgba(255,255,255,0.12)" },
  mobileBarAction: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    color: RED,
    fontSize: 12.5,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
};