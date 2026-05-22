"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SparklesCore } from "@/components/ui/sparkles";
import { MessageSquare, Target, BarChart3, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: <MessageSquare size={24} className="text-indigo-400" />,
    title: "AI Chat Assistant",
    description: "Instant clarity on add-ons, IDV, and NCB without reading 50-page PDFs.",
    href: "/chat",
  },
  {
    icon: <Target size={24} className="text-sky-400" />,
    title: "Smart Matching",
    description: "Tell us your car and budget. We'll automatically filter the top 3 best policies.",
    href: "/recommend",
  },
  {
    icon: <BarChart3 size={24} className="text-indigo-400" />,
    title: "Side-by-Side Compare",
    description: "Visually highlight the differences in coverage and claim settlement ratios.",
    href: "/compare",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* SparklesCore background */}
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.9}
          particleDensity={isMobile ? 80 : 180}
          particleColor="#FFFFFF"
          speed={1.2}
          className="w-full h-full absolute inset-0"
        />

        {/* Radial gradient mask at bottom */}
        <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_top,transparent_60%,black)] pointer-events-none" />

        {/* Gradient line decorations */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-60">
          <div className="w-[40rem] h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={13} className="fill-indigo-400" />
            India&apos;s Smartest Car Insurance Advisor
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              PolicyWise AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mb-10">
            Stop guessing. AI-powered car insurance analysis so you can{" "}
            <span className="text-white font-semibold">understand, compare, and choose</span> the right coverage in minutes.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl glass rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-indigo-500/10"
          >
            <MessageSquare className="w-5 h-5 text-neutral-500 ml-3 shrink-0" />
            <Input
              type="text"
              placeholder="E.g. What does Zero Depreciation actually cover?"
              className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-12 text-white placeholder:text-neutral-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm rounded-xl px-5 h-11 font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              Ask AI
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10 opacity-50 hover:opacity-80 transition-opacity">
            {[
              { icon: <ShieldCheck size={16} />, label: "IRDAI Compliant" },
              { icon: <Target size={16} />, label: "98% Accuracy" },
              { icon: <Zap size={16} />, label: "Real-time Data" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-sm font-medium text-neutral-300">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need for the <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">right policy</span>
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-lg">
            Three powerful tools working together to guide your insurance decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Link key={i} href={feature.href} className="group">
              <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">{feature.description}</p>
                <div className="flex items-center text-indigo-400 text-sm font-semibold group-hover:text-sky-400 transition-colors">
                  Try it now <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-10 text-center text-neutral-600 text-sm">
        <p>© 2026 PolicyWise AI · Built for India · Not affiliated with any insurer</p>
      </footer>
    </main>
  );
}
