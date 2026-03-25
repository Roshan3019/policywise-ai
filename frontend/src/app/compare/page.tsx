"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { getPolicies } from "@/lib/api";
import type { Policy, PolicyFilter, PolicyType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, X, Loader2, ArrowLeftRight, Trash2, Medal } from "lucide-react";

export default function ComparePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Policy[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Filters
  const [policyType, setPolicyType] = useState<PolicyType | "">("");

  const fetchPolicies = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getPolicies({ policy_type: policyType || undefined });
      setPolicies(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load policies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyType]);

  const handleSelect = (policy: Policy) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === policy.id);
      if (exists) return prev.filter((p) => p.id !== policy.id);
      if (prev.length >= 3) return [...prev.slice(1), policy]; // Max 3
      return [...prev, policy];
    });
  };

  if (showComparison && selected.length >= 2) {
    return <ComparisonDashboard policies={selected} onBack={() => setShowComparison(false)} />;
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeftRight size={14} /> Policy Browser
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Select Policies to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Compare</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Select up to 3 policies to view a detailed side-by-side analysis.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-500">
            {selected.length} / 3 Selected
          </div>
          <Button 
            onClick={() => setShowComparison(true)} 
            disabled={selected.length < 2}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-slate-200"
          >
            Compare Now
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm animate-fade-up" style={{ animationDelay: '100ms' }}>
         <Select value={policyType} onValueChange={(v) => setPolicyType(v as PolicyType | "")}>
            <SelectTrigger className="w-[200px] border-0 bg-transparent shadow-none focus:ring-0 font-medium">
              <SelectValue placeholder="All Coverage Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">All Coverage Types</SelectItem>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="third_party">Third Party</SelectItem>
            </SelectContent>
         </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
          <Loader2 className="animate-spin w-8 h-8 mb-4 text-emerald-600" />
          <p className="font-medium text-slate-600">Loading active policies...</p>
        </div>
      ) : policies.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-700">No policies found</h3>
          <p className="text-slate-500 text-sm mt-1">Adjust your filters to see results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {policies.map((policy) => (
            <PolicyCard 
              key={policy.id} 
              policy={policy} 
              onSelect={handleSelect}
              isSelected={!!selected.find(p => p.id === policy.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function ComparisonDashboard({ policies, onBack }: { policies: Policy[], onBack: () => void }) {
  // Find best policy (highest CSR)
  const bestPolicy = [...policies].sort((a, b) => (b.claim_settlement_ratio || 0) - (a.claim_settlement_ratio || 0))[0];

  return (
    <main className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto animate-fade-in">
      {/* Sticky Header */}
      <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 py-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-500 font-medium hover:text-slate-900 border border-slate-200 bg-white rounded-lg">
            ← Back to Selection
          </Button>
          <Button variant="outline" onClick={() => {}} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 rounded-lg">
            <Trash2 size={16} className="mr-2" /> Clear All
          </Button>
        </div>
      </div>

      {/* Comparison CSS Grid */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-[800px]">
          {/* Headers */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="p-4 flex flex-col justify-end">
              <h2 className="text-3xl font-heading font-extrabold text-slate-900">Comparison</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Head-to-head analysis</p>
            </div>
            {policies.map((p) => {
              const isBest = p.id === bestPolicy.id;
              return (
                <Card key={`header-${p.id}`} className={`relative p-5 border-2 ${isBest ? 'border-emerald-600 shadow-xl shadow-emerald-100/50 bg-emerald-50/10' : 'border-slate-100'}`}>
                  {isBest && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center shadow-sm">
                      <Medal size={12} className="mr-1" /> Best Choice
                    </div>
                  )}
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">{p.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{p.insurer_name}</p>
                  <Button className={`w-full mt-4 rounded-lg font-bold ${isBest ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
                    Choose Policy
                  </Button>
                </Card>
              );
            })}
            {/* Fill empty slots if < 3 */}
            {Array.from({ length: 3 - policies.length }).map((_, i) => (
              <div key={`empty-auto-${i}`} className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-5 opacity-50 bg-slate-50/50">
                <span className="text-sm font-semibold text-slate-400">Add policy to compare</span>
              </div>
            ))}
          </div>

          <div className="bg-white border text-left border-slate-200 rounded-2xl shadow-sm overflow-hidden text-sm">
             <ComparisonRow title="Coverage Type" policies={policies} renderValue={(p) => <Badge variant="secondary" className="bg-slate-100">{p.policy_type.replace('_', ' ').toUpperCase()}</Badge>} />
             <ComparisonRow title="Premium Range" policies={policies} renderValue={(p) => <span className="font-bold text-slate-900">₹{p.premium_min.toLocaleString()} - ₹{p.premium_max.toLocaleString()}</span>} />
             <ComparisonRow title="Coverage (IDV)" policies={policies} renderValue={(p) => <span className="font-bold text-emerald-700">₹{p.coverage_amount.toLocaleString()}</span>} />
             <ComparisonRow title="Claim Settlement Ratio" policies={policies} renderValue={(p) => <span className={`font-bold ${p.claim_settlement_ratio! >= 95 ? 'text-emerald-600' : 'text-amber-500'}`}>{p.claim_settlement_ratio}%</span>} />
             <ComparisonRow title="Zero Depreciation" policies={policies} renderValue={(p) => <CheckOrCross val={p.add_ons?.includes("Zero Depreciation") || false} />} />
             <ComparisonRow title="Engine Protection" policies={policies} renderValue={(p) => <CheckOrCross val={p.add_ons?.includes("Engine Protection") || false} />} />
             <ComparisonRow title="Roadside Assistance" policies={policies} renderValue={(p) => <CheckOrCross val={p.add_ons?.includes("Roadside Assistance") || false} />} />
             <ComparisonRow title="All Add-ons" policies={policies} renderValue={(p) => (
                <div className="flex flex-wrap gap-1">
                  {p.add_ons?.map(a => <span key={a} className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600">{a}</span>)}
                </div>
             )} />
          </div>
        </div>
      </div>
    </main>
  );
}

function ComparisonRow({ title, policies, renderValue }: { title: string, policies: Policy[], renderValue: (p: Policy) => React.ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className="font-semibold text-slate-500 flex items-center px-2">{title}</div>
      {policies.map(p => (
        <div key={p.id} className="p-2 flex items-center">
          {renderValue(p)}
        </div>
      ))}
      {Array.from({ length: 3 - policies.length }).map((_, i) => <div key={`empty-${i}`} className="p-2" />)}
    </div>
  );
}

function CheckOrCross({ val }: { val: boolean }) {
  if (val) return <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={14} strokeWidth={3} /></div>;
  return <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><X size={14} strokeWidth={3} /></div>;
}
