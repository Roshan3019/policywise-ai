"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Recommend" },
  { href: "/compare", label: "Compare" },
  { href: "/chat", label: "AI Chat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(8,12,24,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      <div
        className="container-main"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "var(--grad-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 800,
              color: "white",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            P
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Policy<span className="gradient-text">Wise</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "white" : "var(--text-muted)",
                  background: isActive
                    ? "var(--glass-hover)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(99,102,241,0.3)"
                    : "1px solid transparent",
                  transition: "all var(--duration-fast) var(--ease-smooth)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link href="/recommend" className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
          Get Recommendation →
        </Link>
      </div>
    </nav>
  );
}
