/**
 * app/page.tsx — Landing Page
 * Modern SaaS Hero with quick input, trust indicators, and feature cards.
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MessageSquare, Target, BarChart3, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <MessageSquare size={24} className="text-emerald-600" />,
    title: "AI Chat Assistant",
    description: "Instant clarity on add-ons, IDV, and NCB without reading 50-page PDFs.",
    href: "/chat",
    bg: "bg-emerald-100",
  },
  {
    icon: <Target size={24} className="text-teal-600" />,
    title: "Smart Matching",
    description: "Tell us your car and budget. We'll automatically filter the top 3 best policies.",
    href: "/recommend",
    bg: "bg-teal-100",
  },
  {
    icon: <BarChart3 size={24} className="text-teal-600" />,
    title: "Side-by-Side Compare",
    description: "Visually highlight the differences in coverage and claim settlement ratios.",
    href: "/compare",
    bg: "bg-teal-100",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-emerald-50/80 via-white to-white pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-200/40 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/30 blur-[120px] pointer-events-none -z-10" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200 shadow-sm animate-fade-in">
          <Zap size={16} className="text-emerald-500 fill-emerald-500" />
          <span>Phase 2 Live — AI Upgrades Coming Next</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl animate-fade-up">
          Understand Car Insurance, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            The Smart Way.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: '100ms' }}>
          Stop guessing with complex legal jargon. Use AI to simply understand, compare, and get perfect coverage recommendations for your car.
        </p>

        {/* Floating Search / Action Box */}
        <div className="w-full max-w-2xl bg-white p-2.5 rounded-2xl shadow-xl shadow-emerald-100 border border-slate-200 flex flex-col sm:flex-row items-center gap-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSearch} className="flex-1 w-full flex items-center">
            <MessageSquare className="w-5 h-5 text-slate-400 ml-3 mr-2" />
            <Input 
              type="text"
              placeholder="E.g. What does Zero Depreciation actually cover?"
              className="border-0 shadow-none focus-visible:ring-0 text-base h-12 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="lg" className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 h-12 px-6 rounded-xl font-semibold">
              Ask AI
            </Button>
          </form>
        </div>
        <Button onClick={handleSearch} size="lg" className="w-full max-w-2xl mt-3 sm:hidden bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-semibold animate-fade-up" style={{ animationDelay: '200ms' }}>
          Ask AI
        </Button>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-slate-200 w-full max-w-3xl flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <ShieldCheck size={20} className="text-emerald-600" />
            IRDAI Compliant Data
          </div>
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Target size={20} className="text-teal-600" />
            98% Accuracy
          </div>
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Zap size={20} className="text-amber-500" />
            Real-time Comparisons
          </div>
        </div>
      </section>

      {/* ── Feature Cards ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white rounded-[3rem] shadow-sm border border-slate-100 mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Everything you need for the right policy.
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Three powerful tools working together to guide your insurance decisions from research to purchase.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <Link key={i} href={feature.href} className="group">
              <Card className="h-full border-slate-100 bg-slate-50/50 hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-900">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-6">{feature.description}</p>
                  <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                    Try it now <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
