"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import PolicyTypeBadge from "@/components/Badge";
import { getPolicy } from "@/lib/api";
import type { Policy } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

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
      <main style={{ minHeight: "100vh", paddingTop: "88px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size={48} label="Loading policy details..." />
      </main>
    );
  }

  if (error || !policy) {
    return (
      <main style={{ minHeight: "100vh", paddingTop: "88px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>❌</div>
          <h2 style={{ marginBottom: "8px" }}>Policy Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error}</p>
          <button className="btn-primary" onClick={() => router.push("/compare")}>
            ← Back to Compare
          </button>
        </div>
      </main>
    );
  }

  const ratio = policy.claim_settlement_ratio ?? 0;

  return (
    <main style={{ minHeight: "100vh", paddingTop: "88px", paddingBottom: "80px", position: "relative" }}>
      {/* Orbs */}
      <div className="orb orb-blue" style={{ width: 400, height: 400, top: 0, right: -100, opacity: 0.15 }} />

      <div className="container-main" style={{ maxWidth: "800px" }}>
        {/* Back */}
        <button
          className="btn-secondary"
          onClick={() => router.back()}
          style={{ marginBottom: "24px", padding: "8px 16px", fontSize: "0.85rem" }}
        >
          ← Back
        </button>

        {/* Header card */}
        <div className="glass-card animate-fade-up" style={{ padding: "36px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <PolicyTypeBadge type={policy.policy_type} />
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "12px", marginBottom: "6px" }}>
                {policy.name}
              </h1>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>{policy.insurer_name}</p>
            </div>
            <div
              style={{
                padding: "16px 24px",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Coverage (IDV)</p>
              <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {formatCurrency(policy.coverage_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="animate-fade-up delay-100"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div className="glass-card" style={{ padding: "20px" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Annual Premium</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              {formatCurrency(policy.premium_min)} – {formatCurrency(policy.premium_max)}
            </p>
          </div>

          {policy.claim_settlement_ratio != null && (
            <div className="glass-card" style={{ padding: "20px" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Claim Settlement Ratio</p>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: ratio >= 95 ? "#4ade80" : ratio >= 85 ? "#fbbf24" : "#f87171",
                }}
              >
                {ratio}%
              </p>
              <div className="ratio-bar-track" style={{ marginTop: "8px" }}>
                <div className="ratio-bar-fill" style={{ width: `${ratio}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Add-ons */}
        {policy.add_ons && policy.add_ons.length > 0 && (
          <div className="glass-card animate-fade-up delay-200" style={{ padding: "28px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>
              ✨ Available Add-ons
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {policy.add_ons.map((addon) => (
                <span
                  key={addon}
                  style={{
                    padding: "8px 14px",
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: "8px",
                    color: "#93c5fd",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  ✓ {addon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {policy.description && (
          <div className="glass-card animate-fade-up delay-300" style={{ padding: "28px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "12px" }}>📄 About This Policy</h2>
            <p style={{ lineHeight: 1.8, color: "var(--text-muted)" }}>{policy.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="animate-fade-up delay-400" style={{ display: "flex", gap: "12px" }}>
          <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "14px" }}
            onClick={() => router.push("/recommend")}
          >
            🎯 Get Recommendation
          </button>
          <button className="btn-secondary" style={{ padding: "14px 20px" }}
            onClick={() => router.push("/compare")}
          >
            ⚖️ Compare More
          </button>
        </div>
      </div>
    </main>
  );
}
