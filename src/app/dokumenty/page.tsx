"use client";

import { useState, useMemo, useEffect } from "react";
import PageLayout from "@/components/PageLayout";

interface Dokument {
  id: string;
  nazev: string;
  zdroj: string;
  zdrojUrl: string;
  popis: string | null;
  createdAt: string;
  updatedAt: string;
}

const ZDROJ_LABELS: Record<string, string> = {
  MZE: "MZe / eAGRI",
  SZIF: "SZIF",
  SZIF_MAS: "SZIF MAS",
  SFZP: "SFŽP",
  OPZP: "OPŽP",
  AOPK: "AOPK",
  MAS_KRKONOSE: "MAS Krkonoše",
  MMR_CESTOVNI_RUCH: "MMR",
  CRR: "CRR",
  DOTACE_EU: "Dotace EU",
  CINEA: "CINEA",
  NPZP: "NPZP",
};

export default function DokumentyPage() {
  const [dokumenty, setDokumenty] = useState<Dokument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zdroj, setZdroj] = useState("");

  useEffect(() => {
    fetch("/api/dokumenty?limit=500")
      .then((r) => r.json())
      .then((data) => {
        setDokumenty(data.dokumenty || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const zdrojOptions = useMemo(
    () => [...new Set(dokumenty.map((d) => d.zdroj))].sort(),
    [dokumenty]
  );

  const filtered = useMemo(() => {
    let result = [...dokumenty];
    if (zdroj) result = result.filter((d) => d.zdroj === zdroj);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.nazev.toLowerCase().includes(q) ||
          (d.popis ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [dokumenty, zdroj, search]);

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border-light)",
    background: "var(--bg-surface)",
    fontSize: 13,
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    outline: "none",
    minWidth: 200,
  };

  return (
    <PageLayout
      title="Dokumenty a příručky"
      subtitle={
        loading
          ? "Načítám..."
          : `${filtered.length} dokumentů (příručky, zásady, informace pro žadatele)`
      }
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
        <input
          type="search"
          placeholder="Hledat v dokumentech..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, minWidth: 260 }}
        />
        <select
          aria-label="Filtr zdroje"
          value={zdroj}
          onChange={(e) => setZdroj(e.target.value)}
          style={inputStyle}
        >
          <option value="">Všechny zdroje</option>
          {zdrojOptions.map((z) => (
            <option key={z} value={z}>
              {ZDROJ_LABELS[z] ?? z}
            </option>
          ))}
        </select>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Dokumenty nejsou výzvy k podání – jsou to příručky, zásady a informace pro žadatele.
        </span>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-muted)",
            fontSize: 15,
          }}
        >
          Načítám dokumenty...
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((d, i) => (
              <a
                key={d.id}
                href={d.zdrojUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.02}s`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "var(--bg-surface)",
                  borderRadius: 10,
                  border: "1px solid var(--border-light)",
                  padding: "12px 18px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}
              >
                {/* Ikona dokumentu */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      marginBottom: 2,
                    }}
                  >
                    {d.nazev}
                  </div>
                  {d.popis && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.popis}
                    </div>
                  )}
                </div>

                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--accent-blue)",
                    background: "var(--accent-blue-light)",
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {ZDROJ_LABELS[d.zdroj] ?? d.zdroj}
                </span>

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-muted)",
                fontSize: 15,
              }}
            >
              Žádné dokumenty nenalezeny.
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
