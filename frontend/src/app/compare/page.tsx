"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { getPolicies } from "@/lib/api";
import type { Policy, PolicyType } from "@/lib/types";
import { SparklesCore } from "@/components/ui/sparkles";
import { Check, X, Loader2, ArrowLeftRight, ArrowLeft, Medal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ComparePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Policy[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [policyType, setPolicyType] = useState<PolicyType | "">("");

  const fetchPolicies = async () => {
    setIsLoading(true); setError("");
    try { setPolicies(await getPolicies({ policy_type: policyType || undefined })); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPolicies(); }, [policyType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (p: Policy) =>
    setSelected((prev) => {
      const exists = prev.find((x) => x.id === p.id);
      if (exists) return prev.filter((x) => x.id !== p.id);
      if (prev.length >= 3) return [...prev.slice(1), p];
      return [...prev, p];
    });

  if (showComparison && selected.length >= 2)
    return <ComparisonDashboard policies={selected} onBack={() => setShowComparison(false)} />;

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Very low density sparkles */}
      <SparklesCore background="transparent" minSize={0.3} maxSize={0.8} particleDensity={30} particleColor="#FFFFFF" speed={0.5} className="fixed inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
              <ArrowLeftRight size={14} /> Policy Browser
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">Compare Policies</span>
            </h1>
            <p className="text-neutral-400 mt-2 text-lg">Select up to 3 policies for a side-by-side analysis.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-500">{selected.length} / 3 selected</span>
            <button
              onClick={() => setShowComparison(true)}
              disabled={selected.length < 2}
              className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold text-sm rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Compare Now
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="glass rounded-2xl p-3 mb-8 inline-flex">
          <Select value={policyType} onValueChange={(v) => setPolicyType(v as PolicyType | "")}>
            <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-0 text-neutral-300 font-medium w-48">
              <SelectValue placeholder="All Coverage Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white">
              <SelectItem value="null">All Coverage Types</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="third_party">Third Party</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-neutral-500">
            <Loader2 className="animate-spin w-8 h-8 mb-4 text-indigo-400" />
            <p>Loading policies...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 text-center text-red-400">{error}</div>
        ) : policies.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center text-neutral-500">No policies found. Adjust your filters.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {policies.map((p) => (
              <PolicyCard key={p.id} policy={p} onSelect={handleSelect} isSelected={!!selected.find((x) => x.id === p.id)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ComparisonDashboard({ policies, onBack }: { policies: Policy[]; onBack: () => void }) {
  const bestPolicy = [...policies].sort((a, b) => (b.claim_settlement_ratio ?? 0) - (a.claim_settlement_ratio ?? 0))[0];

  const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-x-auto">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Back to Selection
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Comparison</h1>
        </div>

        <div className="min-w-[700px]">
          {/* Column headers */}
          <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}>
            <div className="flex items-end pb-4">
              <p className="text-sm font-semibold text-neutral-500">Specification</p>
            </div>
            {policies.map((p) => {
              const isBest = p.id === bestPolicy.id;
              return (
                <div key={`hdr-${p.id}`} className={`glass rounded-2xl p-5 relative ${isBest ? "border-indigo-500/50 bg-indigo-500/5" : ""}`}>
                  {isBest && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Medal size={11} /> Best Choice
                    </div>
                  )}
                  <p className="font-bold text-white text-base leading-tight mb-1">{p.name}</p>
                  <p className="text-xs text-neutral-400 mb-4 font-medium">{p.insurer_name}</p>
                  <button className={`w-full text-xs font-bold rounded-full py-2 ${isBest ? "bg-gradient-to-r from-indigo-500 to-sky-500" : "bg-white/10 hover:bg-white/15"} transition-all`}>Choose</button>
                </div>
              );
            })}
          </div>

          {/* Comparison rows */}
          {[
            { label: "Coverage Type", fn: (p: Policy) => p.policy_type.replace("_", " ").toUpperCase() },
            { label: "Premium Range", fn: (p: Policy) => `${fmt(p.premium_min)} – ${fmt(p.premium_max)}` },
            { label: "Coverage (IDV)", fn: (p: Policy) => fmt(p.coverage_amount) },
            { label: "Claim Settlement", fn: (p: Policy) => `${p.claim_settlement_ratio ?? "—"}%` },
          ].map((row) => (
            <div key={row.label} className="grid gap-4 py-3 border-b border-white/5" style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}>
              <div className="text-sm font-semibold text-neutral-500 flex items-center">{row.label}</div>
              {policies.map((p) => <div key={`${row.label}-${p.id}`} className="text-sm text-white font-medium flex items-center">{row.fn(p)}</div>)}
            </div>
          ))}

          {/* Add-ons: Zero Dep, Engine, RSA */}
          {["Zero Depreciation", "Engine Protection", "Roadside Assistance"].map((addon) => (
            <div key={addon} className="grid gap-4 py-3 border-b border-white/5" style={{ gridTemplateColumns: `200px repeat(${policies.length}, 1fr)` }}>
              <div className="text-sm font-semibold text-neutral-500 flex items-center">{addon}</div>
              {policies.map((p) => {
                const has = p.add_ons?.includes(addon) ?? false;
                return (
                  <div key={`${addon}-${p.id}`} className="flex items-center">
                    {has
                      ? <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center"><Check size={12} strokeWidth={3} /></div>
                      : <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-neutral-600 flex items-center justify-center"><X size={12} strokeWidth={3} /></div>
                    }
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
