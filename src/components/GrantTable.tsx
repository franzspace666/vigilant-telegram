"use client";

import Link from "next/link";
import { formatCastka, mapDbStatus, statusLabels } from "@/lib/types";

interface Grant {
  id: string;
  nazev: string;
  zdroj: string;
  deadline: string | null;
  alokace: string | null;
  status: string;
  relevance?: number | null;
}

function RelevanceRing({ percent }: { percent: number }) {
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent >= 80
      ? "var(--accent-emerald)"
      : percent >= 60
        ? "var(--accent-blue)"
        : percent >= 40
          ? "var(--accent-amber)"
          : "var(--text-muted)";

  return (
    <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
      <svg className="relevance-ring" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="16" fill="none" stroke="var(--border-light)" strokeWidth="3" />
        <circle
          className="progress"
          cx="22"
          cy="22"
          r="16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color,
        }}
      >
        {percent}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const uiStatus = mapDbStatus(status);
  const styles: Record<string, { bg: string; color: string }> = {
    open: { bg: "var(--accent-emerald-light)", color: "var(--accent-emerald)" },
    closing: { bg: "var(--accent-amber-light)", color: "var(--accent-amber)" },
    planned: { bg: "var(--accent-blue-light)", color: "var(--accent-blue)" },
    closed: { bg: "var(--accent-rose-light)", color: "var(--accent-rose)" },
  };
  const s = styles[uiStatus] || styles.open;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 500,
        color: s.color,
        background: s.bg,
        padding: "3px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {statusLabels[uiStatus] || status}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

export default function GrantTable({ grants }: { grants: Grant[] }) {
  if (grants.length === 0) {
    return (
      <div
        className="animate-fade-in-up delay-5"
        style={{
          background: "var(--bg-surface)",
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
          padding: "40px 22px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 14,
        }}
      >
        Zatím žádné výzvy v databázi.
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up delay-5"
      style={{
        background: "var(--bg-surface)",
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
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
            Nedávné výzvy
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>
            Nejnovější výzvy v databázi
          </p>
        </div>
        <Link
          href="/vyzvy"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--accent-blue)",
            background: "var(--accent-blue-light)",
            border: "none",
            padding: "7px 14px",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Zobrazit vše →
        </Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Název výzvy", "Poskytovatel", "Termín", "Alokace", "Stav"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border-light)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grants.map((grant, i) => (
              <tr
                key={grant.id}
                style={{
                  borderBottom: i < grants.length - 1 ? "1px solid var(--border-light)" : "none",
                  cursor: "pointer",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(59,91,219,0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <Link
                    href={`/vyzvy/${grant.id}`}
                    style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.4, textDecoration: "none" }}
                  >
                    {grant.nazev}
                  </Link>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  {grant.zdroj}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                  {formatDate(grant.deadline)}
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                  {formatCastka(grant.alokace)}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <StatusBadge status={grant.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
