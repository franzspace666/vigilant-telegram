"use client";

import Link from "next/link";

const ZDROJ_LABELS: Record<string, string> = {
  MZE:               "MZe / eAGRI",
  SZIF:              "SZIF",
  SZIF_MAS:          "SZIF – MAS",
  SFZP:              "SFŽP",
  OPZP:              "OP Životní prostředí",
  MAS_KRKONOSE:      "MAS Krkonoše",
  MMR_CESTOVNI_RUCH: "MMR – Cestovní ruch",
  CRR:               "CRR",
  DOTACE_EU:         "Dotace EU",
  CINEA:             "CINEA (EU)",
  AOPK:              "AOPK",
  NPZP:              "NPZP",
};

const BAR_COLORS = [
  "var(--accent-emerald)",
  "var(--accent-blue)",
  "var(--accent-violet)",
  "var(--accent-amber)",
  "var(--accent-rose)",
  "var(--text-muted)",
];

interface ProgramItem {
  slug: string;
  value: number;
}

export default function ProgramChart({ programs }: { programs: ProgramItem[] }) {
  const maxValue = Math.max(...programs.map((p) => p.value), 1);

  return (
    <div
      className="animate-fade-in-up delay-4"
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
          Sledované programy
        </h2>
        <Link
          href="/vyzvy"
          style={{ fontSize: 12, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500, paddingTop: 2 }}
        >
          Zobrazit vše →
        </Link>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Kliknutím zobrazíš výzvy daného programu
      </p>

      {programs.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, padding: "20px 0" }}>
          Žádné programy k zobrazení.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {programs.map((prog, i) => {
            const label = ZDROJ_LABELS[prog.slug] ?? prog.slug;
            return (
              <Link
                key={prog.slug}
                href={`/vyzvy?zdroj=${encodeURIComponent(prog.slug)}`}
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
                      {prog.value}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "rgba(142,142,160,0.08)", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      className="chart-bar"
                      style={{
                        width: `${(prog.value / maxValue) * 100}%`,
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
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Aktivních programů</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
          {programs.length}
        </span>
      </div>
    </div>
  );
}
