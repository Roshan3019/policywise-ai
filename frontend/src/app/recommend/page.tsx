"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PolicyCard from "@/components/PolicyCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getRecommendations } from "@/lib/api";
import type { Policy, PolicyType, RecommendationRequest } from "@/lib/types";

const COVERAGE_OPTIONS: { value: PolicyType | ""; label: string }[] = [
  { value: "", label: "Any Coverage" },
  { value: "comprehensive", label: "Comprehensive" },
  { value: "third_party", label: "Third Party" },
  { value: "standalone_od", label: "Standalone OD" },
];

export default function RecommendPage() {
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const msg = err instanceof Error ? err.message : "Failed to get recommendations. Is the backend running?";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", paddingTop: "88px", paddingBottom: "80px", position: "relative" }}>
      {/* Orbs */}
      <div className="orb orb-indigo" style={{ width: 500, height: 500, top: -100, right: -150, opacity: 0.2 }} />

      <div className="container-main">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }} className="animate-fade-up">
          <div className="badge badge-blue" style={{ display: "inline-flex", marginBottom: "16px" }}>
            🎯 Smart Recommendations
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "12px" }}>
            Find Your{" "}
            <span className="gradient-text">Perfect Policy</span>
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
            Tell us about yourself and we&apos;ll match you with top-rated insurance policies.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: submitted ? "380px 1fr" : "1fr",
            gap: "32px",
            maxWidth: submitted ? "100%" : "600px",
            margin: "0 auto",
            transition: "all 0.4s ease",
          }}
        >
          {/* Form */}
          <div className="glass-card animate-fade-up delay-100" style={{ padding: "36px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "28px" }}>
              Your Preferences
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Car Model
                </label>
                <input
                  id="car-model-input"
                  className="input-field"
                  placeholder="e.g. Maruti Swift, Honda City"
                  value={form.car_model}
                  onChange={(e) => setForm((f) => ({ ...f, car_model: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  City of Registration
                </label>
                <input
                  id="city-input"
                  className="input-field"
                  placeholder="e.g. Mumbai, Delhi, Bengaluru"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Coverage Preference
                </label>
                <select
                  id="coverage-select"
                  className="select-field"
                  value={form.coverage_preference}
                  onChange={(e) => setForm((f) => ({ ...f, coverage_preference: e.target.value as PolicyType | "" }))}
                >
                  {COVERAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Budget Range</label>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    ₹{form.budget_min.toLocaleString()} – ₹{form.budget_max.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", width: "32px" }}>Min</span>
                    <input
                      id="budget-min-slider"
                      type="range"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={form.budget_min}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          budget_min: Math.min(Number(e.target.value), f.budget_max - 1000),
                        }))
                      }
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", width: "32px" }}>Max</span>
                    <input
                      id="budget-max-slider"
                      type="range"
                      min={1000}
                      max={100000}
                      step={1000}
                      value={form.budget_max}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          budget_max: Math.max(Number(e.target.value), f.budget_min + 1000),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: "8px",
                    color: "#f87171",
                    fontSize: "0.85rem",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <button
                id="recommend-submit-btn"
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ width: "100%", justifyContent: "center", padding: "14px" }}
              >
                {isLoading ? "Finding policies..." : "🎯 Get My Recommendations"}
              </button>
            </form>
          </div>

          {/* Results */}
          {submitted && (
            <div className="animate-fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {results.length > 0
                    ? `${results.length} Matching Policies`
                    : "No Matches Found"}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{message}</p>
              </div>

              {isLoading ? (
                <LoadingSpinner label="Finding best policies..." />
              ) : results.length === 0 ? (
                <div
                  className="glass"
                  style={{ padding: "48px", textAlign: "center" }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                  <h3 style={{ marginBottom: "8px" }}>No policies matched</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    Try broadening your budget range or changing the coverage type.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {results.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
