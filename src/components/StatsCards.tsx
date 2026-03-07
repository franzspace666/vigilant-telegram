"use client";

interface StatsData {
  totalActive: number;
  approachingDeadlines: number;
  distinctZdroje: number;
  newThisMonth: number;
}

export default function StatsCards({ data }: { data: StatsData }) {
  const stats = [
    {
      label: "Aktivní výzvy",
      value: String(data.totalActive),
      change: `+${data.newThisMonth} tento měsíc`,
      trend: "up" as const,
      color: "var(--accent-blue)",
      bgColor: "var(--accent-blue-light)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h14M4 8h14M4 12h10M4 16h8" />
        </svg>
      ),
    },
    {
      label: "Blížící se termíny",
      value: String(data.approachingDeadlines),
      change: "do 14 dnů",
      trend: "warn" as const,
      color: "var(--accent-amber)",
      bgColor: "var(--accent-amber-light)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="9" />
          <path d="M11 6v5l3.5 2" />
        </svg>
      ),
    },
    {
      label: "Sledované programy",
      value: String(data.distinctZdroje),
      change: "zdrojů výzev",
      trend: "neutral" as const,
      color: "var(--accent-violet)",
      bgColor: "var(--accent-violet-light)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 17l5-5 4 4 9-9" />
          <path d="M15 3h4v4" />
        </svg>
      ),
    },
    {
      label: "Nové tento měsíc",
      value: String(data.newThisMonth),
      change: "nově přidaných",
      trend: "up" as const,
      color: "var(--accent-emerald)",
      bgColor: "var(--accent-emerald-light)",
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 11l2.5 2.5L15 8" />
          <circle cx="11" cy="11" r="9" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`animate-fade-in-up delay-${i + 1}`}
          style={{
            background: "var(--bg-surface)",
            borderRadius: 14,
            padding: "20px 22px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            cursor: "default",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: `radial-gradient(circle at top right, ${stat.bgColor}, transparent 70%)`,
              opacity: 0.8,
            }}
          />
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: stat.bgColor,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1,
              marginBottom: 4,
              letterSpacing: "-0.02em",
              position: "relative",
            }}
          >
            {stat.value}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 2, position: "relative" }}>
            {stat.label}
          </div>
          <div
            style={{
              fontSize: 12,
              color: stat.trend === "up" ? "var(--accent-emerald)" : stat.trend === "warn" ? "var(--accent-amber)" : "var(--text-muted)",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 3,
              position: "relative",
            }}
          >
            {stat.trend === "up" && "↑ "}
            {stat.trend === "warn" && "⏱ "}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
