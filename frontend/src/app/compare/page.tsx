"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getPolicies } from "@/lib/api";
import type { Policy, PolicyFilter, PolicyType } from "@/lib/types";

const COVERAGE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "comprehensive", label: "Comprehensive" },
  { value: "third_party", label: "Third Party" },
  { value: "standalone_od", label: "Standalone OD" },
];

export default function ComparePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Policy[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const [filters, setFilters] = useState<PolicyFilter & { insurer_name: string }>({
    policy_type: undefined,
    insurer_name: "",
    budget_max: undefined,
    min_claim_ratio: undefined,
  });

  const fetchPolicies = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getPolicies({
        policy_type: filters.policy_type,
        insurer_name: filters.insurer_name || undefined,
        budget_max: filters.budget_max,
        min_claim_ratio: filters.min_claim_ratio,
      });
      setPolicies(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load policies.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (policy: Policy) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === policy.id);
      if (exists) return prev.filter((p) => p.id !== policy.id);
      if (prev.length >= 2) return [prev[1], policy];
      return [...prev, policy];
    });
  };

  return (
    <main style={{ minHeight: "100vh", paddingTop: "88px", paddingBottom: "80px" }}>
      <div className="container-main">
        {/* Header */}
        <div style={{ marginBottom: "40px" }} className="animate-fade-up">
          <div className="badge badge-green" style={{ display: "inline-flex", marginBottom: "12px" }}>
            ⚖️ Policy Browser
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "6px" }}>
                Compare <span className="gradient-text">All Policies</span>
              </h1>
              <p style={{ color: "var(--text-muted)" }}>
                {policies.length} active policies · Select 2 to compare side-by-side
              </p>
            </div>
            {selected.length === 2 && (
              <button
                id="compare-selected-btn"
                className="btn-primary"
                onClick={() => setShowComparison(true)}
              >
                ⚖️ Compare Selected ({selected.length})
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div
          className="glass animate-fade-up delay-100"
          style={{
            padding: "20px 24px",
            marginBottom: "28px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: "1 1 180px" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Coverage Type
            </label>
            <select
              id="filter-coverage-type"
              className="select-field"
              value={filters.policy_type ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  policy_type: e.target.value as PolicyType | undefined || undefined,
                }))
              }
            >
              {COVERAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Insurer Name
            </label>
            <input
              id="filter-insurer"
              className="input-field"
              placeholder="Search insurer..."
              value={filters.insurer_name}
              onChange={(e) => setFilters((f) => ({ ...f, insurer_name: e.target.value }))}
            />
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Max Budget (₹/yr)
            </label>
            <input
              id="filter-budget-max"
              className="input-field"
              type="number"
              placeholder="e.g. 20000"
              value={filters.budget_max ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  budget_max: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <div style={{ flex: "1 1 180px" }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Min Claim Ratio (%)
            </label>
            <input
              id="filter-claim-ratio"
              className="input-field"
              type="number"
              placeholder="e.g. 90"
              min={0}
              max={100}
              value={filters.min_claim_ratio ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  min_claim_ratio: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>

          <button
            id="filter-apply-btn"
            className="btn-primary"
            onClick={fetchPolicies}
            style={{ padding: "11px 22px" }}
          >
            Apply Filters
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setFilters({ policy_type: undefined, insurer_name: "", budget_max: undefined, min_claim_ratio: undefined });
              setTimeout(fetchPolicies, 50);
            }}
            style={{ padding: "11px 18px" }}
          >
            Clear
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "16px",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: "10px",
              color: "#f87171",
              marginBottom: "24px",
            }}
          >
            ⚠️ {error} — Make sure the backend is running on port 8000.
          </div>
        )}

        {/* Policy Grid */}
        {isLoading ? (
          <LoadingSpinner label="Loading policies..." />
        ) : policies.length === 0 ? (
          <div className="glass" style={{ padding: "64px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ marginBottom: "8px" }}>No policies found</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Add policies via the backend API, then come back here to compare them.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onSelect={handleSelect}
                isSelected={!!selected.find((p) => p.id === policy.id)}
              />
            ))}
          </div>
        )}

        {/* Compare Modal */}
        {showComparison && selected.length === 2 && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
            onClick={() => setShowComparison(false)}
          >
            <div
              className="glass-card"
              style={{ maxWidth: "900px", width: "100%", padding: "32px", maxHeight: "85vh", overflow: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <h2 style={{ fontSize: "1.3rem" }}>⚖️ Side-by-Side Comparison</h2>
                <button
                  className="btn-secondary"
                  onClick={() => setShowComparison(false)}
                  style={{ padding: "6px 14px" }}
                >
                  ✕ Close
                </button>
              </div>

              <ComparisonTable policies={selected} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ComparisonTable({ policies }: { policies: Policy[] }) {
  const [a, b] = policies;

  const rows = [
    { label: "Insurer", aVal: a.insurer_name, bVal: b.insurer_name },
    { label: "Type", aVal: a.policy_type.replace("_", " "), bVal: b.policy_type.replace("_", " ") },
    { label: "Premium (Min)", aVal: `₹${a.premium_min.toLocaleString()}`, bVal: `₹${b.premium_min.toLocaleString()}` },
    { label: "Premium (Max)", aVal: `₹${a.premium_max.toLocaleString()}`, bVal: `₹${b.premium_max.toLocaleString()}` },
    { label: "Coverage (IDV)", aVal: `₹${a.coverage_amount.toLocaleString()}`, bVal: `₹${b.coverage_amount.toLocaleString()}` },
    { label: "Claim Ratio", aVal: a.claim_settlement_ratio ? `${a.claim_settlement_ratio}%` : "—", bVal: b.claim_settlement_ratio ? `${b.claim_settlement_ratio}%` : "—" },
    { label: "Add-ons", aVal: a.add_ons?.join(", ") ?? "None", bVal: b.add_ons?.join(", ") ?? "None" },
  ];

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    borderBottom: "1px solid var(--glass-border)",
    fontWeight: 600,
  };
  const tdStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderBottom: "1px solid var(--glass-border)",
    fontSize: "0.9rem",
    color: "var(--text-primary)",
    verticalAlign: "top",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Feature</th>
            <th style={{ ...thStyle, color: "var(--accent-blue)" }}>{a.name}</th>
            <th style={{ ...thStyle, color: "var(--accent-indigo)" }}>{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: "0.8rem" }}>{row.label}</td>
              <td style={tdStyle}>{row.aVal}</td>
              <td style={tdStyle}>{row.bVal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
