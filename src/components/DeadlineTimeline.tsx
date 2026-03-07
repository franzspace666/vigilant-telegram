"use client";

interface DeadlineItem {
  id: string;
  name: string;
  provider: string;
  date: string;
  daysLeft: number;
}

function getColor(daysLeft: number) {
  if (daysLeft <= 15) return "var(--accent-rose)";
  if (daysLeft <= 30) return "var(--accent-amber)";
  if (daysLeft <= 60) return "var(--accent-blue)";
  return "var(--accent-emerald)";
}

export default function DeadlineTimeline({ deadlines }: { deadlines: DeadlineItem[] }) {
  if (deadlines.length === 0) {
    return (
      <div
        className="animate-fade-in-up delay-6"
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
          Blížící se termíny
        </h2>
        Žádné blížící se termíny.
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up delay-6"
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
        Blížící se termíny
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Nejbližší uzávěrky sledovaných výzev
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {deadlines.map((d, i) => {
          const color = getColor(d.daysLeft);
          return (
            <div
              key={d.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "14px 0",
                borderBottom: i < deadlines.length - 1 ? "1px solid var(--border-light)" : "none",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, paddingTop: 2 }}>
                <div
                  className="timeline-dot"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: color,
                    position: "relative",
                    flexShrink: 0,
                    color: color,
                  }}
                />
                {i < deadlines.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 28,
                      background: "var(--border-light)",
                      marginTop: 6,
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 2 }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                  {d.provider}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: d.daysLeft <= 15 ? "var(--accent-rose)" : d.daysLeft <= 30 ? "var(--accent-amber)" : "var(--text-secondary)",
                    }}
                  >
                    {d.date}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: d.daysLeft <= 15 ? "var(--accent-rose)" : "var(--text-muted)",
                      background: d.daysLeft <= 15 ? "var(--accent-rose-light)" : "rgba(142,142,160,0.08)",
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {d.daysLeft <= 15 ? `zbývá ${d.daysLeft} dní!` : `za ${d.daysLeft} dní`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
