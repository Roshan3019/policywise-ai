"use client";

import Link from "next/link";
import type { Policy } from "@/lib/types";
import PolicyTypeBadge from "./Badge";

interface PolicyCardProps {
  policy: Policy;
  onSelect?: (policy: Policy) => void;
  isSelected?: boolean;
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000)   return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export default function PolicyCard({ policy, onSelect, isSelected }: PolicyCardProps) {
  const maxRatio = 100;
  const ratio = policy.claim_settlement_ratio ?? 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: "24px",
        position: "relative",
        cursor: onSelect ? "pointer" : "default",
        border: isSelected
          ? "1px solid rgba(99,102,241,0.6)"
          : "1px solid var(--glass-border)",
        boxShadow: isSelected ? "var(--shadow-glow)" : "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      onClick={() => onSelect?.(policy)}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--grad-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: "white",
          }}
        >
          ✓
        </div>
      )}

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <PolicyTypeBadge type={policy.policy_type} />
        </div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "2px",
            lineHeight: 1.3,
          }}
        >
          {policy.name}
        </h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {policy.insurer_name}
        </p>
      </div>

      {/* Premium & Coverage */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "rgba(59,130,246,0.07)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <p style={{ fontSize: "0.7rem", color: "var(--text-subtle)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Annual Premium
          </p>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {formatCurrency(policy.premium_min)}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> – </span>
            {formatCurrency(policy.premium_max)}
          </p>
        </div>

        <div
          style={{
            background: "rgba(99,102,241,0.07)",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <p style={{ fontSize: "0.7rem", color: "var(--text-subtle)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Coverage (IDV)
          </p>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {formatCurrency(policy.coverage_amount)}
          </p>
        </div>
      </div>

      {/* Claim Settlement Ratio */}
      {policy.claim_settlement_ratio != null && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Claim Settlement
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: ratio >= 95 ? "#4ade80" : ratio >= 85 ? "#fbbf24" : "#f87171",
              }}
            >
              {ratio}%
            </p>
          </div>
          <div className="ratio-bar-track">
            <div
              className="ratio-bar-fill"
              style={{ width: `${(ratio / maxRatio) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Add-ons */}
      {policy.add_ons && policy.add_ons.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {policy.add_ons.slice(0, 3).map((addon) => (
            <span
              key={addon}
              style={{
                fontSize: "0.7rem",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {addon}
            </span>
          ))}
          {policy.add_ons.length > 3 && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "3px 8px",
                borderRadius: "4px",
                color: "var(--accent-blue)",
              }}
            >
              +{policy.add_ons.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <Link
          href={`/compare/${policy.id}`}
          className="btn-secondary"
          style={{ flex: 1, justifyContent: "center", padding: "9px 12px", fontSize: "0.8rem" }}
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
