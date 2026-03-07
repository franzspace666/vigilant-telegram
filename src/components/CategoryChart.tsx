"use client";

import Link from "next/link";

const OBLAST_LABELS: Record<string, string> = {
  "cestovni-ruch":    "Cestovní ruch",
  "zemedelstvi":      "Zemědělství",
  "zpracovani":       "Zpracování",
  "energetika":       "Energetika",
  "regionalni-produkt": "Regionální produkt",
  "zivotni-prostredi":"Životní prostředí",
  "rozvoj-obci":      "Rozvoj obcí",
  "uspory-energie":   "Úspory energie",
  "lesnictvi":        "Lesnictví",
  "odpady":           "Odpady",
  "ovzdusi":          "Ovzduší",
  "voda":             "Voda",
  "ostatni":          "Ostatní",
};

const BAR_COLORS = [
  "var(--accent-blue)",
  "var(--accent-emerald)",
  "var(--accent-violet)",
  "var(--accent-amber)",
  "var(--accent-rose)",
  "var(--text-muted)",
];

interface CategoryItem {
  slug: string;
  value: number;
}

export default function CategoryChart({ categories, total }: { categories: CategoryItem[]; total: number }) {
  const maxValue = Math.max(...categories.map((c) => c.value), 1);

  return (
    <div
      className="animate-fade-in-up delay-3"
      style={{
        background: "var(--bg-surface)",
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Výzvy dle kategorií
        </h2>
        <Link
          href="/vyzvy"
          style={{ fontSize: 12, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500, paddingTop: 2 }}
        >
          Zobrazit vše →
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Kliknutím zobrazíš výzvy v dané kategorii
      </p>

      {categories.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: "20px 0" }}>
          Žádná data k zobrazení.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {categories.map((cat, i) => {
            const label = OBLAST_LABELS[cat.slug] ?? cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/vyzvy?oblast=${encodeURIComponent(cat.slug)}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    borderRadius: 8,
                    padding: "8px 10px",
                    transition: "background 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-hover, rgba(59,91,219,0.04))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: BAR_COLORS[i % BAR_COLORS.length], fontFamily: "var(--font-display)" }}>
                      {cat.value}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "rgba(142,142,160,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      className="chart-bar"
                      style={{
                        width: `${(cat.value / maxValue) * 100}%`,
                        height: "100%",
                        background: BAR_COLORS[i % BAR_COLORS.length],
                        borderRadius: 3,
                        animationDelay: `${0.3 + i * 0.07}s`,
                        transformOrigin: "left",
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Celkem aktivních výzev</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{total}</span>
      </div>
    </div>
  );
}
