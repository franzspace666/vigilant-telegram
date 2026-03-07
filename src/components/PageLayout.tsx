"use client";

import Link from "next/link";
import Sidebar from "./Sidebar";

export default function PageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "var(--sidebar-width)",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          className="animate-fade-in"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "rgba(246,245,241,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-light)",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 0" }}>
                {subtitle}
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)",
                minWidth: 240,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3.5 3.5" />
              </svg>
              <input
                type="text"
                placeholder="Hledat výzvy, programy..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  width: "100%",
                }}
              />
              <kbd
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  background: "var(--bg-base)",
                  padding: "2px 6px",
                  borderRadius: 4,
                  border: "1px solid var(--border-light)",
                  fontFamily: "var(--font-body)",
                }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Notification bell */}
            <Link
              href="/notifikace"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid var(--border-light)",
                background: "var(--bg-surface)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                position: "relative",
                transition: "border-color 0.15s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.73 13a2 2 0 01-1.73 1H6a2 2 0 01-1.73-1M7 15a2 2 0 003.9 0M14 8A5 5 0 004 8c0 4-1.5 5-1.5 5h13S14 12 14 8z" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent-rose)",
                  border: "2px solid var(--bg-surface)",
                }}
              />
            </Link>
          </div>
        </header>

        <main style={{ padding: "24px 32px 48px" }}>{children}</main>
      </div>
    </div>
  );
}
