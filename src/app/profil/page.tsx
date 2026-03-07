"use client";

import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";

const pravniFormy = [
  "Fyzická osoba", "OSVČ", "s.r.o.", "a.s.", "družstvo", "spolek", "obec", "příspěvková organizace",
];

const kraje = [
  "Královéhradecký", "Liberecký", "Pardubický", "Středočeský", "Ústecký",
  "Moravskoslezský", "Jihočeský", "Plzeňský", "Karlovarský", "Vysočina",
  "Jihomoravský", "Zlínský", "Olomoucký", "Hlavní město Praha",
];

function normalizeKraj(aresKraj: string): string {
  // ARES vrací "Královéhradecký kraj", "Kraj Vysočina", "Hlavní město Praha" apod.
  const normalized = aresKraj
    .replace(/\s*kraj$/i, "")
    .replace(/^Kraj\s+/i, "")
    .trim();
  if (kraje.includes(normalized)) return normalized;
  const match = kraje.find((k) => aresKraj.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(normalized.toLowerCase()));
  return match || normalized;
}

function mapPravniForma(kod: string): string {
  const kodNum = parseInt(kod, 10);
  if (isNaN(kodNum)) return "";
  if (kodNum >= 100 && kodNum <= 108) return "Fyzická osoba";
  if (kodNum >= 111 && kodNum <= 117) return "OSVČ";
  if (kodNum === 121 || kodNum === 122) return "s.r.o.";
  if (kodNum === 131) return "a.s.";
  if (kodNum === 141) return "obec";
  if (kodNum === 145 || kodNum === 205) return "družstvo";
  if (kodNum === 301 || (kodNum >= 325 && kodNum <= 355)) return "příspěvková organizace";
  if (kodNum === 706 || kodNum === 751) return "spolek";
  if (kodNum >= 801 && kodNum <= 811) return "obec";
  return "";
}

const specifickeOblasti = ["KRNAP", "Horská oblast", "LFA – méně příznivé oblasti", "Natura 2000", "CHKO"];

const sektory = [
  "Zemědělství", "Zpracování produkce", "Lokální potraviny", "Regionální produkt",
  "Energetika", "Bioplyn", "Cestovní ruch", "Ubytování",
];

const velikosti = ["Mikropodnik (do 10 zaměstnanců)", "Malý podnik (do 50)", "Střední podnik (do 250)", "Velký podnik (250+)"];

interface ProfilData {
  nazev: string;
  ico: string;
  pravniForma: string;
  kraj: string;
  okres: string;
  specifickaOblast: string[];
  sektory: string[];
  klicovaSlova: string[];
  velikost: string;
}

const defaultProfil: ProfilData = {
  nazev: "", ico: "", pravniForma: "", kraj: "", okres: "",
  specifickaOblast: [], sektory: [], klicovaSlova: [], velikost: "",
};

export default function ProfilPage() {
  const [profil, setProfil] = useState<ProfilData>(defaultProfil);
  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aresLoading, setAresLoading] = useState(false);
  const [aresError, setAresError] = useState("");

  useEffect(() => {
    fetch("/api/zadatel/default-zadatel")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setProfil({
            nazev: data.nazev || "",
            ico: data.ico || "",
            pravniForma: data.pravniForma || "",
            kraj: data.kraj || "",
            okres: data.okres || "",
            specifickaOblast: data.specifickaOblast || [],
            sektory: data.sektory || [],
            klicovaSlova: data.klicovaSlova || [],
            velikost: data.velikost || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    await fetch("/api/zadatel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "default-zadatel",
        nazev: profil.nazev,
        ico: profil.ico,
        pravniForma: profil.pravniForma,
        kraj: profil.kraj,
        okres: profil.okres,
        specifickaOblast: profil.specifickaOblast,
        sektory: profil.sektory,
        klicovaSlova: profil.klicovaSlova,
        velikost: profil.velikost,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleAresLookup() {
    const ico = profil.ico.trim();
    if (!/^\d{8}$/.test(ico)) {
      setAresError("IČO musí mít 8 číslic");
      return;
    }
    setAresLoading(true);
    setAresError("");
    try {
      const res = await fetch(`/api/ares/${ico}`);
      const data = await res.json();
      if (!res.ok) {
        setAresError(data.error || "Chyba při načítání z ARES");
        return;
      }
      setProfil((prev) => ({
        ...prev,
        nazev: data.obchodniJmeno || prev.nazev,
        pravniForma: mapPravniForma(String(data.pravniForma || "")) || prev.pravniForma,
        kraj: data.sidlo?.nazevKraje ? normalizeKraj(data.sidlo.nazevKraje) : prev.kraj,
        okres: data.sidlo?.nazevOkresu || data.sidlo?.nazevObce || prev.okres,
      }));
    } catch {
      setAresError("Nepodařilo se spojit s ARES");
    } finally {
      setAresLoading(false);
    }
  }

  function toggleArray(field: "sektory" | "specifickaOblast", value: string) {
    setProfil((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !profil.klicovaSlova.includes(trimmed)) {
      setProfil((prev) => ({ ...prev, klicovaSlova: [...prev.klicovaSlova, trimmed] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setProfil((prev) => ({ ...prev, klicovaSlova: prev.klicovaSlova.filter((t) => t !== tag) }));
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid var(--border-light)", background: "var(--bg-surface)",
    fontSize: 14, color: "var(--text-primary)", fontFamily: "var(--font-body)",
    outline: "none", transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block",
  };

  const sectionStyle: React.CSSProperties = {
    background: "var(--bg-surface)", borderRadius: 14, border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)", padding: "22px", marginBottom: 20,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600,
    color: "var(--text-primary)", margin: "0 0 18px", letterSpacing: "-0.01em",
  };

  if (loading) {
    return (
      <PageLayout title="Profil žadatele">
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>Načítám...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Profil žadatele" subtitle="Nastavte svůj profil pro lepší matching výzev">
      <div style={{ maxWidth: 720 }}>
        {/* Základní údaje */}
        <div className="animate-fade-in-up delay-1" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Základní údaje</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="nazev-subjektu" style={labelStyle}>Název subjektu</label>
              <input id="nazev-subjektu" type="text" value={profil.nazev} onChange={(e) => setProfil((p) => ({ ...p, nazev: e.target.value }))} placeholder="Farma pod Sněžkou s.r.o." style={inputStyle} />
            </div>
            <div>
              <label htmlFor="ico" style={labelStyle}>IČO</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input id="ico" type="text" value={profil.ico} onChange={(e) => setProfil((p) => ({ ...p, ico: e.target.value }))} placeholder="12345678" style={{ ...inputStyle, flex: 1 }} />
                <button
                  type="button"
                  onClick={handleAresLookup}
                  disabled={aresLoading}
                  style={{
                    padding: "10px 14px", borderRadius: 8, border: "1px solid var(--accent-blue)",
                    background: aresLoading ? "var(--bg-base)" : "var(--accent-blue-light)",
                    color: "var(--accent-blue)", fontSize: 13, fontWeight: 500, cursor: aresLoading ? "wait" : "pointer",
                    fontFamily: "var(--font-body)", whiteSpace: "nowrap", transition: "all 0.15s ease",
                  }}
                >
                  {aresLoading ? "Načítám..." : "Načíst z ARES"}
                </button>
              </div>
              {aresError && (
                <div style={{ fontSize: 12, color: "#e03131", marginTop: 6 }}>{aresError}</div>
              )}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="pravniForma" style={labelStyle}>Právní forma</label>
              <select id="pravniForma" value={profil.pravniForma} onChange={(e) => setProfil((p) => ({ ...p, pravniForma: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Vyberte právní formu...</option>
                {pravniFormy.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Lokace */}
        <div className="animate-fade-in-up delay-2" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Lokace</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor="kraj" style={labelStyle}>Kraj</label>
              <select id="kraj" value={profil.kraj} onChange={(e) => setProfil((p) => ({ ...p, kraj: e.target.value }))} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Vyberte kraj...</option>
                {kraje.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="okres" style={labelStyle}>Okres</label>
              <input id="okres" type="text" value={profil.okres} onChange={(e) => setProfil((p) => ({ ...p, okres: e.target.value }))} placeholder="Trutnov" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Specifická oblast</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {specifickeOblasti.map((o) => (
                <label
                  key={o}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
                    color: profil.specifickaOblast.includes(o) ? "var(--accent-blue)" : "var(--text-secondary)",
                    background: profil.specifickaOblast.includes(o) ? "var(--accent-blue-light)" : "var(--bg-base)",
                    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
                    border: `1px solid ${profil.specifickaOblast.includes(o) ? "var(--accent-blue)" : "var(--border-light)"}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  <input type="checkbox" checked={profil.specifickaOblast.includes(o)} onChange={() => toggleArray("specifickaOblast", o)} style={{ display: "none" }} />
                  {profil.specifickaOblast.includes(o) ? "✓" : ""} {o}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sektory zájmu */}
        <div className="animate-fade-in-up delay-3" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Sektory zájmu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {sektory.map((s) => (
              <label
                key={s}
                style={{
                  display: "flex", alignItems: "center", gap: 10, fontSize: 14,
                  color: "var(--text-primary)", padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                  background: profil.sektory.includes(s) ? "var(--accent-blue-light)" : "transparent",
                  border: `1px solid ${profil.sektory.includes(s) ? "var(--accent-blue)" : "var(--border-light)"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 20, height: 20, borderRadius: 4,
                    border: `2px solid ${profil.sektory.includes(s) ? "var(--accent-blue)" : "var(--border-medium)"}`,
                    background: profil.sektory.includes(s) ? "var(--accent-blue)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 12, flexShrink: 0, transition: "all 0.15s ease",
                  }}
                >
                  {profil.sektory.includes(s) && "✓"}
                </div>
                <input type="checkbox" checked={profil.sektory.includes(s)} onChange={() => toggleArray("sektory", s)} style={{ display: "none" }} />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Klíčová slova */}
        <div className="animate-fade-in-up delay-4" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Klíčová slova</h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Zadejte klíčové slovo a stiskněte Enter..." style={{ ...inputStyle, flex: 1 }}
            />
            <button type="button" onClick={addTag} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid var(--border-light)", background: "var(--bg-surface)", color: "var(--accent-blue)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              Přidat
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {profil.klicovaSlova.map((tag) => (
              <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "var(--accent-blue)", background: "var(--accent-blue-light)", padding: "4px 10px", borderRadius: 6 }}>
                {tag}
                <button type="button" aria-label={`Odebrat ${tag}`} onClick={() => removeTag(tag)} style={{ background: "none", border: "none", color: "var(--accent-blue)", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1, opacity: 0.6 }}>✕</button>
              </span>
            ))}
            {profil.klicovaSlova.length === 0 && (
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Zatím žádná klíčová slova. Přidejte např.: agroturistika, sýry, horský hotel...</span>
            )}
          </div>
        </div>

        {/* Velikost podniku */}
        <div className="animate-fade-in-up delay-5" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Velikost podniku</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {velikosti.map((v) => (
              <label
                key={v}
                style={{
                  display: "flex", alignItems: "center", gap: 10, fontSize: 14,
                  color: "var(--text-primary)", padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                  background: profil.velikost === v ? "var(--accent-blue-light)" : "transparent",
                  border: `1px solid ${profil.velikost === v ? "var(--accent-blue)" : "var(--border-light)"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${profil.velikost === v ? "var(--accent-blue)" : "var(--border-medium)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                >
                  {profil.velikost === v && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-blue)" }} />}
                </div>
                <input type="radio" name="velikost" checked={profil.velikost === v} onChange={() => setProfil((p) => ({ ...p, velikost: v }))} style={{ display: "none" }} />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="animate-fade-in-up delay-6">
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 32px",
              borderRadius: 10, border: "none",
              background: saved ? "var(--accent-emerald)" : "var(--accent-blue)",
              color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-body)", transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(59,91,219,0.3)",
            }}
          >
            {saved ? "✓ Profil uložen" : "Uložit profil"}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
