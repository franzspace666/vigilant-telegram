"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";

const DEFAULT_ZADATEL_ID = "default-zadatel";
const API_ENDPOINTS = {
  nastaveni: "/api/nastaveni",
  nastaveniDetail: "/api/nastaveni/default-zadatel",
  zadatel: "/api/zadatel",
  zadatelDetail: "/api/zadatel/default-zadatel",
} as const;

const zdrojeKeSledovani = [
  "SZIF", "eAGRI", "SFŽP", "OPŽP", "AOPK", "MAS Krkonoše",
  "MAS Přijďte pobejt", "KRNAP", "Královéhradecký kraj", "MPO", "MMR",
] as const;

const FREKVENCE_OPTIONS = [
  { value: "okamzite", label: "Okamžitě", desc: "Notifikace ihned po publikování nové výzvy" },
  { value: "denne", label: "Denně", desc: "Denní souhrn nových výzev každé ráno v 8:00" },
  { value: "tydne", label: "Týdně", desc: "Týdenní přehled každé pondělí" },
] as const;

interface NastaveniData {
  emailNotifikace: boolean;
  email: string;
  smsNotifikace: boolean;
  telefon: string;
  pushNotifikace: boolean;
  frekvence: string;
  minRelevance: number;
  dniPredDeadline: number;
  sledovaneZdroje: string[];
}

const defaultNastaveni: NastaveniData = {
  emailNotifikace: true,
  email: "",
  smsNotifikace: false,
  telefon: "",
  pushNotifikace: true,
  frekvence: "denne",
  minRelevance: 60,
  dniPredDeadline: 14,
  sledovaneZdroje: ["SZIF", "eAGRI", "SFŽP", "AOPK", "MAS Krkonoše"],
};

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: "none",
        background: checked ? "var(--accent-blue)" : "var(--border-medium)",
        cursor: "pointer", position: "relative", transition: "background 0.2s ease", flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "white",
        position: "absolute", top: 3, left: checked ? 23 : 3,
        transition: "left 0.2s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

export default function NastaveniPage() {
  const [data, setData] = useState<NastaveniData>(defaultNastaveni);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function bootstrap() {
      try {
        const [nastaveniResponse, zadatelResponse] = await Promise.all([
          fetch(API_ENDPOINTS.nastaveniDetail, { signal: abortController.signal }),
          fetch(API_ENDPOINTS.zadatelDetail, { signal: abortController.signal }),
        ]);

        if (!nastaveniResponse.ok || !zadatelResponse.ok) {
          throw new Error("Nepodařilo se načíst nastavení");
        }

        const [nastaveni, zadatel] = await Promise.all([
          nastaveniResponse.json(),
          zadatelResponse.json(),
        ]);

        // Use nastaveni from zadatel relation as fallback
        const settings = nastaveni ?? zadatel?.nastaveni;

        setData({
          emailNotifikace: settings?.emailNotifikace ?? defaultNastaveni.emailNotifikace,
          email: zadatel?.email ?? defaultNastaveni.email,
          smsNotifikace: settings?.smsNotifikace ?? defaultNastaveni.smsNotifikace,
          telefon: zadatel?.telefon ?? defaultNastaveni.telefon,
          pushNotifikace: settings?.pushNotifikace ?? defaultNastaveni.pushNotifikace,
          frekvence: settings?.frekvence ?? defaultNastaveni.frekvence,
          minRelevance: settings?.minRelevance ?? defaultNastaveni.minRelevance,
          dniPredDeadline: settings?.dniPredDeadline ?? defaultNastaveni.dniPredDeadline,
          sledovaneZdroje: settings?.sledovaneZdroje ?? defaultNastaveni.sledovaneZdroje,
        });
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Nepodařilo se načíst data. Zkuste to prosím znovu.");
      } finally {
        setLoading(false);
      }
    }

    bootstrap();

    return () => abortController.abort();
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await Promise.all([
        fetch(API_ENDPOINTS.nastaveni, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zadatelId: DEFAULT_ZADATEL_ID,
            emailNotifikace: data.emailNotifikace,
            smsNotifikace: data.smsNotifikace,
            pushNotifikace: data.pushNotifikace,
            frekvence: data.frekvence,
            minRelevance: data.minRelevance,
            dniPredDeadline: data.dniPredDeadline,
            sledovaneZdroje: data.sledovaneZdroje,
          }),
        }),
        fetch(API_ENDPOINTS.zadatel, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: DEFAULT_ZADATEL_ID,
            email: data.email,
            telefon: data.telefon,
          }),
        }),
      ]);
      setSaved(true);
      setError(null);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Uložení se nezdařilo. Zkuste to prosím znovu.");
    }
  }, [data]);

  const toggleZdroj = useCallback((z: string) => {
    setData((prev) => ({
      ...prev,
      sledovaneZdroje: prev.sledovaneZdroje.includes(z)
        ? prev.sledovaneZdroje.filter((s) => s !== z)
        : [...prev.sledovaneZdroje, z],
    }));
  }, []);

  const selectedSources = useMemo(() => new Set(data.sledovaneZdroje), [data.sledovaneZdroje]);

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border-light)",
    background: "var(--bg-surface)", fontSize: 14, color: "var(--text-primary)",
    fontFamily: "var(--font-body)", outline: "none", width: "100%", maxWidth: 320,
  };

  const sectionStyle: React.CSSProperties = {
    background: "var(--bg-surface)", borderRadius: 14, border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-sm)", padding: "22px", marginBottom: 20,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600,
    color: "var(--text-primary)", margin: "0 0 18px", letterSpacing: "-0.01em",
  };

  const renderStatus = () => {
    if (loading) {
      return <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>Načítám...</div>;
    }
    if (error) {
      return (
        <div role="alert" style={{ textAlign: "center", padding: "24px", color: "var(--accent-red)", background: "var(--bg-elevated)", borderRadius: 8 }}>
          {error}
        </div>
      );
    }
    return null;
  };

  if (loading || error) {
    return (
      <PageLayout title="Nastavení">
        {renderStatus()}
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Nastavení" subtitle="Konfigurace notifikací a sledování">
      <div style={{ maxWidth: 720 }}>
        {error && (
          <div role="alert" style={{ marginBottom: 16, color: "var(--accent-red)", fontWeight: 600 }}>{error}</div>
        )}
        {/* Kanály notifikací */}
        <div className="animate-fade-in-up delay-1" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Kanály notifikací</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <Toggle label="E-mailové notifikace" checked={data.emailNotifikace} onChange={(v) => setData((d) => ({ ...d, emailNotifikace: v }))} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>E-mailové notifikace</div>
                {data.emailNotifikace && (
                  <input type="email" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} placeholder="vas@email.cz" style={inputStyle} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <Toggle label="SMS notifikace" checked={data.smsNotifikace} onChange={(v) => setData((d) => ({ ...d, smsNotifikace: v }))} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginBottom: 6 }}>SMS notifikace</div>
                {data.smsNotifikace && (
                  <input type="tel" value={data.telefon} onChange={(e) => setData((d) => ({ ...d, telefon: e.target.value }))} placeholder="+420 777 123 456" style={inputStyle} />
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <Toggle label="Push notifikace" checked={data.pushNotifikace} onChange={(v) => setData((d) => ({ ...d, pushNotifikace: v }))} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Push notifikace v prohlížeči</div>
              </div>
            </div>
          </div>
        </div>

        {/* Frekvence */}
        <div className="animate-fade-in-up delay-2" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Frekvence notifikací</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FREKVENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 8, cursor: "pointer",
                  background: data.frekvence === opt.value ? "var(--accent-blue-light)" : "transparent",
                  border: `1px solid ${data.frekvence === opt.value ? "var(--accent-blue)" : "var(--border-light)"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${data.frekvence === opt.value ? "var(--accent-blue)" : "var(--border-medium)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {data.frekvence === opt.value && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent-blue)" }} />}
                </div>
                <input type="radio" name="frekvence" checked={data.frekvence === opt.value} onChange={() => setData((d) => ({ ...d, frekvence: opt.value }))} style={{ display: "none" }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Filtry */}
        <div className="animate-fade-in-up delay-3" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Filtry notifikací</h2>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label htmlFor="minRelevance" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Minimální relevance</label>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-blue)" }}>{data.minRelevance}%</span>
            </div>
            <input id="minRelevance" type="range" min={0} max={100} step={5} value={data.minRelevance} onChange={(e) => setData((d) => ({ ...d, minRelevance: Number(e.target.value) }))} style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
          <div>
            <label htmlFor="dniPredDeadline" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Upozornit X dní před deadlinem</label>
            <input id="dniPredDeadline" type="number" min={1} max={90} value={data.dniPredDeadline} onChange={(e) => setData((d) => ({ ...d, dniPredDeadline: Number(e.target.value) }))} style={{ ...inputStyle, maxWidth: 120 }} />
          </div>
        </div>

        {/* Sledované zdroje */}
        <div className="animate-fade-in-up delay-4" style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Zdroje ke sledování</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {zdrojeKeSledovani.map((z) => (
              <label
                key={z}
                style={{
                  display: "flex", alignItems: "center", gap: 10, fontSize: 14,
                  color: "var(--text-primary)", padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                  background: selectedSources.has(z) ? "var(--accent-blue-light)" : "transparent",
                  border: `1px solid ${selectedSources.has(z) ? "var(--accent-blue)" : "var(--border-light)"}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 4,
                  border: `2px solid ${selectedSources.has(z) ? "var(--accent-blue)" : "var(--border-medium)"}`,
                  background: selectedSources.has(z) ? "var(--accent-blue)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: 12, flexShrink: 0, transition: "all 0.15s ease",
                }}>
                  {selectedSources.has(z) && "✓"}
                </div>
                <input type="checkbox" checked={selectedSources.has(z)} onChange={() => toggleZdroj(z)} style={{ display: "none" }} />
                {z}
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="animate-fade-in-up delay-5">
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
            aria-live="polite"
            >
            {saved ? "✓ Nastavení uloženo" : "Uložit nastavení"}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
