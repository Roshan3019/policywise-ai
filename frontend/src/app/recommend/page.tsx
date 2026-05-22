"use client";

import { useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { getRecommendations } from "@/lib/api";
import type { Policy, PolicyType, RecommendationRequest } from "@/lib/types";
import { SparklesCore } from "@/components/ui/sparkles";
import { Car, MapPin, Wallet, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const STEPS = [
  { label: "Vehicle", icon: Car },
  { label: "Location", icon: MapPin },
  { label: "Coverage", icon: Wallet },
];

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    car_model: "",
    city: "",
    budget_max: 25000,
    coverage_preference: "" as PolicyType | "",
  });
  const [results, setResults] = useState<Policy[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true); setError(""); setSubmitted(false);
    const req: RecommendationRequest = {
      car_model: form.car_model || undefined,
      city: form.city || undefined,
      budget_min: 1000,
      budget_max: form.budget_max,
      coverage_preference: form.coverage_preference || undefined,
    };
    try {
      const resp = await getRecommendations(req);
      setResults(resp.policies); setMessage(resp.message); setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden pt-20 pb-20 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header with SparklesCore */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">AI Matching Engine</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
              Find Your Perfect Match
            </span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-lg mx-auto">
            Answer a few quick questions and our AI will surface the top policies tailored to you.
          </p>

          {/* Sparkles preview */}
          <div className="relative w-[40rem] h-28 mx-auto -my-2">
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-px h-16 bg-gradient-to-b from-transparent to-indigo-500/50" />
            <SparklesCore
              minSize={0.4} maxSize={1} particleDensity={1200}
              particleColor="#FFFFFF" background="transparent"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]" />
          </div>
          <div className="w-[30rem] mx-auto h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mb-8" />
        </div>

        {/* Wizard card */}
        {!submitted ? (
          <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
            {/* Progress steps */}
            <div className="flex items-center justify-between mb-8">
              {STEPS.map((s, i) => {
                const idx = i + 1;
                const active = step === idx;
                const done = step > idx;
                return (
                  <div key={s.label} className="flex items-center">
                    <div className={`flex items-center gap-2 text-sm font-semibold transition-colors ${active ? "text-white" : done ? "text-indigo-400" : "text-neutral-600"}`}>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${active ? "border-indigo-500 bg-indigo-500/20" : done ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-400" : "border-white/10"}`}>
                        {done ? "✓" : <s.icon size={14} />}
                      </div>
                      <span className="hidden sm:block">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`mx-3 h-px w-6 sm:w-12 ${step > idx ? "bg-indigo-500/50" : "bg-white/10"}`} />}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">
              {step === 1 && "Vehicle Details"}
              {step === 2 && "City & Location"}
              {step === 3 && "Coverage & Budget"}
            </h2>

            <div className="min-h-[200px] space-y-6">
              {step === 1 && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">Car Make & Model</label>
                  <input
                    type="text" placeholder="e.g. Maruti Swift VXi"
                    value={form.car_model}
                    onChange={(e) => setForm(f => ({ ...f, car_model: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 text-base transition-colors"
                  />
                  <p className="text-xs text-neutral-500 mt-2">Helps determine the Insured Declared Value (IDV).</p>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-300 mb-2">City of Registration</label>
                  <input
                    type="text" placeholder="e.g. Mumbai, Maharashtra"
                    value={form.city}
                    onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 text-base transition-colors"
                  />
                  <p className="text-xs text-neutral-500 mt-2">Used to estimate risk zone for premium calculation.</p>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-300 mb-2">Coverage Type</label>
                    <Select value={form.coverage_preference} onValueChange={(v) => setForm(f => ({ ...f, coverage_preference: v as PolicyType | "" }))}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:ring-indigo-500 rounded-xl">
                        <SelectValue placeholder="Any Coverage" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-white">
                        <SelectItem value="null">Any Coverage</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (Recommended)</SelectItem>
                        <SelectItem value="third_party">Third Party Only</SelectItem>
                        <SelectItem value="standalone_od">Standalone Own Damage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3 text-sm font-semibold">
                      <span className="text-neutral-300">Max Budget (₹/year)</span>
                      <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Up to ₹{form.budget_max.toLocaleString()}</span>
                    </div>
                    <Slider
                      min={1000} max={150000} step={1000}
                      value={[form.budget_max]}
                      onValueChange={(val) => setForm(f => ({ ...f, budget_max: Array.isArray(val) ? val[0] : val }))}
                      className="py-3"
                    />
                    <div className="flex justify-between text-xs text-neutral-600 mt-1">
                      <span>₹1,000</span><span>₹1,50,000</span>
                    </div>
                  </div>
                  {error && <p className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm">⚠️ {error}</p>}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <button onClick={() => setStep(s => Math.max(s - 1, 1))} disabled={step === 1} className="flex items-center gap-1 text-sm font-semibold text-neutral-400 hover:text-white transition-colors disabled:opacity-30">
                <ArrowLeft size={16} /> Back
              </button>
              {step < 3 ? (
                <button onClick={() => setStep(s => Math.min(s + 1, 3))} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-sky-500 text-white text-sm font-bold rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isLoading ? <><Loader2 className="animate-spin" size={16} /> Analyzing...</> : <><Sparkles size={16} /> Get Matches</>}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results */
          <div>
            <div className="flex items-center justify-between mb-6 glass rounded-2xl p-5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-indigo-400" size={20} /> Top {results.length} Matches
                </h2>
                <p className="text-neutral-400 text-sm mt-1">{message}</p>
              </div>
              <button onClick={() => setSubmitted(false)} className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft size={14} /> Edit
              </button>
            </div>
            {results.length === 0 ? (
              <div className="glass rounded-3xl p-16 text-center">
                <h3 className="text-xl font-bold text-white mb-2">No Policies Found</h3>
                <p className="text-neutral-400">Try broadening your budget or coverage preference.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {results.map((p) => <PolicyCard key={p.id} policy={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
