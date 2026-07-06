"use client";

import React, { useMemo, useState } from "react";

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
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h8" />
  </Icon>
);

const LayoutGrid = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </Icon>
);

const PanelTop = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <rect x="3" y="3" width="18" height="4" rx="1" />
    <rect x="3" y="9" width="14" height="12" rx="1" />
  </Icon>
);

const Package = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4.03a2 2 0 0 0-2 0l-7 4.03A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4.03a2 2 0 0 0 2 0l7-4.03A2 2 0 0 0 21 16z" />
    <path d="M16 3.13v4.07M8 3.13v4.07" />
  </Icon>
);

const Layers = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <path d="M12 3 4 7.5l8 4.5 8-4.5L12 3z" />
    <path d="m4 12.5 8 4.5 8-4.5" />
    <path d="m4 17 8 4.5 8-4.5" />
  </Icon>
);

const ChevronRight = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
);

const Info = (props: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <Icon size={props.size} strokeWidth={props.strokeWidth} style={props.style}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </Icon>
);

type SurfaceType = "floor" | "wall";

type TileOption = {
  id: string;
  label: string;
  sub: string;
  coverage: number;
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
  { id: "f40", label: "40 x 40 ซม.", sub: "(16 x 16 นิ้ว)", coverage: 1 },
  { id: "f30", label: "30 x 30 ซม.", sub: "(12 x 12 นิ้ว)", coverage: 1 },
  { id: "f60", label: "60 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44 },
];

const WALL_TILES: TileOption[] = [
  { id: "w1016", label: "10 x 16 ซม.", sub: "", coverage: 1 },
  { id: "w3045", label: "30 x 45 ซม.", sub: "", coverage: 1 },
  { id: "w3060", label: "30 x 60 ซม.", sub: "ปูได้ 1.44 ตร.ม./กล่อง", coverage: 1.44 },
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
    id: "cotto-fast",
    name: "COTTO Fast",
    tag: "COTTO",
    color: "#E17055",
    description: "ปูนกาวแห้งตัวเร็ว เดินเหยียบและยาแนวได้เร็ว เหมาะกับงานเร่งด่วน",
    link: "https://www.cotto.com/product/tile-adhesive",
  },
  {
    id: "jorakay-green",
    name: "จระเข้เขียว",
    tag: "Jorakay",
    color: "#1D9E4B",
    description: "ปูนกาวมาตรฐานสำหรับกระเบื้องทั่วไปและกระเบื้องขนาดใหญ่ ใช้ได้ทั้งภายในและภายนอก",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive/green-crocodile-tile-adhesive",
  },
  {
    id: "jorakay-red",
    name: "จระเข้แดง",
    tag: "Jorakay",
    color: "#D63031",
    description: "แรงยึดเกาะสูงพิเศษ เหมาะสำหรับกระเบื้องสระว่ายน้ำ กระเบื้องแผ่นใหญ่ และพื้นที่ที่ต้องแช่น้ำ",
    link: "https://www.dcctoyou.com/jorakay",
  },
  {
    id: "jorakay-silver",
    name: "จระเข้เงิน",
    tag: "Jorakay",
    color: "#8a8f98",
    description: "สำหรับกระเบื้องขนาดใหญ่มาก หินอ่อน หินแกรนิต ช่วยลดปัญหากระเบื้องโก่งตัว",
    link: "https://www.jorakay.co.th/tiling/tile-adhesive",
  },
  {
    id: "jorakay-gold",
    name: "จระเข้ทอง",
    tag: "Jorakay",
    color: "#D4AF37",
    description: "เกรดพรีเมียม ยืดหยุ่นสูง ทนทุกสภาพอากาศ ปูทับกระเบื้องเดิมได้ เหมาะสำหรับสระว่ายน้ำ",
    link: "https://xn--12cfjb8g6bl2ezag5e8e9e.com/articles/crocodile-gold-cement-glue/",
  },
  {
    id: "jorakay-extreme",
    name: "จระเข้เอ็กซ์ตรีม",
    tag: "Jorakay",
    color: "#3B3B98",
    description: "สูตรยืดหยุ่นสูงพิเศษ เหมาะกับงานที่ต้องทนต่ออุณหภูมิและความชื้นสูง",
    link: "https://www.jorakay.co.th/blog/owner/tiling/what-types-of-crocodile-cement-adhesives-are-good-for-types",
  },
];

const GROUT_COVERAGE = 5; // ตร.ม. ต่อถุง
const ADHESIVE_COVERAGE = 5; // ตร.ม. ต่อกระสอบ

const WASTE_OPTIONS = [0, 5, 10];

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function TileMaterialCalculator() {
  const [surfaceType, setSurfaceType] = useState<SurfaceType>("floor");
  const [area, setArea] = useState<number>(20);
  const [tileId, setTileId] = useState<string>(FLOOR_TILES[0].id);
  const [waste, setWaste] = useState<number>(10);
  const [overlay, setOverlay] = useState<boolean>(false);

  const tiles = surfaceType === "floor" ? FLOOR_TILES : WALL_TILES;
  const activeTile = tiles.find((t) => t.id === tileId) ?? tiles[0];

  const effectiveArea = useMemo(() => {
    const a = Number(area) || 0;
    return a * (1 + waste / 100);
  }, [area, waste]);

  const results = useMemo(() => {
    const a = effectiveArea;
    return {
      boxes: Math.ceil(a / activeTile.coverage),
      adhesiveBags: Math.ceil(a / ADHESIVE_COVERAGE),
      groutBags: Math.ceil(a / GROUT_COVERAGE),
    };
  }, [effectiveArea, activeTile]);

  const recommendedAdhesive = useMemo(() => {
    if (overlay) {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-premium") ?? ADHESIVE_BRANDS[1],
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-gold") ?? ADHESIVE_BRANDS[6],
      ];
      return {
        brands,
        title: "งานปูทับกระเบื้องเดิม",
        detail: "แนะนำ COTTO Premium และ จระเข้ทอง สำหรับงานปูทับที่ต้องการแรงยึดเกาะและความยืดหยุ่น",
      };
    }

    if (surfaceType === "wall") {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-standard") ?? ADHESIVE_BRANDS[0],
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-green") ?? ADHESIVE_BRANDS[3],
      ];
      return {
        brands,
        title: "ผนังและงานภายในอาคาร แนะนำ",
        detail: "แนะนำทั้ง COTTO Standard และ จระเข้เขียว ใช้คู่กันได้ดีในงานผนังภายในอาคาร",
      };
    }

    if (activeTile.id === "f60") {
      const brands = [
        ADHESIVE_BRANDS.find((b) => b.id === "cotto-premium") ?? ADHESIVE_BRANDS[1],
        ADHESIVE_BRANDS.find((b) => b.id === "jorakay-red") ?? ADHESIVE_BRANDS[4],
      ];
      return {
        brands,
        title: "กระเบื้องพื้นขนาดใหญ่ แนะนำ",
        detail: "แนะนำทั้ง COTTO Premium และ จระเข้แดง ในงานพื้นกระเบื้องขนาดใหญ่และพื้นที่รับแรงสูง",
      };
    }

    const brands = [
      ADHESIVE_BRANDS.find((b) => b.id === "cotto-standard") ?? ADHESIVE_BRANDS[0],
      ADHESIVE_BRANDS.find((b) => b.id === "jorakay-green") ?? ADHESIVE_BRANDS[3],
    ];
    return {
      brands,
      title: "งานพื้นทั่วไป แนะนำ",
      detail: "แนะนำทั้ง COTTO Standard และ จระเข้เขียว สำหรับงานพื้นทั่วไป ทั้งความคุ้มค่าและความเสถียร",
    };
  }, [overlay, surfaceType, activeTile]);

  function handleSurfaceChange(type: SurfaceType) {
    setSurfaceType(type);
    const list = type === "floor" ? FLOOR_TILES : WALL_TILES;
    setTileId(list[0].id);
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
        .dtc-root, .dtc-root * { box-sizing: border-box; font-family: 'Sarabun', sans-serif; }
        .dtc-heading { font-family: 'Kanit', sans-serif; }
        .dtc-glass {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
        }
        .dtc-input:focus { outline: none; border-color: #ED1B2E; box-shadow: 0 0 0 3px rgba(237,27,46,0.25); }
        .dtc-tile-card, .dtc-brand-card, .dtc-toggle-btn, .dtc-waste-btn { transition: all 0.15s ease; cursor: pointer; }
        .dtc-tile-card:hover, .dtc-brand-card:hover { border-color: rgba(237,27,46,0.5) !important; }
        .dtc-grid { display: grid; gap: 20px; grid-template-columns: minmax(0, 1.75fr) 380px; align-items: start; }
        .dtc-tile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .dtc-brand-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media (max-width: 980px) {
          .dtc-grid { grid-template-columns: 1fr; }
          .dtc-right-col { position: static !important; top: auto !important; }
          .dtc-tile-grid { grid-template-columns: repeat(2, 1fr); }
          .dtc-brand-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 650px) {
          .dtc-grid { gap: 16px; }
          .dtc-tile-grid { grid-template-columns: 1fr; }
          .dtc-brand-grid { grid-template-columns: 1fr; }
          .dtc-toggle-btn, .dtc-waste-btn, .dtc-tile-card, .dtc-brand-card { font-size: 13px; }
          .dtc-brand-card { flex-direction: column; align-items: stretch; }
          .dtc-root { padding: 0 12px; }
        }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
      `}</style>

      <div className="dtc-root" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>DoM</div>
          <div>
            <div className="dtc-heading" style={styles.title}>เครื่องคำนวณวัสดุปูกระเบื้อง</div>
            <div style={styles.subtitle}>Smart Tile Platform · ดิวะ</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Left column: inputs */}
          <div style={styles.leftCol}>

            {/* Surface type */}
            <div className="dtc-glass" style={styles.card}>
              <SectionLabel icon={<Layers size={16} />} text="ประเภทพื้นผิว" />
              <div style={styles.toggleRow}>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => handleSurfaceChange("floor")}
                  style={{
                    ...styles.toggleBtn,
                    ...(surfaceType === "floor" ? styles.toggleBtnActive : {}),
                  }}
                >
                  <LayoutGrid size={18} />
                  พื้น
                </button>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => handleSurfaceChange("wall")}
                  style={{
                    ...styles.toggleBtn,
                    ...(surfaceType === "wall" ? styles.toggleBtnActive : {}),
                  }}
                >
                  <PanelTop size={18} />
                  ผนัง
                </button>
              </div>
            </div>

            {/* Area input */}
            <div className="dtc-glass" style={styles.card}>
              <SectionLabel icon={<Calculator size={16} />} text="พื้นที่ที่ต้องการปู" />
              <div style={styles.areaInputRow}>
                <input
                  className="dtc-input"
                  type="number"
                  min="0"
                  step="0.5"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  style={styles.areaInput}
                />
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
                      style={{
                        ...styles.wasteBtn,
                        ...(waste === w ? styles.wasteBtnActive : {}),
                      }}
                    >
                      {w === 0 ? "ไม่เผื่อ" : `+${w}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay option */}
            <div className="dtc-glass" style={styles.card}>
              <SectionLabel icon={<Package size={16} />} text="ปูทับกระเบื้องเดิม" />
              <div style={styles.toggleRow}>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => setOverlay(false)}
                  style={{
                    ...styles.toggleBtn,
                    ...(!overlay ? styles.toggleBtnActive : {}),
                  }}
                >
                  ปูใหม่
                </button>
                <button
                  className="dtc-toggle-btn"
                  onClick={() => setOverlay(true)}
                  style={{
                    ...styles.toggleBtn,
                    ...(overlay ? styles.toggleBtnActive : {}),
                  }}
                >
                  ปูทับ
                </button>
              </div>
            </div>

            {/* Tile size selection */}
            <div className="dtc-glass" style={styles.card}>
              <SectionLabel icon={<LayoutGrid size={16} />} text={`ขนาดกระเบื้อง${surfaceType === "floor" ? "พื้น" : "ผนัง"}`} />
              <div className="dtc-tile-grid" style={styles.tileGrid}>
                {tiles.map((t) => (
                  <div
                    key={t.id}
                    className="dtc-tile-card"
                    onClick={() => setTileId(t.id)}
                    style={{
                      ...styles.tileCard,
                      ...(tileId === t.id ? styles.tileCardActive : {}),
                    }}
                  >
                    <div style={styles.tileSize}>{t.label}</div>
                    {t.sub && <div style={styles.tileSub}>{t.sub}</div>}
                    <div style={styles.tileCoverage}>
                      ปูได้ {t.coverage} ตร.ม./กล่อง
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adhesive brand */}
            <div className="dtc-glass" style={styles.card}>
              <SectionLabel icon={<Package size={16} />} text="ยี่ห้อปูนกาว" />
              <div style={styles.notePill}>ระบบเลือกทั้ง 2 ยี่ห้อให้โดยอัตโนมัติ</div>
              <div className="dtc-brand-grid" style={styles.recommendedBrandRow}>
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
                  <div style={styles.hintText}>ปูนกาว 1 กระสอบ ปูได้ {ADHESIVE_COVERAGE} ตร.ม. · ยาแนว 1 ถุง ปูได้ {GROUT_COVERAGE} ตร.ม.</div>
                  <div style={styles.brandDescription}>เลือกปูนกาวอัตโนมัติตามงาน ไม่ต้องเลือกเอง</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: results */}
          <div className="dtc-right-col" style={styles.rightCol}>
            <div className="dtc-glass" style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div className="dtc-heading" style={styles.resultTitle}>สรุปวัสดุที่ต้องใช้</div>
                <div style={styles.resultArea}>
                  {round2(effectiveArea)} ตร.ม. {waste > 0 && <span style={styles.resultAreaBase}>(รวมเผื่อเสีย จาก {round2(Number(area) || 0)})</span>}
                </div>
              </div>

              <ResultRow
                label={`กระเบื้อง ${activeTile.label}`}
                value={results.boxes}
                unit="กล่อง"
              />
              <ResultRow
                label="ปูนกาว (COTTO + จระเข้)"
                value={results.adhesiveBags}
                unit="กระสอบ"
                accent={recommendedAdhesive.brands[0].color}
              />
              <ResultRow
                label="ยาแนว"
                value={results.groutBags}
                unit="ถุง"
              />

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

              <div style={styles.disclaimer}>
                ตัวเลขเป็นการประมาณการเบื้องต้น ปริมาณจริงอาจแตกต่างกันตามลวดลาย รอยต่อ และหน้างานจริง
              </div>
            </div>
          </div>
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
}: {
  label: string;
  value: number;
  unit: string;
  accent?: string;
}) {
  return (
    <div style={styles.resultRow}>
      <span style={styles.resultRowLabel}>{label}</span>
      <span style={{ ...styles.resultRowValue, color: accent || "#fff" }}>
        {value} <span style={styles.resultRowUnit}>{unit}</span>
      </span>
    </div>
  );
}

const RED = "#ED1B2E";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(circle at 15% 0%, #22252b 0%, #14161a 45%, #0c0d10 100%)",
    padding: "40px 20px",
  },
  container: { maxWidth: 980, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: `linear-gradient(135deg, ${RED}, #a80f1d)`,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Kanit', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 0.5,
    boxShadow: `0 8px 24px ${RED}44`,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: 600 },
  subtitle: { color: "#8a8f98", fontSize: 13, marginTop: 2 },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.35fr 1fr",
    gap: 20,
    alignItems: "start",
  },
  leftCol: { display: "flex", flexDirection: "column", gap: 16 },
  rightCol: { position: "sticky", top: 20 },
  card: { padding: "18px 20px" },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#c7cad1",
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
    padding: "12px 0",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#c7cad1",
    fontSize: 15,
    fontWeight: 500,
  },
  toggleBtnActive: {
    background: `linear-gradient(135deg, ${RED}, #a80f1d)`,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: RED,
    color: "#fff",
  },
  areaInputRow: { display: "flex", alignItems: "center", gap: 12 },
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
  },
  areaUnit: { color: "#8a8f98", fontSize: 14, minWidth: 40 },
  wasteLabel: { color: "#8a8f98", fontSize: 12.5, marginBottom: 8 },
  wasteBtn: {
    flex: 1,
    padding: "8px 0",
    borderRadius: 10,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#c7cad1",
    fontSize: 13,
  },
  wasteBtnActive: {
    background: "rgba(237,27,46,0.18)",
    borderColor: RED,
    color: "#ff8891",
  },
  tileGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  tileCard: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: "12px 10px",
    textAlign: "center",
  },
  tileCardActive: {
    borderColor: RED,
    background: "rgba(237,27,46,0.14)",
  },
  tileSize: { color: "#fff", fontSize: 14, fontWeight: 600 },
  tileSub: { color: "#8a8f98", fontSize: 10.5, marginTop: 2 },
  tileCoverage: { color: "#8a8f98", fontSize: 11, marginTop: 6 },
  brandRow: { display: "flex", gap: 10 },
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
  recommendedBrandRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  recommendedBrandCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: "14px 16px",
  },
  brandDot: { width: 12, height: 12, borderRadius: "50%", flexShrink: 0 },
  brandName: { color: "#fff", fontSize: 14, fontWeight: 600 },
  brandTag: { color: "#8a8f98", fontSize: 10.5, letterSpacing: 0.5 },
  hintRow: { display: "flex", gap: 6, marginTop: 12, alignItems: "flex-start" },
  hintText: { color: "#767b85", fontSize: 11.5, lineHeight: 1.5 },
  resultCard: { padding: "22px 24px" },
  resultHeader: { marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" },
  resultTitle: { color: "#fff", fontSize: 18, fontWeight: 600 },
  resultArea: { color: "#8a8f98", fontSize: 12.5, marginTop: 6 },
  resultAreaBase: { color: "#5f636b" },
  brandDescription: { color: "#9aa0ac", fontSize: 12.5, marginTop: 4, maxWidth: 320 },
  recommendationBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.08)",
  },
  recommendationTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
  },
  recommendationText: {
    color: "#c7cad1",
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  recommendationList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
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
  resultRowLabel: { color: "#c7cad1", fontSize: 13.5 },
  resultRowValue: { fontSize: 20, fontWeight: 700 },
  resultRowUnit: { fontSize: 12, fontWeight: 400, color: "#8a8f98" },
  disclaimer: { color: "#5f636b", fontSize: 11, lineHeight: 1.6, marginTop: 16 },
};