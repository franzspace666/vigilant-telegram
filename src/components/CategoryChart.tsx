"use client";

const colors = [
  "var(--accent-blue)",
  "var(--accent-emerald)",
  "var(--accent-violet)",
  "var(--accent-amber)",
  "var(--accent-rose)",
  "var(--text-muted)",
];

interface CategoryItem {
  label: string;
  value: number;
}

export default function CategoryChart({ categories, total }: { categories: CategoryItem[]; total: number }) {
  const maxValue = Math.max(...categories.map((c) => c.value), 1);

  if (categories.length === 0) {
    return (
      <div
        className="animate-fade-in-up delay-7"
        style={{
          background: "var(--bg-surface)",
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
          padding: "20px 22px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "0 0 12px",
          }}
        >
          Výzvy dle kategorií
        </h2>
        Žádná data k zobrazení.
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up delay-7"
      style={{
        background: "var(--bg-surface)",
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
        padding: "20px 22px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 4px",
          letterSpacing: "-0.01em",
        }}
      >
        Výzvy dle kategorií
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 22px" }}>
        Počet aktivních výzev v jednotlivých oblastech
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {categories.map((cat, i) => (
          <div key={cat.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                {cat.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {cat.value}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                background: "rgba(142,142,160,0.08)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                className="chart-bar"
                style={{
                  width: `${(cat.value / maxValue) * 100}%`,
                  height: "100%",
                  background: colors[i % colors.length],
                  borderRadius: 4,
                  animationDelay: `${0.4 + i * 0.08}s`,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Celkem aktivních výzev</span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          {total}
        </span>
      </div>
    </div>
  );
}
