"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";

interface NotifikaceVyzva {
  id: string;
  nazev: string;
  zdroj: string;
}

interface Notifikace {
  id: string;
  typ: string;
  predmet: string;
  obsah: string;
  odeslano: boolean;
  createdAt: string;
  vyzva: NotifikaceVyzva | null;
}

const typIcons: Record<string, { label: string; color: string; bg: string }> = {
  email: { label: "E-mail", color: "var(--accent-blue)", bg: "var(--accent-blue-light)" },
  sms: { label: "SMS", color: "var(--accent-violet)", bg: "var(--accent-violet-light)" },
  push: { label: "Push", color: "var(--accent-amber)", bg: "var(--accent-amber-light)" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Dnes ${d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}`;
  if (diffDays === 1) return `Včera ${d.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}`;
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function NotifikacePage() {
  const [notifikace, setNotifikace] = useState<Notifikace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifikace/default-zadatel")
      .then((r) => r.json())
      .then((data) => {
        setNotifikace(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageLayout title="Notifikace">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>Načítám...</div>
      </PageLayout>
    );
  }

  const unreadCount = notifikace.filter((n) => !n.odeslano).length;

  return (
    <PageLayout title="Notifikace" subtitle={notifikace.length > 0 ? `${unreadCount} nepřečtených` : undefined}>
      <div style={{ maxWidth: 720 }}>
        {notifikace.length === 0 ? (
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 8px",
              }}
            >
              Žádné notifikace
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Notifikace se zde zobrazí, jakmile budou k dispozici nové výzvy odpovídající vašemu profilu.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifikace.map((n, i) => {
              const typ = typIcons[n.typ] || typIcons.email;
              return (
                <div
                  key={n.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${i * 0.04}s`,
                    background: n.odeslano ? "var(--bg-surface)" : "rgba(59,91,219,0.03)",
                    borderRadius: 12,
                    border: `1px solid ${n.odeslano ? "var(--border-light)" : "rgba(59,91,219,0.15)"}`,
                    boxShadow: "var(--shadow-sm)",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: n.odeslano ? "transparent" : "var(--accent-blue)",
                      marginTop: 6, flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: typ.color, background: typ.bg, padding: "2px 8px", borderRadius: 4 }}>
                        {typ.label}
                      </span>
                      {n.vyzva && (
                        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--accent-emerald)", background: "var(--accent-emerald-light)", padding: "2px 8px", borderRadius: 4 }}>
                          {n.vyzva.zdroj}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 14,
                        color: n.odeslano ? "var(--text-secondary)" : "var(--text-primary)",
                        fontWeight: n.odeslano ? 400 : 500,
                        margin: 0, lineHeight: 1.5,
                      }}
                    >
                      {n.vyzva ? (
                        <a href={`/vyzvy/${n.vyzva.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          <strong>{n.vyzva.nazev}</strong> — {n.obsah}
                        </a>
                      ) : (
                        n.obsah
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
