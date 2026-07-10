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

const ShieldCheck = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon {...props}>
    <path d="M12 3 4 6v6c0 4.5 3.4 7.7 8 9 4.6-1.3 8-4.5 8-9V6l-8-3z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

type SurfaceType = "floor" | "wall";

type TileOption = {
  id: string;
  label: string;
  sub: string;
  coverage: number; // ตร.ม. ต่อกล่องกระเบื้อง
  notch: string; // ขนาดเกรียงหวีแนะนำ
  trim: string; // ขนาดคิ้วแนะนำ
  adhesiveCoverage: number; // ตร.ม. ต่อกระสอบปูนกาว (ตามขนาดเกรียงหวี)
};

type AdhesiveGrade = {
  id: string;
  name: string;
  nameEn: string;
  ansi: string;
  color: string;
  colorSoft: string;
  tagline: string;
  description: string;
  sizes: string;
  link: string;
};

const FLOOR_TILES: TileOption[] = [
  { id: "f30", label: "30 x 30 ซม.", sub: "(12 x 12 นิ้ว)", coverage: 1, notch: "6 มม.", trim: "8–9 มม.", adhesiveCoverage: 6 },
  { id: "f40", label: "40 x 40 ซม.", sub: "(16 x 16 นิ้ว)", coverage: 1, notch: "6–8 มม.", trim: "9–10 มม.", adhesiveCoverage: 5 },
  { id: "f60", label: "60 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44, notch: "8–10 มม.", trim: "11–12 มม.", adhesiveCoverage: 4 },
];

const WALL_TILES: TileOption[] = [
  { id: "w1016", label: "10 x 16 ซม.", sub: "", coverage: 1, notch: "6 มม.", trim: "8–9 มม.", adhesiveCoverage: 6 },
  { id: "w3045", label: "30 x 45 ซม.", sub: "", coverage: 1, notch: "6–8 มม.", trim: "9–10 มม.", adhesiveCoverage: 5 },
  { id: "w3060", label: "30 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44, notch: "8–10 มม.", trim: "11–12 มม.", adhesiveCoverage: 4 },
];

// ข้อมูลกาวซีเมนต์จระเข้ทั้ง 6 รุ่น อ้างอิงจากป้ายไลน์อัพหน้าร้าน
const JORAKAY_GRADES: Record<string, AdhesiveGrade> = {
  yellow: {
    id: "jorakay-yellow",
    name: "จระเข้เหลือง",
    nameEn: "Yellow Crocodile",
    ansi: "รุ่นประหยัด",
    color: "#D9A62E",
    colorSoft: "#FBF1DA",
    tagline: "สำหรับงานทั่วไป",
    description: "รุ่นประหยัด คุ้มค่า เหมาะกับกระเบื้องขนาดเล็ก-กลางสำหรับงานทั่วไป",
    sizes: "25×30, 30×30, 40×40, 30×45, 60×60 (พื้น) ซม.",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive",
  },
  blue: {
    id: "jorakay-blue",
    name: "จระเข้ฟ้า",
    nameEn: "Blue Crocodile",
    ansi: "ANSI A118.1",
    color: "#2F80C4",
    colorSoft: "#E1EEFA",
    tagline: "รุ่นมาตรฐาน ราคาประหยัด",
    description: "มาตรฐาน ANSI A118.1 ราคาประหยัด เหมาะกับงานทั่วไปที่ต้องการมาตรฐานสากล",
    sizes: "25×30, 30×30, 40×40, 30×45, 60×60 (พื้น) ซม.",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive",
  },
  green: {
    id: "jorakay-green",
    name: "จระเข้เขียว",
    nameEn: "Green Crocodile",
    ansi: "ANSI A118.1",
    color: "#2FA35B",
    colorSoft: "#E2F3E8",
    tagline: "รุ่นขายดีอันดับ 1",
    description: "คุณภาพมาตรฐานทั้งไทย (มอก.) และสากล ขายดีที่สุด ใช้ได้ทั้งพื้นและผนัง",
    sizes: "25×40, 30×30, 40×40, 30×45, 60×60 ซม.",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive/green-crocodile-tile-adhesive",
  },
  red: {
    id: "jorakay-red",
    name: "จระเข้แดง",
    nameEn: "Red Crocodile",
    ansi: "ANSI A118.4",
    color: "#E14B4B",
    colorSoft: "#FCE4E4",
    tagline: "คุณภาพสูง กระเบื้องแผ่นใหญ่",
    description: "แรงยึดเกาะสูงพิเศษ เหมาะกับกระเบื้องขนาดใหญ่และกระเบื้องสระว่ายน้ำ",
    sizes: "10×10, 30×60, 60×60, 60×120, 100×100 ซม.",
    link: "https://www.dcctoyou.com/jorakay",
  },
  silver: {
    id: "jorakay-silver",
    name: "จระเข้เงิน",
    nameEn: "Silver Crocodile",
    ansi: "ANSI A118.15",
    color: "#8B909C",
    colorSoft: "#EAEBEE",
    tagline: "มาตรฐานสูง Big size / ปูทับ",
    description: "มาตรฐานสูง สำหรับกระเบื้องขนาดใหญ่พิเศษและงานปูทับกระเบื้องเดิมโดยเฉพาะ",
    sizes: "60×120, 80×80, 100×100 ซม.",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive",
  },
  gold: {
    id: "jorakay-gold",
    name: "จระเข้ทอง",
    nameEn: "Gold Crocodile",
    ansi: "ANSI A118.15 / A118.11",
    color: "#B4914A",
    colorSoft: "#F3ECDB",
    tagline: "มาตรฐานสูงสุด ทุกพื้นผิว",
    description: "รุ่นมาตรฐานสูงสุด ปูกระเบื้องได้ทุกประเภทและหลากหลายพื้นผิว Big size",
    sizes: "60×60, 60×120, 80×80, 100×100 ซม.",
    link: "https://xn--12cfjb8g6bl2ezag5e8e9e.com/articles/crocodile-gold-cement-glue/",
  },
};

const GROUT_COVERAGE = 5; // ตร.ม. ต่อถุงยาแนว
const WASTE_OPTIONS = [0, 5, 10];
const RED = "#C81E2C";
const INK = "#2B2822";

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
    // ปูทับกระเบื้องเดิม -> เงิน (ออกแบบมาสำหรับงานนี้โดยเฉพาะ) + ทอง เป็นตัวเลือกพรีเมียม
    if (overlay) {
      return {
        grades: [JORAKAY_GRADES.silver, JORAKAY_GRADES.gold],
        title: "งานปูทับกระเบื้องเดิม",
        detail: "แนะนำจระเข้เงิน ซึ่งออกแบบมาสำหรับปูทับพื้นผิวเดิมโดยเฉพาะ หรือจระเข้ทองสำหรับมาตรฐานสูงสุดและพื้นผิวหลากหลายชนิด",
      };
    }

    // กระเบื้องแผ่นใหญ่ 60x60 ขึ้นไป -> แดง เป็นหลัก, ทองเป็นพรีเมียม
    if (activeTile.id === "f60" || activeTile.id === "w3060") {
      return {
        grades: [JORAKAY_GRADES.red, JORAKAY_GRADES.gold],
        title: "กระเบื้องแผ่นใหญ่",
        detail: "แนะนำจระเข้แดง มาตรฐาน ANSI A118.4 แรงยึดเกาะสูงพิเศษสำหรับกระเบื้องแผ่นใหญ่ หรือจระเข้ทองสำหรับมาตรฐานสูงสุด",
      };
    }

    // ผนัง ขนาดกลาง 30x45 -> เขียว เป็นหลัก
    if (surfaceType === "wall" && activeTile.id === "w3045") {
      return {
        grades: [JORAKAY_GRADES.green, JORAKAY_GRADES.blue],
        title: "ผนังขนาดมาตรฐาน",
        detail: "แนะนำจระเข้เขียว รุ่นขายดีอันดับ 1 คุณภาพมาตรฐานทั้งไทยและสากล เหมาะกับงานผนังทั่วไป",
      };
    }

    // ผนังขนาดเล็ก 10x16 หรือพื้นทั่วไป 30x30 / 40x40 -> เขียว/เหลือง
    return {
      grades: [JORAKAY_GRADES.green, JORAKAY_GRADES.yellow],
      title: surfaceType === "floor" ? "งานพื้นทั่วไป" : "ผนังขนาดเล็ก",
      detail: "แนะนำจระเข้เขียว คุ้มค่าและได้มาตรฐาน หรือจระเข้เหลือง รุ่นประหยัดสำหรับงานทั่วไป",
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
      `ปูนกาว: ${results.adhesiveBags} กระสอบ (${recommendedAdhesive.grades.map((g) => g.name).join(" / ")})`,
      `ยาแนว: ${results.groutBags} ถุง`,
      `เกรียงหวีแนะนำ: ${activeTile.notch}`,
      `คิ้วแนะนำ: ${activeTile.trim}`,
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

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
  const recommendedGradeRowStyle: React.CSSProperties = {
    ...styles.recommendedGradeRow,
    gridTemplateColumns: isTablet ? "1fr" : styles.recommendedGradeRow.gridTemplateColumns,
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
            repeating-linear-gradient(0deg, rgba(43,40,34,0.045) 0 1px, transparent 1px 56px),
            repeating-linear-gradient(90deg, rgba(43,40,34,0.045) 0 1px, transparent 1px 56px);
          mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 85%);
          pointer-events: none;
          z-index: 0;
        }
        .dtc-root { position: relative; z-index: 1; }

        .dtc-glass {
          background: #FFFFFF;
          border: 1px solid #E7E2D8;
          box-shadow: 0 1px 2px rgba(43,40,34,0.04), 0 8px 24px -12px rgba(43,40,34,0.08);
          border-radius: 20px;
        }
        .dtc-input:focus { outline: none; border-color: ${RED}; box-shadow: 0 0 0 3px rgba(200,30,44,0.14); }
        .dtc-tile-card, .dtc-brand-card, .dtc-toggle-btn, .dtc-waste-btn, .dtc-step-btn, .dtc-copy-btn, .dtc-mobile-bar {
          transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-user-select: none;
          user-select: none;
        }
        .dtc-tile-card:hover, .dtc-brand-card:hover { border-color: rgba(200,30,44,0.45) !important; }
        button:focus-visible, .dtc-tile-card:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(200,30,44,0.28); }
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
        <div className="dtc-glass dtc-card-enter" style={styles.heroCard}>
          <div style={styles.heroIntro}>
            <div className="dtc-heading" style={styles.heroTitle}>เครื่องคำนวณวัสดุกระเบื้อง</div>
            <div style={styles.heroSubtitle}>
              ป้อนพื้นที่และเลือกขนาดกระเบื้องที่ใช้งานได้ทันที พร้อมแนะนำปูนกาวและยาแนวที่เหมาะสมสำหรับงานพื้นหรือผนัง
            </div>
          </div>
          <div style={styles.heroFeatures}>
            {[
              { icon: <Calculator size={16} />, text: "ป้อนค่าได้ง่าย" },
              { icon: <Ruler size={16} />, text: "แนะนำขนาดเกรียงหวี" },
              { icon: <ShieldCheck size={16} />, text: "แนะนำปูนกาวอัตโนมัติ" },
            ].map((item) => (
              <div key={item.text} style={styles.featureChip}>
                <span style={styles.featureIcon}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

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
                <Ruler size={13} style={{ opacity: 0.85, flexShrink: 0, color: "#2F80C4" }} />
                <span>
                  เกรียงหวีแนะนำสำหรับขนาดนี้: <b className="dtc-mono" style={{ color: INK, fontWeight: 700 }}>{activeTile.notch}</b>
                </span>
              </div>
            </div>

            {/* Adhesive grade */}
            <div className="dtc-glass dtc-card-enter" style={styles.card}>
              <SectionLabel icon={<ShieldCheck size={16} />} text="4. รุ่นปูนกาวจระเข้ที่แนะนำ" />
              <div style={styles.notePill}>ระบบเลือกให้อัตโนมัติตามหน้างาน</div>
              <div className="dtc-brand-grid" style={recommendedGradeRowStyle}>
                {recommendedAdhesive.grades.map((grade) => (
                  <div key={grade.id} className="dtc-brand-card" style={{ ...styles.recommendedGradeCard, background: grade.colorSoft }}>
                    <div style={{ ...styles.brandDot, background: grade.color }} />
                    <div>
                      <div style={styles.brandName}>{grade.name}</div>
                      <div style={{ ...styles.brandTag, color: grade.color }}>{grade.ansi} · {grade.tagline}</div>
                      <div style={styles.brandDescription}>{grade.description}</div>
                      <div style={styles.brandSizes}>เหมาะกับขนาด: {grade.sizes}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.hintRow}>
                <Info size={13} style={{ opacity: 0.55, flexShrink: 0 }} />
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
                dotColor={recommendedAdhesive.grades[0].color}
                accent={recommendedAdhesive.grades[0].color}
              />
              <ResultRow label="ยาแนว" value={animatedGrout} unit="ถุง" dotColor="#2F80C4" />

              <div style={styles.recommendationBox}>
                <div style={styles.recommendationTitle}>{recommendedAdhesive.title}</div>
                <div style={styles.recommendationText}>{recommendedAdhesive.detail}</div>
                <div style={styles.recommendationList}>
                  {recommendedAdhesive.grades.map((g) => (
                    <a key={g.id} href={g.link} style={{ ...styles.recommendationBadge, background: g.color }} target="_blank" rel="noreferrer">
                      {g.name}
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
      <div
        className="dtc-mobile-bar"
        style={styles.mobileBar}
        onClick={scrollToResult}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") scrollToResult();
        }}
        role="button"
        tabIndex={0}
        aria-label="ดูสรุปวัสดุ"
      >
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
      <span className="dtc-mono" style={{ ...styles.resultRowValue, color: accent || INK }}>
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
    background: "radial-gradient(circle at 15% 0%, #FBFAF6 0%, #F6F3EC 45%, #F0EBE0 100%)",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  stepsRow: { display: "flex", alignItems: "center", marginBottom: 22, padding: "0 4px" },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 44 },
  stepCircle: {
    width: 27,
    height: 27,
    borderRadius: "50%",
    background: "rgba(47,128,196,0.1)",
    border: "1px solid rgba(47,128,196,0.35)",
    color: "#2F80C4",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: { color: "#8A8474", fontSize: 10.5 },
  stepLine: { flex: 1, height: 1, background: "#E7E2D8", margin: "0 4px 18px" },
  grid: { display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20, alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { position: "sticky", top: 20 },
  card: { padding: "18px 20px" },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#5C5748",
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
    borderColor: "#E7E2D8",
    background: "#FAF8F4",
    color: "#5C5748",
    fontSize: 15,
    fontWeight: 500,
    borderRadius: 12,
  },
  toggleBtnActive: {
    background: `linear-gradient(135deg, ${RED}, #96121D)`,
    borderColor: RED,
    color: "#fff",
    boxShadow: "0 6px 16px -6px rgba(200,30,44,0.45)",
  },
  areaInputRow: { display: "flex", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 12,
    border: "1px solid #E7E2D8",
    background: "#FAF8F4",
    color: INK,
    fontSize: 20,
    lineHeight: 1,
    fontWeight: 500,
  },
  areaInput: {
    flex: 1,
    background: "#FAF8F4",
    border: "1px solid #E7E2D8",
    borderRadius: 12,
    color: INK,
    fontSize: 22,
    fontWeight: 600,
    padding: "10px 14px",
    width: "100%",
    textAlign: "center",
  },
  areaUnit: { color: "#8A8474", fontSize: 14, minWidth: 40 },
  wasteLabel: { color: "#8A8474", fontSize: 12.5, marginBottom: 8 },
  wasteBtn: {
    flex: 1,
    padding: "10px 0",
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E7E2D8",
    background: "#FAF8F4",
    color: "#5C5748",
    fontSize: 13,
  },
  wasteBtnActive: { background: "rgba(200,30,44,0.09)", borderColor: RED, color: RED },
  tileGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  tileCard: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E7E2D8",
    background: "#FAF8F4",
    borderRadius: 12,
    padding: "14px 10px",
    textAlign: "center",
    minHeight: 76,
  },
  tileCardActive: { borderColor: RED, background: "rgba(200,30,44,0.07)" },
  tileSize: { color: INK, fontSize: 14, fontWeight: 600 },
  tileSub: { color: "#8A8474", fontSize: 10.5, marginTop: 2 },
  tileCoverage: { color: "#8A8474", fontSize: 11, marginTop: 6 },
  notchHint: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 10,
    background: "rgba(47,128,196,0.07)",
    border: "1px solid rgba(47,128,196,0.2)",
    color: "#2A5F86",
    fontSize: 12,
  },
  notePill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(200,30,44,0.08)",
    color: "#96121D",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 14,
  },
  recommendedGradeRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  recommendedGradeCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(43,40,34,0.06)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  brandDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0, marginTop: 3, boxShadow: "0 0 0 3px rgba(255,255,255,0.6)" },
  brandName: { color: INK, fontSize: 14, fontWeight: 600 },
  brandTag: { fontSize: 10.5, letterSpacing: 0.3, fontWeight: 600, marginTop: 1 },
  hintRow: { display: "flex", gap: 6, marginTop: 12, alignItems: "flex-start" },
  hintText: { color: "#9C9686", fontSize: 11.5, lineHeight: 1.5 },
  resultCard: { padding: "22px 24px" },
  resultHeader: { marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EEEAE1" },
  resultTitle: { color: INK, fontSize: 18, fontWeight: 700 },
  resultSubtitle: { color: "#5C5748", fontSize: 13, marginTop: 4, lineHeight: 1.6 },
  resultArea: { color: "#8A8474", fontSize: 12.5, marginTop: 10 },
  resultAreaBase: { color: "#B4AD9C" },
  brandDescription: { color: "#5C5748", fontSize: 12.5, marginTop: 4, maxWidth: 320, lineHeight: 1.5 },
  brandSizes: { color: "#8A8474", fontSize: 11, marginTop: 6, lineHeight: 1.5 },
  recommendationBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 14,
    background: "#FAF8F4",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#EEEAE1",
  },
  recommendationTitle: { color: INK, fontSize: 14, fontWeight: 600, marginBottom: 6 },
  recommendationText: { color: "#5C5748", fontSize: 13, lineHeight: 1.6, marginBottom: 10 },
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
    borderBottom: "1px solid #EEEAE1",
  },
  resultRowLabel: { color: "#5C5748", fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 },
  resultDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  resultRowValue: { fontSize: 20, fontWeight: 700 },
  resultRowUnit: { fontSize: 11, fontWeight: 500, color: "#8A8474", fontFamily: "'Sarabun', sans-serif" },
  heroCard: { padding: "24px 26px", marginBottom: 20, background: "rgba(255,255,255,0.96)", border: "1px solid rgba(231,226,216,0.9)", boxShadow: "0 18px 40px rgba(43,40,34,0.08)" },
  heroIntro: { maxWidth: 820 },
  heroTitle: { color: INK, fontSize: 24, fontWeight: 700, marginBottom: 8 },
  heroSubtitle: { color: "#5C5748", fontSize: 13.5, lineHeight: 1.8, maxWidth: 650 },
  heroFeatures: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 },
  featureChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    background: "#F8F6F0",
    color: "#4A473B",
    fontSize: 13,
    border: "1px solid #E7E2D8",
  },
  featureIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", color: RED },
  tileFillWrap: { padding: "2px 0 14px 15px" },
  tileFillGrid: { display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 280 },
  fillTile: {
    width: 12,
    height: 12,
    borderRadius: 3,
    background: `linear-gradient(135deg, ${RED}, #96121D)`,
    boxShadow: "0 0 0 1px rgba(43,40,34,0.06)",
  },
  fillTileMore: {
    color: "#8A8474",
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
    border: `1px solid ${RED}`,
    background: "rgba(200,30,44,0.06)",
    color: RED,
    fontSize: 13.5,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  disclaimer: { color: "#B4AD9C", fontSize: 11, lineHeight: 1.6, marginTop: 16 },
  mobileBar: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #E7E2D8",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 10px 30px rgba(43,40,34,0.14)",
  },
  mobileBarStats: { display: "flex", alignItems: "center", gap: 10 },
  mobileBarStat: { display: "flex", flexDirection: "column", alignItems: "center", minWidth: 44 },
  mobileBarNum: { color: INK, fontSize: 16, fontWeight: 700, lineHeight: 1.1 },
  mobileBarUnit: { color: "#8A8474", fontSize: 10 },
  mobileBarDivider: { width: 1, height: 24, background: "#E7E2D8" },
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