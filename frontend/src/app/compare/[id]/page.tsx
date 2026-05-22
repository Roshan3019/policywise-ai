"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPolicy } from "@/lib/api";
import type { Policy } from "@/lib/types";
import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, Building2, Wallet, Target } from "lucide-react";

function fmt(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(idParam);

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try { setPolicy(await getPolicy(id)); }
      catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed to load policy."); }
      finally { setIsLoading(false); }
    };
    if (id) load();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-neutral-400">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="font-medium text-sm">Loading policy details...</p>
        </div>
      </main>
    );
  }

  if (error || !policy) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="glass rounded-3xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Policy Not Found</h2>
          <p className="text-neutral-400 mb-8">{error}</p>
          <button onClick={() => router.push("/compare")} className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity w-full">
            Back to Compare
          </button>
        </div>
      </main>
    );
  }

  const ratio = policy.claim_settlement_ratio ?? 0;

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Hero card */}
        <div className="glass rounded-3xl p-8 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full mb-5">
                {policy.policy_type.replace("_", " ")}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                {policy.name}
              </h1>
              <div className="flex items-center gap-2 text-neutral-400 font-medium text-lg">
                <Building2 size={18} className="text-neutral-600" />
                {policy.insurer_name}
              </div>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center shrink-0 min-w-[180px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2 flex items-center justify-center gap-1">
                <Target size={12} /> Coverage (IDV)
              </p>
              <p className="text-4xl font-extrabold text-white">{fmt(policy.coverage_amount)}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
              <Wallet size={14} /> Annual Premium
            </h3>
            <p className="text-2xl font-bold text-white">
              {fmt(policy.premium_min)} <span className="text-neutral-700 font-normal mx-1">–</span> {fmt(policy.premium_max)}
            </p>
            <p className="text-sm text-neutral-500 mt-2">Before NCB or specialised discounts.</p>
          </div>

          {policy.claim_settlement_ratio != null && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
                <ShieldAlert size={14} /> Claim Settlement Ratio
              </h3>
              <div className="flex items-end justify-between mb-3">
                <p className={`text-4xl font-extrabold ${ratio >= 95 ? "text-emerald-400" : ratio >= 85 ? "text-amber-400" : "text-red-400"}`}>
                  {ratio}%
                </p>
                <span className="text-xs text-neutral-500 mb-1">Success rate</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${ratio >= 95 ? "bg-emerald-500" : ratio >= 85 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${ratio}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Add-ons */}
        {policy.add_ons && policy.add_ons.length > 0 && (
          <div className="glass rounded-3xl mb-8 overflow-hidden">
            <div className="px-7 py-5 border-b border-white/5 flex items-center gap-2">
              <Sparkles size={18} className="text-sky-400" />
              <h2 className="text-base font-bold text-white">Included Add-ons</h2>
            </div>
            <div className="p-7 flex flex-wrap gap-3">
              {policy.add_ons.map((addon) => (
                <div key={addon} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold">
                  <CheckCircle2 size={14} className="shrink-0" /> {addon}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {policy.description && (
          <div className="glass rounded-3xl mb-12 p-7">
            <h2 className="text-base font-bold text-white mb-3">About This Policy</h2>
            <p className="text-neutral-300 leading-relaxed text-base">{policy.description}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/recommend")}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold text-base rounded-full py-4 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
          >
            🎯 Check AI Recommendation
          </button>
          <button
            onClick={() => router.push("/compare")}
            className="flex-1 bg-white/5 border border-white/10 text-white font-bold text-base rounded-full py-4 hover:bg-white/10 transition-colors"
          >
            ⚖️ Compare More Policies
          </button>
        </div>
      </div>
    </main>
  );
}
