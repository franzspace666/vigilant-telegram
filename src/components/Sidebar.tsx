"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  {
    label: "Přehled",
    href: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="7" height="8" rx="1.5" />
        <rect x="11" y="2" width="7" height="5" rx="1.5" />
        <rect x="2" y="12" width="7" height="6" rx="1.5" />
        <rect x="11" y="9" width="7" height="9" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Výzvy",
    href: "/vyzvy",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12M4 8h12M4 12h8M4 16h6" />
        <circle cx="16" cy="14" r="3" />
        <path d="M18 16l1.5 1.5" />
      </svg>
    ),
    badge: "12",
  },
  {
    label: "Uložené",
    href: "/ulozene",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3h10a2 2 0 012 2v12l-7-4-7 4V5a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    label: "Profil žadatele",
    href: "/profil",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="7" r="4" />
        <path d="M3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" />
      </svg>
    ),
  },
];

const bottomItems = [
  {
    label: "Nastavení",
    href: "/nastaveni",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    label: "Notifikace",
    href: "/notifikace",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a6 6 0 016 6c0 3.09.78 5.18 1.5 6.5H2.5C3.22 13.18 4 11.09 4 8a6 6 0 016-6z" />
        <path d="M8 16.5a2.5 2.5 0 005 0" />
      </svg>
    ),
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function getInitials(name: string): string {
  if (!name) return "Ž";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Sidebar() {
  const pathname = usePathname();
  const [zadatelName, setZadatelName] = useState("");

  useEffect(() => {
    fetch("/api/zadatel/default-zadatel")
      .then((r) => r.json())
      .then((data) => {
        if (data?.nazev) setZadatelName(data.nazev);
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <aside
      className="animate-slide-in-left"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(59,91,219,0.06) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #3b5bdb, #5c7cfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(59,91,219,0.3)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L3 6v8l7 4 7-4V6l-7-4z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M10 10v8M3 6l7 4 7-4" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text-sidebar-active)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Dotační
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 700,
              color: "#5c7cfa",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            hlídač
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "8px 12px", position: "relative" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "rgba(148,163,184,0.5)",
            padding: "8px 12px 12px",
          }}
        >
          Menu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item, i) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="animate-fade-in"
                style={{
                  animationDelay: `${i * 0.05 + 0.1}s`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: active ? 500 : 400,
                  fontFamily: "var(--font-body)",
                  color: active ? "var(--text-sidebar-active)" : "var(--text-sidebar)",
                  background: active ? "var(--bg-sidebar-active)" : "transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--bg-sidebar-hover)";
                    e.currentTarget.style.color = "var(--text-sidebar-active)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-sidebar)";
                  }
                }}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      fontWeight: 600,
                      background: "rgba(59,91,219,0.2)",
                      color: "#7b9cff",
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "12px", position: "relative", borderTop: "1px solid rgba(148,163,184,0.1)" }}>
        {bottomItems.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                textDecoration: "none",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                fontFamily: "var(--font-body)",
                color: active ? "var(--text-sidebar-active)" : "var(--text-sidebar)",
                background: active ? "var(--bg-sidebar-active)" : "transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "var(--bg-sidebar-hover)";
                  e.currentTarget.style.color = "var(--text-sidebar-active)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-sidebar)";
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {/* User profile */}
        <Link
          href="/profil"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px",
            marginTop: 4,
            borderRadius: 8,
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-sidebar-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "white",
            }}
          >
            {getInitials(zadatelName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-sidebar-active)", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {zadatelName || "Žadatel"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-sidebar)", lineHeight: 1.3 }}>
              Administrátor
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
