"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPolicy } from "@/lib/api";
import type { Policy } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, Building2, Wallet, Target } from "lucide-react";

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Ensure id is a string before parsing
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(idParam);

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPolicy(id);
        setPolicy(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load policy.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center animate-pulse text-emerald-600">
          <ShieldAlert size={48} className="mb-4 opacity-50" />
          <p className="font-semibold text-slate-500">Loading policy details...</p>
        </div>
      </main>
    );
  }

  if (error || !policy) {
    return (
      <main className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Policy Not Found</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <Button onClick={() => router.push("/compare")} className="bg-emerald-600 hover:bg-emerald-700 w-full">
            Back to Compare
          </Button>
        </div>
      </main>
    );
  }

  const ratio = policy.claim_settlement_ratio ?? 0;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-200/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-emerald-200/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-8 text-slate-500 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-emerald-100/40 mb-8 animate-fade-up">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold mb-4 uppercase tracking-widest px-3 py-1">
                {policy.policy_type.replace('_', ' ')}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
                {policy.name}
              </h1>
              <div className="flex items-center text-slate-500 font-medium text-lg">
                <Building2 className="w-5 h-5 mr-2 text-slate-400" />
                {policy.insurer_name}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl text-center min-w-[200px] shrink-0">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                <Target size={14} /> Total Coverage (IDV)
              </p>
              <p className="text-4xl font-extrabold text-slate-900">
                {formatCurrency(policy.coverage_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <Card className="border-slate-100 shadow-sm rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Wallet size={16} /> Annual Premium
            </h3>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(policy.premium_min)} <span className="text-slate-300 font-normal mx-2">-</span> {formatCurrency(policy.premium_max)}
            </p>
            <p className="text-sm text-slate-500 mt-2">Estimated cost before NCB or specialized discounts.</p>
          </Card>

          {policy.claim_settlement_ratio != null && (
            <Card className="border-slate-100 shadow-sm rounded-3xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <ShieldAlert size={16} /> Claim Settlement Ratio
              </h3>
              <div className="flex items-end justify-between mb-3">
                <p className={`text-4xl font-extrabold ${ratio >= 95 ? 'text-emerald-500' : ratio >= 85 ? 'text-amber-500' : 'text-red-500'}`}>
                  {ratio}%
                </p>
                <span className="text-sm font-medium text-slate-500 mb-1">Success Rate</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${ratio >= 95 ? 'bg-emerald-500' : ratio >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${ratio}%` }} 
                />
              </div>
            </Card>
          )}
        </div>

        {/* Add-ons */}
        {policy.add_ons && policy.add_ons.length > 0 && (
          <Card className="border-slate-100 shadow-sm rounded-3xl mb-8 animate-fade-up overflow-hidden" style={{ animationDelay: '200ms' }}>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-teal-500" size={20} /> Included Add-ons
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {policy.add_ons.map((addon) => (
                  <div key={addon} className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-xl text-sm font-bold border border-emerald-100/50">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {addon}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {policy.description && (
          <Card className="border-slate-100 shadow-sm rounded-3xl mb-12 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold text-slate-900">About This Policy</h2>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed text-lg">
                {policy.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sticky-ish CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '400ms' }}>
          <Button onClick={() => router.push("/recommend")} className="bg-emerald-600 hover:bg-emerald-700 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-200 flex-1">
            🎯 Check AI Recommendation
          </Button>
          <Button variant="outline" onClick={() => router.push("/compare")} className="h-14 rounded-2xl text-lg font-bold border-slate-200 hover:bg-slate-50 flex-1">
            ⚖️ Add to Comparison
          </Button>
        </div>
      </div>
    </main>
  );
}
