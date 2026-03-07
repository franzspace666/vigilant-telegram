"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { daysUntilDeadline } from "@/lib/mockData";
import { mapDbStatus, statusLabels, formatCastka, type VyzvaFromAPI } from "@/lib/types";

interface UlozenaItem {
  id: string;
  vyzvaId: string;
  relevance: number | null;
  poznamka: string | null;
  createdAt: string;
  vyzva: VyzvaFromAPI;
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
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {statusLabels[uiStatus] || status}
    </span>
  );
}

export default function UlozenePage() {
  const [items, setItems] = useState<UlozenaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ulozene/default-zadatel")
      .then((r) => r.json())
      .then((data) => {
        setItems(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleRemove(vyzvaId: string) {
    await fetch("/api/ulozene", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zadatelId: "default-zadatel", vyzvaId }),
    });
    setItems((prev) => prev.filter((i) => i.vyzvaId !== vyzvaId));
  }

  if (loading) {
    return (
      <PageLayout title="Uložené výzvy">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          Načítám...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Uložené výzvy" subtitle={`${items.length} uložených výzev`}>
      {items.length === 0 ? (
        <div
          className="animate-fade-in-up delay-1"
          style={{
            background: "var(--bg-surface)",
            borderRadius: 14,
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            padding: "80px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>☆</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            Zatím nemáte žádné uložené výzvy
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            Procházejte výzvy a ukládejte si ty, které vás zajímají. Uložené výzvy se zobrazí zde.
          </p>
          <Link
            href="/vyzvy"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
              color: "white",
              background: "var(--accent-blue)",
              padding: "10px 24px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Procházet výzvy →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => {
            const v = item.vyzva;
            const days = v.deadline ? daysUntilDeadline(v.deadline) : null;
            return (
              <div
                key={item.id}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  background: "var(--bg-surface)",
                  borderRadius: 14,
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-sm)",
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <StatusBadge status={v.status} />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{v.zdroj}</span>
                  </div>
                  <Link
                    href={`/vyzvy/${v.id}`}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      lineHeight: 1.3,
                    }}
                  >
                    {v.nazev}
                  </Link>
                  <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                    <span>Alokace: {formatCastka(v.alokace)}</span>
                    <span>Max: {formatCastka(v.maxCastka)}</span>
                    {days !== null && (
                      <span
                        style={{
                          color: days <= 14 ? "var(--accent-amber)" : "var(--text-secondary)",
                          fontWeight: days <= 14 ? 600 : 400,
                        }}
                      >
                        {days > 0 ? `${days} dní do deadline` : "Deadline uplynul"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.vyzvaId)}
                  title="Odebrat z uložených"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid var(--border-light)",
                    background: "var(--bg-surface)",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent-rose)";
                    e.currentTarget.style.borderColor = "var(--accent-rose)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderColor = "var(--border-light)";
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
