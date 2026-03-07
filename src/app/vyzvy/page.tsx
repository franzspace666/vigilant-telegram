"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import {
  formatCastka,
  mapDbStatus,
  statusLabels,
  type VyzvaFromAPI,
} from "@/lib/types";
import { daysUntilDeadline, zdrojeList, oblastiList } from "@/lib/mockData";

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

function VyzvaCard({ vyzva }: { vyzva: VyzvaFromAPI & { relevance?: number | null } }) {
  const days = vyzva.deadline ? daysUntilDeadline(vyzva.deadline) : null;

  return (
    <Link
      href={`/vyzvy/${vyzva.id}`}
      style={{
        display: "block",
        background: "var(--bg-surface)",
        borderRadius: 14,
        border: "1px solid var(--border-light)",
        borderLeft: vyzva.status === "closing" ? "3px solid var(--accent-amber)" : "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
        padding: "20px 22px",
        textDecoration: "none",
        color: "inherit",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {vyzva.relevance != null && <RelevanceRing percent={vyzva.relevance} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <StatusBadge status={vyzva.status} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{vyzva.zdroj}</span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 6px",
              lineHeight: 1.3,
            }}
          >
            {vyzva.nazev}
          </h3>
          {vyzva.popis && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                margin: "0 0 12px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {vyzva.popis}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {vyzva.oblasti.map((o) => (
              <span
                key={o}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--accent-blue)",
                  background: "var(--accent-blue-light)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                {o}
              </span>
            ))}
          </div>
          {vyzva.typZadatele && vyzva.typZadatele.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {vyzva.typZadatele.slice(0, 3).map((typ) => (
                <span
                  key={typ}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    background: "rgba(142,142,160,0.08)",
                    border: "1px solid var(--border-light)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {typ}
                </span>
              ))}
              {vyzva.typZadatele.length > 3 && (
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>+{vyzva.typZadatele.length - 3}</span>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Alokace:</strong> {formatCastka(vyzva.alokace)}
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>Max:</strong> {formatCastka(vyzva.maxCastka)}
            </span>
            {days !== null && (
              <span
                style={{
                  color: days <= 14 ? "var(--accent-rose)" : days <= 30 ? "var(--accent-amber)" : "var(--text-secondary)",
                  fontWeight: days <= 14 ? 600 : 400,
                }}
              >
                {days > 0 ? `${days} dní do deadline` : "Deadline uplynul"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Map DB status to UI filter key
const dbStatusToFilter: Record<string, string> = {
  otevrena: "open",
  ukoncena: "closed",
  planovana: "planned",
  pozastavena: "closed",
};

export default function VyzvyPage() {
  const [vyzvy, setVyzvy] = useState<VyzvaFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [zdroj, setZdroj] = useState("");
  const [oblast, setOblast] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<"deadline" | "newest">("deadline");
  const [view, setView] = useState<"grid" | "list">("list");

  useEffect(() => {
    fetch("/api/vyzvy?status=all&limit=200")
      .then((r) => r.json())
      .then((data) => {
        setVyzvy(data.vyzvy || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...vyzvy];
    if (zdroj) result = result.filter((v) => v.zdroj === zdroj);
    if (oblast) result = result.filter((v) => v.oblasti.includes(oblast));
    if (status) result = result.filter((v) => dbStatusToFilter[v.status] === status || v.status === status);
    if (sort === "deadline") result.sort((a, b) => new Date(a.deadline || "9999").getTime() - new Date(b.deadline || "9999").getTime());
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [vyzvy, zdroj, oblast, status, sort]);

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-light)",
    background: "var(--bg-surface)",
    fontSize: 13,
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    outline: "none",
    cursor: "pointer",
    minWidth: 140,
  };

  return (
    <PageLayout
      title="Všechny výzvy"
      subtitle={loading ? "Načítám..." : filtered.length === vyzvy.length
        ? `${vyzvy.length} výzev celkem`
        : `${filtered.length} z ${vyzvy.length} výzev`}
    >
      {/* Filters */}
      <div
        className="animate-fade-in-up delay-1"
        style={{
          background: "var(--bg-surface)",
          borderRadius: 14,
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <select aria-label="Filtr zdroje" value={zdroj} onChange={(e) => setZdroj(e.target.value)} style={selectStyle}>
          <option value="">Všechny zdroje</option>
          {zdrojeList.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>

        <select aria-label="Filtr oblasti" value={oblast} onChange={(e) => setOblast(e.target.value)} style={selectStyle}>
          <option value="">Všechny oblasti</option>
          {oblastiList.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <select aria-label="Filtr stavu" value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
          <option value="">Všechny stavy</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select aria-label="Řazení" value={sort} onChange={(e) => setSort(e.target.value as "deadline" | "newest")} style={selectStyle}>
          <option value="deadline">Dle deadline</option>
          <option value="newest">Nejnovější</option>
        </select>

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["list", "grid"] as const).map((v) => (
            <button
              type="button"
              key={v}
              aria-label={v === "list" ? "Zobrazit seznam" : "Zobrazit mřížku"}
              onClick={() => setView(v)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                border: "1px solid var(--border-light)",
                background: view === v ? "var(--accent-blue-light)" : "var(--bg-surface)",
                color: view === v ? "var(--accent-blue)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {v === "list" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="5" height="5" rx="1" />
                  <rect x="10" y="1" width="5" height="5" rx="1" />
                  <rect x="1" y="10" width="5" height="5" rx="1" />
                  <rect x="10" y="10" width="5" height="5" rx="1" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)", fontSize: 15 }}>
          Načítám výzvy z databáze...
        </div>
      ) : (
        <>
          <div
            style={{
              display: view === "grid" ? "grid" : "flex",
              gridTemplateColumns: view === "grid" ? "repeat(2, 1fr)" : undefined,
              flexDirection: view === "list" ? "column" : undefined,
              gap: 16,
            }}
          >
            {filtered.map((v, i) => (
              <div key={v.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <VyzvaCard vyzva={v} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "var(--bg-surface)",
                borderRadius: 14,
                border: "1px solid var(--border-light)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6, fontFamily: "var(--font-display)" }}>
                Žádné výzvy nenalezeny
              </div>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                Zkuste upravit filtry nebo vyberte jiný typ žadatele.
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
