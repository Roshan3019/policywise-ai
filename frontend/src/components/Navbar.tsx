"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recommend", label: "Recommend" },
  { href: "/compare", label: "Compare" },
  { href: "/chat", label: "AI Chat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <ShieldAlert size={18} strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-slate-900">
            Policy<span className="text-emerald-600">Wise</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/recommend">
            <Button className="font-medium bg-emerald-600 hover:bg-emerald-700">
              Get Recommended →
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
