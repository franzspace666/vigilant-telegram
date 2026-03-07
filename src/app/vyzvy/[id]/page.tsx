"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { formatDeadline, daysUntilDeadline } from "@/lib/mockData";
import { formatCastka, mapDbStatus, statusLabels, type VyzvaFromAPI } from "@/lib/types";
import { useState, useEffect } from "react";

function RelevanceBar({ percent }: { percent: number }) {
  const color =
    percent >= 80
      ? "var(--accent-emerald)"
      : percent >= 60
        ? "var(--accent-blue)"
        : percent >= 40
          ? "var(--accent-amber)"
          : "var(--text-muted)";

  const reasons =
    percent >= 80
      ? [
          "Oblast odpovídá vašemu profilu",
          "Lokalita v cílovém regionu (horské oblasti)",
          "Velikost podniku vyhovuje podmínkám",
          "Klíčová slova se shodují",
        ]
      : percent >= 60
        ? [
            "Částečná shoda s profilem žadatele",
            "Oblast částečně odpovídá",
            "Lokalita v širším regionu",
          ]
        : ["Nízká shoda s profilem žadatele", "Zkontrolujte podmínky výzvy"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--border-light)" }}>
          <div
            style={{
              width: `${percent}%`,
              height: "100%",
              borderRadius: 4,
              background: color,
              transition: "width 1s ease",
            }}
          />
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "var(--font-display)" }}>
          {percent}%
        </span>
      </div>
      <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}

export default function VyzvaDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [vyzva, setVyzva] = useState<VyzvaFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/vyzvy/${id}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data) {
          const isSaved = Array.isArray(data.ulozene) && data.ulozene.length > 0;
          setSaved(isSaved);
          setVyzva(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Načítám...">
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
          Načítám detail výzvy...
        </div>
      </PageLayout>
    );
  }

  if (!vyzva) {
    return (
      <PageLayout title="Výzva nenalezena">
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: 18, color: "var(--text-muted)", marginBottom: 20 }}>
            Tato výzva neexistuje nebo byla odstraněna.
          </p>
          <Link
            href="/vyzvy"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--accent-blue)",
              background: "var(--accent-blue-light)",
              padding: "10px 20px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            ← Zpět na seznam výzev
          </Link>
        </div>
      </PageLayout>
    );
  }

  const uiStatus = mapDbStatus(vyzva.status);
  const days = vyzva.deadline ? daysUntilDeadline(vyzva.deadline) : null;

  const statusColor: Record<string, string> = {
    open: "var(--accent-emerald)",
    closing: "var(--accent-amber)",
    planned: "var(--accent-blue)",
    closed: "var(--accent-rose)",
  };
  const statusBg: Record<string, string> = {
    open: "var(--accent-emerald-light)",
    closing: "var(--accent-amber-light)",
    planned: "var(--accent-blue-light)",
    closed: "var(--accent-rose-light)",
  };

  async function handleSave() {
    if (saved) {
      await fetch("/api/ulozene", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zadatelId: "default-zadatel", vyzvaId: vyzva!.id }),
      });
      setSaved(false);
    } else {
      await fetch("/api/ulozene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zadatelId: "default-zadatel", vyzvaId: vyzva!.id }),
      });
      setSaved(true);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const infoItems = [
    { label: "Zdroj", value: vyzva.zdroj },
    { label: "Celková alokace", value: formatCastka(vyzva.alokace) },
    { label: "Min. částka", value: formatCastka(vyzva.minCastka) },
    { label: "Max. částka", value: formatCastka(vyzva.maxCastka) },
    { label: "Míra spolufinancování", value: vyzva.miraSpolufinancovani ? `${vyzva.miraSpolufinancovani} %` : "—" },
    { label: "Datum vyhlášení", value: vyzva.datumVyhlaseni ? formatDeadline(vyzva.datumVyhlaseni) : "—" },
    { label: "Deadline", value: vyzva.deadline ? formatDeadline(vyzva.deadline) : "—" },
  ];

  return (
    <PageLayout title={vyzva.nazev}>
      <Link
        href="/vyzvy"
        className="animate-fade-in"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          fontWeight: 500,
          color: "var(--accent-blue)",
          textDecoration: "none",
          marginBottom: 20,
        }}
      >
        ← Zpět na seznam výzev
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            className="animate-fade-in-up delay-1"
            style={{
              background: "var(--bg-surface)",
              borderRadius: 14,
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
              padding: "22px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                  fontWeight: 500,
                  color: statusColor[uiStatus],
                  background: statusBg[uiStatus],
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[uiStatus] }} />
                {statusLabels[uiStatus]}
              </span>
              {vyzva.oblasti.map((o) => (
                <span
                  key={o}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--accent-blue)",
                    background: "var(--accent-blue-light)",
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  {o}
                </span>
              ))}
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              {vyzva.nazev}
            </h2>

            {vyzva.popis && (
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 20px" }}>
                {vyzva.popis}
              </p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "1px solid var(--border-light)",
                  background: saved ? "var(--accent-amber-light)" : "var(--bg-surface)",
                  color: saved ? "var(--accent-amber)" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 0.15s ease",
                }}
              >
                {saved ? "★ Uloženo" : "☆ Uložit"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "1px solid var(--border-light)",
                  background: "var(--bg-surface)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                {copied ? "✓ Zkopírováno" : "Sdílet"}
              </button>
              <a
                href={vyzva.zdrojUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--accent-blue)",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  textDecoration: "none",
                }}
              >
                Otevřít originál ↗
              </a>
            </div>
          </div>

          <div
            className="animate-fade-in-up delay-2"
            style={{
              background: "var(--bg-surface)",
              borderRadius: 14,
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
              padding: "22px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 16px",
              }}
            >
              Parametry výzvy
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {infoItems.map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {days !== null && (
            <div
              className="animate-fade-in-up delay-2"
              style={{
                background: "var(--bg-surface)",
                borderRadius: 14,
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                padding: "22px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Do uzávěrky zbývá
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 48,
                  fontWeight: 800,
                  color: days <= 14 ? "var(--accent-rose)" : days <= 30 ? "var(--accent-amber)" : "var(--accent-blue)",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {days > 0 ? days : 0}
              </div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                {days > 0 ? "dní" : "Deadline uplynul"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
                {formatDeadline(vyzva.deadline!)}
              </div>
            </div>
          )}

          <div
            className="animate-fade-in-up delay-4"
            style={{
              background: "var(--bg-surface)",
              borderRadius: 14,
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-sm)",
              padding: "22px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 12px",
              }}
            >
              Důležité
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Spolufinancování</span>
                <strong style={{ color: "var(--text-primary)" }}>{vyzva.miraSpolufinancovani ? `${vyzva.miraSpolufinancovani} %` : "—"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Dotace</span>
                <strong style={{ color: "var(--text-primary)" }}>{formatCastka(vyzva.minCastka)} – {formatCastka(vyzva.maxCastka)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Celková alokace</span>
                <strong style={{ color: "var(--text-primary)" }}>{formatCastka(vyzva.alokace)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
