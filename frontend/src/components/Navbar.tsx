"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/",          label: "Home" },
  { href: "/chat",      label: "AI Assistant" },
  { href: "/compare",   label: "Compare" },
  { href: "/recommend", label: "Recommend" },
  { href: "/explore",   label: "Dictionary" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <ShieldAlert size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Policy<span className="text-indigo-400">Wise</span> AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-sm text-neutral-400">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-white transition-colors font-medium ${pathname === link.href ? "text-white" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/recommend"
              className="hidden sm:inline-flex bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm rounded-full px-4 py-2 font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
            >
              Get Started
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            >
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col pt-20 px-6" onClick={() => setMobileOpen(false)}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xl font-semibold text-neutral-200 hover:text-white py-2 border-b border-white/10 transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/recommend" className="mt-4 text-center bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-full py-3 font-bold text-lg hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
