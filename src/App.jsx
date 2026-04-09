import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const JOURNEYS = [
  {
    id: 1,
    title: "Tour of Tuscany",
    subtitle: "Sangiovese · Brunello · Chianti",
    region: "Italy",
    months: 4,
    bottles: 8,
    price: 59,
    color: "#8B2252",
    accent: "#D4A574",
    description: "Wind through the sun-drenched hills of central Italy. From bold Brunellos to elegant Chiantis, discover why Tuscany remains the heart of Italian winemaking.",
    lessons: ["Terroir & Tradition", "The Sangiovese Grape", "Food & Wine Pairing"],
    coords: { x: 52, y: 32 },
    flavorProfile: [6, 1, 8, 6, 8, 7],
    // Retail total: $280 | Sub total: $236 | Savings: $44
    wines: [
      { month: 1, name: "Antinori Pèppoli Chianti Classico", grape: "Sangiovese", retail: 22, year: "2024" },
      { month: 1, name: "Castello di Volpaia Chianti Classico", grape: "Sangiovese", retail: 24, year: "2022" },
      { month: 2, name: "Frescobaldi Nipozzano Riserva", grape: "Sangiovese", retail: 25, year: "2021" },
      { month: 2, name: "Castello di Fonterutoli Chianti Classico", grape: "Sangiovese-Merlot", retail: 28, year: "2021" },
      { month: 3, name: "Banfi Brunello di Montalcino", grape: "Sangiovese Grosso", retail: 63, year: "2019" },
      { month: 3, name: "Argiano Rosso di Montalcino", grape: "Sangiovese", retail: 24, year: "2022" },
      { month: 4, name: "Avignonesi Vino Nobile di Montepulciano", grape: "Prugnolo Gentile", retail: 32, year: "2020" },
      { month: 4, name: "Tenuta San Guido Guidalberto", grape: "Cabernet-Merlot", retail: 62, year: "2021" },
    ],
  },
  {
    id: 2,
    title: "Hidden Gems of Argentina",
    subtitle: "Malbec · Torrontés · Bonarda",
    region: "Argentina",
    months: 3,
    bottles: 6,
    price: 49,
    color: "#4A1A6B",
    accent: "#E8B4B8",
    description: "Explore the high-altitude vineyards of Mendoza and beyond. Argentina's bold reds and aromatic whites are rewriting the rules of South American wine.",
    lessons: ["Altitude & Flavor", "The Malbec Revolution", "Argentine Asado Pairings"],
    coords: { x: 28, y: 72 },
    flavorProfile: [8, 3, 6, 8, 6, 5],
    // Retail total: $162 | Sub total: $147 | Savings: $15
    wines: [
      { month: 1, name: "Catena Malbec High Mountain Vines", grape: "Malbec", retail: 23, year: "2022" },
      { month: 1, name: "Susana Balbo Signature Barrel Fermented Torrontés", grape: "Torrontés", retail: 27, year: "2023" },
      { month: 2, name: "Catena Alta Malbec", grape: "Malbec", retail: 35, year: "2021" },
      { month: 2, name: "La Posta Armando Bonarda", grape: "Bonarda", retail: 15, year: "2023" },
      { month: 3, name: "Achaval-Ferrer Malbec", grape: "Malbec", retail: 24, year: "2022" },
      { month: 3, name: "Zuccardi Valle de Uco Malbec", grape: "Malbec", retail: 38, year: "2023" },
    ],
  },
  {
    id: 3,
    title: "Old World vs New World",
    subtitle: "France · USA · Spain · Australia",
    region: "Global",
    months: 4,
    bottles: 8,
    price: 69,
    color: "#1A3A2A",
    accent: "#C4A265",
    description: "The ultimate showdown. Taste side-by-side comparisons that reveal how tradition and innovation shape every glass. Your palate will never be the same.",
    lessons: ["Tradition vs Innovation", "Climate & Character", "Blind Tasting Mastery"],
    coords: { x: 50, y: 50 },
    flavorProfile: [7, 2, 6.5, 8, 7, 6],
    // Retail total: $296 | Sub total: $276 | Savings: $20
    wines: [
      { month: 1, name: "Louis Jadot Bourgogne Pinot Noir", grape: "Pinot Noir", retail: 24, year: "2022", origin: "France" },
      { month: 1, name: "Erath Oregon Pinot Noir", grape: "Pinot Noir", retail: 22, year: "2022", origin: "USA" },
      { month: 2, name: "Château Larose-Trintaudon Haut-Médoc", grape: "Cabernet Blend", retail: 28, year: "2020", origin: "France" },
      { month: 2, name: "Penfolds Bin 28 Kalimna Shiraz", grape: "Shiraz", retail: 35, year: "2021", origin: "Australia" },
      { month: 3, name: "Bodegas Muga Rioja Reserva", grape: "Tempranillo Blend", retail: 32, year: "2020", origin: "Spain" },
      { month: 3, name: "Marqués de Murrieta Rioja Reserva", grape: "Tempranillo", retail: 30, year: "2019", origin: "Spain" },
      { month: 4, name: "d'Arenberg The Dead Arm Shiraz", grape: "Shiraz", retail: 55, year: "2021", origin: "Australia" },
      { month: 4, name: "Cassagne et Vitailles Clas Mani Terrasses du Larzac", grape: "Syrah-Carignan", retail: 70, year: "2021", origin: "France" },
    ],
  },
];

const FLAVOR_LABELS = ["Body", "Sweet", "Acid", "Fruit", "Tannin", "Spice"];

const MAP_REGIONS = [
  { name: "France", x: 49, y: 30, wines: "Cabernet Sauvignon, Pinot Noir, Chardonnay" },
  { name: "Italy", x: 52, y: 32, wines: "Sangiovese, Nebbiolo, Pinot Grigio" },
  { name: "Spain", x: 46, y: 33, wines: "Tempranillo, Garnacha, Albariño" },
  { name: "Argentina", x: 28, y: 72, wines: "Malbec, Torrontés, Bonarda" },
  { name: "USA", x: 18, y: 34, wines: "Cabernet Sauvignon, Zinfandel, Pinot Noir" },
  { name: "Australia", x: 82, y: 72, wines: "Shiraz, Chardonnay, Riesling" },
  { name: "Chile", x: 26, y: 68, wines: "Carménère, Sauvignon Blanc, Merlot" },
  { name: "South Africa", x: 54, y: 70, wines: "Pinotage, Chenin Blanc, Shiraz" },
  { name: "Germany", x: 51, y: 27, wines: "Riesling, Spätburgunder, Gewürztraminer" },
  { name: "Portugal", x: 44, y: 34, wines: "Touriga Nacional, Alvarinho, Baga" },
];

/* ─── Radar Chart ─── */
function RadarChart({ data, size = 180 }) {
  const center = size / 2;
  const radius = size / 2 - 30;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const polygonPoints = data.map((v, i) => {
    const p = getPoint(i, v);
    return `${p.x},${p.y}`;
  }).join(" ");

  const gridLevels = [2.5, 5, 7.5, 10];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={data.map((_, i) => {
            const p = getPoint(i, level);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const p = getPoint(i, 10);
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        );
      })}
      <polygon points={polygonPoints} fill="rgba(196,162,101,0.2)" stroke="#C4A265" strokeWidth="1.5" />
      {data.map((v, i) => {
        const p = getPoint(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C4A265" />;
      })}
      {FLAVOR_LABELS.map((label, i) => {
        const p = getPoint(i, 12.5);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="'Cormorant Garamond', serif">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Animated Counter ─── */
function Counter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Scroll Fade-In ─── */
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Interactive World Map ─── */
function WorldMap() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto", aspectRatio: "2/1" }}>
      <svg viewBox="0 0 100 50" style={{ width: "100%", height: "100%", opacity: 0.15 }}>
        <ellipse cx="50" cy="25" rx="45" ry="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
        <path d="M5,25 Q25,10 50,25 Q75,10 95,25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.15" />
        <path d="M5,25 Q25,40 50,25 Q75,40 95,25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.15" />
      </svg>
      {MAP_REGIONS.map((region) => (
        <button
          key={region.name}
          onClick={() => setActive(active?.name === region.name ? null : region)}
          style={{
            position: "absolute",
            left: `${region.x}%`,
            top: `${region.y}%`,
            transform: "translate(-50%, -50%)",
            background: active?.name === region.name ? "#C4A265" : "rgba(196,162,101,0.3)",
            border: "2px solid #C4A265",
            borderRadius: "50%",
            width: active?.name === region.name ? 16 : 10,
            height: active?.name === region.name ? 16 : 10,
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: active?.name === region.name ? "0 0 20px rgba(196,162,101,0.4)" : "none",
            zIndex: 2,
            padding: 0,
          }}
        />
      ))}
      {active && (
        <div
          style={{
            position: "absolute",
            left: `${Math.min(Math.max(active.x, 20), 80)}%`,
            top: `${active.y + 8}%`,
            transform: "translateX(-50%)",
            background: "rgba(20,12,8,0.95)",
            border: "1px solid rgba(196,162,101,0.3)",
            borderRadius: 12,
            padding: "16px 24px",
            backdropFilter: "blur(20px)",
            zIndex: 10,
            minWidth: 200,
            animation: "tooltipIn 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#C4A265", marginBottom: 4 }}>{active.name}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{active.wines}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Wine List Modal ─── */
function WineListModal({ journey, onClose }) {
  const totalRetail = journey.wines.reduce((sum, w) => sum + w.retail, 0);
  const totalSub = journey.price * journey.months;
  const savings = totalRetail - totalSub;
  const months = [...new Set(journey.wines.map(w => w.month))];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, animation: "modalOverlayIn 0.3s ease forwards",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #1A1410, #0D0907)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24, padding: "48px 40px", maxWidth: 600,
          width: "100%", maxHeight: "85vh", overflowY: "auto",
          position: "relative",
          animation: "modalCardIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 20, right: 20,
            background: "rgba(255,255,255,0.08)", border: "none",
            borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            color: "rgba(255,255,255,0.5)", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.08)"}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 4,
          color: journey.accent, textTransform: "uppercase", marginBottom: 8,
        }}>
          {journey.months}-Month Journey · {journey.bottles} Bottles
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400,
          color: "#FAFAF7", margin: "0 0 8px", lineHeight: 1.2,
        }}>
          {journey.title}
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.4)", marginBottom: 28,
        }}>
          Your curated wine selection, delivered 2 bottles per month.
        </p>

        {/* Wine list by month */}
        {months.map(month => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3,
              color: journey.accent, textTransform: "uppercase", marginBottom: 12,
              paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              Month {month}
            </div>
            {journey.wines.filter(w => w.month === month).map((wine, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 0", gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400,
                    color: "#FAFAF7", lineHeight: 1.3, marginBottom: 3,
                  }}>
                    {wine.name}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                  }}>
                    {wine.grape} · {wine.year}{wine.origin ? ` · ${wine.origin}` : ""}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                  color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap", paddingTop: 2,
                }}>
                  ${wine.retail}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Pricing summary */}
        <div style={{
          marginTop: 8, padding: "20px 24px",
          background: `linear-gradient(135deg, ${journey.color}20, rgba(255,255,255,0.03))`,
          borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              Combined retail value
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>
              ${totalRetail}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              VIA subscription ({journey.months} mo × ${journey.price})
            </span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: journey.accent }}>
              ${totalSub}
            </span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#FAFAF7" }}>
              You save
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#6ECF7A" }}>
              ${savings}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          style={{
            marginTop: 24, width: "100%", padding: "16px 32px",
            background: journey.accent, border: "none", borderRadius: 50,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: "#0D0907", cursor: "pointer", letterSpacing: 0.5,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.02)"; e.target.style.boxShadow = `0 8px 30px ${journey.accent}44`; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
        >
          Subscribe to This Journey →
        </button>
      </div>
    </div>
  );
}

/* ─── Journey Card ─── */
function JourneyCard({ journey, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showWines, setShowWines] = useState(false);

  return (
    <FadeIn delay={index * 0.15}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: `linear-gradient(160deg, ${journey.color}22, rgba(20,12,8,0.8))`,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "40px 36px",
          cursor: "pointer",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
          transform: expanded ? "scale(1.02)" : "scale(1)",
          boxShadow: expanded ? `0 20px 60px ${journey.color}33` : "0 4px 20px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: 0, right: 0, width: 200, height: 200,
          background: `radial-gradient(circle at top right, ${journey.accent}15, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3,
              color: journey.accent, textTransform: "uppercase", marginBottom: 8,
            }}>
              {journey.months}-Month Journey · {journey.bottles} Bottles
            </div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500,
              color: "#FAFAF7", margin: 0, lineHeight: 1.2,
            }}>
              {journey.title}
            </h3>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              color: "rgba(255,255,255,0.4)", marginTop: 6,
            }}>
              {journey.subtitle}
            </div>
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300,
            color: journey.accent,
          }}>
            ${journey.price}<span style={{ fontSize: 14, opacity: 0.6 }}>/mo</span>
          </div>
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)", margin: "16px 0 0",
        }}>
          {journey.description}
        </p>

        <div style={{
          maxHeight: expanded ? 300 : 0,
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{ display: "flex", gap: 40, alignItems: "center", marginTop: 28, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 2,
                color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 12,
              }}>
                Flavor Profile
              </div>
              <RadarChart data={journey.flavorProfile} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 2,
                color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 16,
              }}>
                What You'll Learn
              </div>
              {journey.lessons.map((lesson, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: `${journey.accent}20`, border: `1px solid ${journey.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: journey.accent, fontWeight: 600, flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  {lesson}
                </div>
              ))}
              <button
                onClick={(e) => { e.stopPropagation(); setShowWines(true); }}
                style={{
                  marginTop: 20, padding: "12px 32px",
                  background: journey.accent, border: "none", borderRadius: 50,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                  color: "#0D0907", cursor: "pointer", letterSpacing: 0.5,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = `0 8px 24px ${journey.accent}44`; }}
                onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
              >
                Begin Journey
              </button>
            </div>
          </div>
        </div>

        <div style={{
          display: "flex", justifyContent: "center", marginTop: 16,
          color: "rgba(255,255,255,0.25)", fontSize: 18,
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.4s ease",
        }}>
          ▾
        </div>
      </div>

      {showWines && createPortal(
        <WineListModal journey={journey} onClose={() => setShowWines(false)} />,
        document.body
      )}
    </FadeIn>
  );
}

/* ─── Main App ─── */
export default function ViaHomepage() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      background: "#0D0907",
      color: "#FAFAF7",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: #C4A265; color: #0D0907; }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes rotateGradient {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalCardIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(250,250,247,0.5);
          text-decoration: none;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: color 0.3s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .nav-link:hover { color: #C4A265; }

        .stat-item {
          text-align: center;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 40px;
          background: #C4A265;
          color: #0D0907;
          border: none;
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cta-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(196,162,101,0.3);
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 40px;
          background: transparent;
          color: #FAFAF7;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .cta-secondary:hover {
          border-color: #C4A265;
          color: #C4A265;
        }

        .how-step {
          text-align: center;
          flex: 1;
          padding: 0 24px;
        }
      `}</style>

      {/* ─── NAVIGATION ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 48px",
        height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 80 ? "rgba(13,9,7,0.85)" : "transparent",
        backdropFilter: scrollY > 80 ? "blur(20px)" : "none",
        borderBottom: scrollY > 80 ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontWeight: 300,
          letterSpacing: 12,
          color: "#C4A265",
        }}>
          VIA
        </div>

        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {[
            { label: "Journeys", target: "journeys" },
            { label: "How It Works", target: "how-it-works" },
            { label: "Map", target: "map" },
          ].map((item) => (
            <button
              key={item.label}
              className="nav-link"
              onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {item.label}
            </button>
          ))}
          <button className="cta-primary" style={{ padding: "10px 28px", fontSize: 12 }}>
            Start Free
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient background */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(139,34,82,0.12) 0%, rgba(196,162,101,0.06) 40%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          animation: "rotateGradient 30s linear infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "60%", left: "30%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(196,162,101,0.08), transparent 70%)",
          animation: "float 8s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        <div style={{ animation: "heroFade 1.2s cubic-bezier(0.16,1,0.3,1) forwards", position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C4A265",
            marginBottom: 32,
          }}>
            A New Way to Experience Wine
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.05,
            maxWidth: 800,
            margin: "0 auto 24px",
            letterSpacing: -1,
          }}>
            Every glass
            <br />
            <span style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #C4A265, #E8D5B7, #C4A265)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 4s ease-in-out infinite",
            }}>
              tells a story
            </span>
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            maxWidth: 500,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}>
            Curated wine journeys that transport you to the world's greatest
            vineyards. Learn, taste, and discover — one bottle at a time.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-primary">Begin Your Journey →</button>
            <button className="cta-secondary">Explore the Map</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "float 3s ease-in-out infinite",
          opacity: 0.4,
        }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }} />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <FadeIn>
        <section style={{
          display: "flex",
          justifyContent: "center",
          gap: 80,
          padding: "60px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexWrap: "wrap",
        }}>
          {[
            { value: 24, suffix: "+", label: "Wine Regions" },
            { value: 150, suffix: "+", label: "Curated Wines" },
            { value: 12, suffix: "K", label: "Members" },
            { value: 4.9, suffix: "★", label: "Avg Rating" },
          ].map((stat, i) => (
            <div key={i} className="stat-item">
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42,
                fontWeight: 300,
                color: "#C4A265",
                lineHeight: 1,
              }}>
                {stat.value % 1 !== 0 ? stat.value : <Counter end={stat.value} />}{stat.suffix}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginTop: 8,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" style={{ padding: "120px 48px", maxWidth: 1100, margin: "0 auto", scrollMarginTop: 80 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              letterSpacing: 5, textTransform: "uppercase", color: "#C4A265", marginBottom: 16,
            }}>
              How It Works
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 300, lineHeight: 1.2,
            }}>
              Your journey in three sips
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { num: "01", title: "Choose Your Path", desc: "Select a journey that excites your palate. From regional deep-dives to global adventures." },
            { num: "02", title: "Taste & Learn", desc: "Receive curated bottles with tasting guides, video lessons, and flavor profiles." },
            { num: "03", title: "Level Up", desc: "Track your palate evolution. Unlock new journeys. Become the sommelier you deserve to be." },
          ].map((step, i) => (
            <FadeIn key={i} delay={i * 0.2} className="how-step" style={{ flex: 1, minWidth: 240 }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 56,
                fontWeight: 300, color: "rgba(196,162,101,0.35)", lineHeight: 1, marginBottom: 20,
                textShadow: "0 0 30px rgba(196,162,101,0.1)",
              }}>
                {step.num}
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                fontWeight: 400, marginBottom: 12, color: "#FAFAF7",
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
              }}>
                {step.desc}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── INTERACTIVE MAP ─── */}
      <section id="map" style={{
        padding: "120px 48px",
        background: "linear-gradient(180deg, transparent, rgba(196,162,101,0.03), transparent)",
        scrollMarginTop: 80,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                letterSpacing: 5, textTransform: "uppercase", color: "#C4A265", marginBottom: 16,
              }}>
                Explore
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300, lineHeight: 1.2, marginBottom: 16,
              }}>
                Wines of the World
              </h2>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)",
                maxWidth: 450, margin: "0 auto",
              }}>
                Tap a region to discover its signature wines
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <WorldMap />
          </FadeIn>
        </div>
      </section>

      {/* ─── JOURNEYS ─── */}
      <section id="journeys" style={{ padding: "120px 48px", maxWidth: 900, margin: "0 auto", scrollMarginTop: 80 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              letterSpacing: 5, textTransform: "uppercase", color: "#C4A265", marginBottom: 16,
            }}>
              Taste Journeys
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 300, lineHeight: 1.2, marginBottom: 16,
            }}>
              Choose your adventure
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)",
              maxWidth: 480, margin: "0 auto",
            }}>
              Every journey is crafted by master sommeliers. Click to explore flavor profiles and weekly lessons.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {JOURNEYS.map((journey, i) => (
            <JourneyCard key={journey.id} journey={journey} index={i} />
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section style={{
        padding: "120px 48px",
        background: "linear-gradient(180deg, transparent, rgba(139,34,82,0.04), transparent)",
      }}>
        <FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 64,
              color: "rgba(196,162,101,0.2)", lineHeight: 1, marginBottom: 24,
            }}>
              "
            </div>
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 300, fontStyle: "italic", lineHeight: 1.5,
              color: "rgba(255,255,255,0.75)", marginBottom: 32,
            }}>
              VIA transformed the way I think about wine. It's not just tasting — it's understanding. Every journey made me fall deeper in love with the craft.
            </blockquote>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, letterSpacing: 2,
              textTransform: "uppercase", color: "#C4A265",
            }}>
              Sofia R. — Member since 2024
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={{ padding: "120px 48px" }}>
        <FadeIn>
          <div style={{
            maxWidth: 800, margin: "0 auto", textAlign: "center",
            background: "linear-gradient(160deg, rgba(139,34,82,0.1), rgba(196,162,101,0.08))",
            border: "1px solid rgba(196,162,101,0.15)",
            borderRadius: 28,
            padding: "80px 48px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
              background: "radial-gradient(ellipse at top right, rgba(139,34,82,0.15), transparent 60%), radial-gradient(ellipse at bottom left, rgba(196,162,101,0.08), transparent 60%)",
              pointerEvents: "none",
            }} />
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 300, lineHeight: 1.2, marginBottom: 16,
            }}>
              Ready to explore?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.45)",
              maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.7,
            }}>
              Your first journey starts at $49/month. Cancel anytime.
              Free shipping on every delivery.
            </p>
            <button className="cta-primary" style={{ fontSize: 15, padding: "18px 48px" }}>
              Start Your Free Trial →
            </button>
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: "60px 48px 40px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 24,
              fontWeight: 300, letterSpacing: 10, color: "#C4A265", marginBottom: 12,
            }}>
              VIA
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)",
              maxWidth: 260, lineHeight: 1.6,
            }}>
              Curated wine journeys for the curious palate. Discover, learn, taste.
            </p>
          </div>
          {/* Footer link columns commented out for class project
          {[
            { title: "Explore", links: ["Journeys", "World Map", "Learn", "Gift"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Shipping", "Returns"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3,
                textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16,
              }}>
                {col.title}
              </div>
              {col.links.map((link) => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: "rgba(255,255,255,0.4)", textDecoration: "none",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={e => e.target.style.color = "#C4A265"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ))}
          */}
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12,
          color: "rgba(255,255,255,0.2)", textAlign: "center",
          paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.03)",
        }}>
          © 2026 VIA. Wines of the World Class Project. Must be 21+ to subscribe.
        </div>
      </footer>
    </div>
  );
}