"use client";

import Link from "next/link";
import type { Policy } from "@/lib/types";
import { CheckCircle2, Shield, Info } from "lucide-react";

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
  const ratio = policy.claim_settlement_ratio ?? 0;

  return (
    <div
      onClick={() => onSelect?.(policy)}
      className={`relative glass rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 ${
        isSelected ? "border-indigo-500/60 bg-indigo-500/5 shadow-lg shadow-indigo-500/20" : "hover:bg-white/8 hover:border-white/20"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50 z-10">
          <CheckCircle2 size={14} className="text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
          {policy.policy_type.replace("_", " ")}
        </span>
        <Shield size={16} className="text-neutral-600" />
      </div>

      <h3 className="font-bold text-white text-base mb-1 leading-tight">{policy.name}</h3>
      <p className="text-sm text-neutral-400 font-medium mb-4">{policy.insurer_name}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/3 rounded-xl p-3 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Premium</p>
          <p className="text-sm font-bold text-white">{formatCurrency(policy.premium_min)}<span className="text-neutral-600"> - </span>{formatCurrency(policy.premium_max)}</p>
        </div>
        <div className="bg-indigo-500/8 rounded-xl p-3 border border-indigo-500/15">
          <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold mb-1">IDV</p>
          <p className="text-sm font-bold text-indigo-300">{formatCurrency(policy.coverage_amount)}</p>
        </div>
      </div>

      {/* CSR bar */}
      {policy.claim_settlement_ratio != null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-neutral-500 font-medium">Claim Settlement</span>
            <span className={`font-bold ${ratio >= 95 ? "text-emerald-400" : ratio >= 85 ? "text-amber-400" : "text-red-400"}`}>{ratio}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-1000" style={{ width: `${ratio}%` }} />
          </div>
        </div>
      )}

      {/* Add-ons */}
      {policy.add_ons && policy.add_ons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {policy.add_ons.slice(0, 3).map((a) => (
            <span key={a} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-400 font-medium">{a}</span>
          ))}
          {policy.add_ons.length > 3 && <span className="text-[10px] text-indigo-400 font-bold">+{policy.add_ons.length - 3} more</span>}
        </div>
      )}

      {/* Footer */}
      <Link href={`/compare/${policy.id}`} onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-neutral-500 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10">
        <Info size={13} /> View Details
      </Link>
    </div>
  );
}
