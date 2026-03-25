"use client";

import { useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { getRecommendations } from "@/lib/api";
import type { Policy, PolicyType, RecommendationRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, MapPin, Wallet, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    car_model: "",
    city: "",
    budget_min: 5000,
    budget_max: 25000,
    coverage_preference: "" as PolicyType | "",
  });

  const [results, setResults] = useState<Policy[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSubmitted(false);

    const request: RecommendationRequest = {
      car_model: form.car_model || undefined,
      city: form.city || undefined,
      budget_min: form.budget_min,
      budget_max: form.budget_max,
      coverage_preference: form.coverage_preference || undefined,
    };

    try {
      const response = await getRecommendations(request);
      setResults(response.policies);
      setMessage(response.message);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get recommendations.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressValue = submitted ? 100 : (step / 3) * 100;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center bg-slate-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-300/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-emerald-300/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl z-10">
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Perfect Match</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Answer a few quick questions and our AI will recommend the top policies tailored to your needs.
          </p>
        </div>

        {/* Wizard Container */}
        {!submitted ? (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-100/40 border border-slate-100 p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest block mb-1">Step {step} of 3</span>
                <h2 className="text-2xl font-heading font-bold text-slate-900">
                  {step === 1 && "Vehicle Details"}
                  {step === 2 && "Location & Usage"}
                  {step === 3 && "Coverage & Budget"}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                {step === 1 && <Car />}
                {step === 2 && <MapPin />}
                {step === 3 && <Wallet />}
              </div>
            </div>

            <div className="min-h-[220px]">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Car Make & Model</label>
                    <Input 
                      placeholder="e.g. Maruti Swift VXi" 
                      value={form.car_model}
                      onChange={(e) => setForm(f => ({ ...f, car_model: e.target.value }))}
                      className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 text-lg px-4"
                    />
                    <p className="text-xs text-slate-500">The specific model helps determine intrinsic value (IDV).</p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">City of Registration</label>
                    <Input 
                      placeholder="e.g. Mumbai, Maharashtra" 
                      value={form.city}
                      onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                      className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 text-lg px-4"
                    />
                    <p className="text-xs text-slate-500">Used to estimate risk zones for premium calculation.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Coverage Type</label>
                    <Select 
                      value={form.coverage_preference} 
                      onValueChange={(val) => setForm(f => ({ ...f, coverage_preference: val as PolicyType | "" }))}
                    >
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:ring-emerald-500 text-base">
                        <SelectValue placeholder="Any Coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Any Coverage</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (Recommended)</SelectItem>
                        <SelectItem value="third_party">Third Party Only</SelectItem>
                        <SelectItem value="standalone_od">Standalone Own Damage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-slate-700">Budget Range (₹/year)</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        ₹{form.budget_min.toLocaleString()} — ₹{form.budget_max.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2">
                       <Slider 
                         min={1000} 
                         max={150000} 
                         step={1000} 
                         value={[form.budget_max]}
                         onValueChange={(val) => setForm(f => ({ ...f, budget_max: Array.isArray(val) ? val[0] : (val as unknown as number[])[0] ?? val }))}
                         className="py-4"
                       />
                       <div className="flex justify-between text-xs text-slate-400 font-medium mt-1">
                         <span>Up to ₹{form.budget_max.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
                      ⚠️ {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 1 || isLoading}
                className="text-slate-500 font-semibold"
              >
                {step > 1 ? <><ArrowLeft className="mr-2 h-4 w-4" /> Back</> : " "}
              </Button>
              
              {step < 3 ? (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 h-11 px-6 font-bold rounded-xl shadow-md shadow-emerald-200">
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 h-11 px-8 font-bold rounded-xl shadow-md shadow-teal-200"
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get Matches</>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <Sparkles className="text-emerald-600" size={24} />
                  Top {results.length} Matches
                </h2>
                <p className="text-slate-500 text-sm mt-1">{message || "Based on your vehicle and budget preferences."}</p>
              </div>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="font-semibold h-10 border-slate-200 shrink-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit Preferences
              </Button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Car size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Policies Found</h3>
                <p className="text-slate-500">We couldn't find any policies matching those exact filters. Try broadening your budget or coverage preferences.</p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-6 border-slate-200 font-semibold">
                  Adjust Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((policy, idx) => (
                  <div key={policy.id} className="animate-fade-up" style={{ animationDelay: `${100 * (idx + 1)}ms` }}>
                    <PolicyCard policy={policy} />
                  </div>
                ))}
              </div>
            )}
            
            {results.length > 0 && (
              <div className="mt-12 text-center">
                 <Button className="bg-slate-900 hover:bg-slate-800 h-12 px-8 rounded-xl font-bold">
                   Proceed to Comparison →
                 </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
