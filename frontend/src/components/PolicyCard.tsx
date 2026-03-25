"use client";

import Link from "next/link";
import type { Policy } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card 
      onClick={() => onSelect?.(policy)}
      className={`relative cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
        isSelected ? 'ring-2 ring-emerald-600 bg-emerald-50/10' : 'border-slate-200 bg-white'
      }`}
    >
      {isSelected && (
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white z-10">
          <CheckCircle2 size={16} />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
            {policy.policy_type.replace('_', ' ').toUpperCase()}
          </Badge>
          <Shield size={18} className="text-slate-400" />
        </div>
        <h3 className="font-heading text-lg font-bold text-slate-900 leading-tight">
          {policy.name}
        </h3>
        <p className="text-sm text-slate-500 font-medium">{policy.insurer_name}</p>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Premium</p>
            <p className="font-bold text-slate-900">
              {formatCurrency(policy.premium_min)}
              <span className="text-slate-400 font-normal"> - </span>
              {formatCurrency(policy.premium_max)}
            </p>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
            <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold mb-1">Coverage (IDV)</p>
            <p className="font-bold text-emerald-900">
              {formatCurrency(policy.coverage_amount)}
            </p>
          </div>
        </div>

        {policy.claim_settlement_ratio != null && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-500">Claim Settlement</span>
              <span className={`text-xs font-bold ${ratio >= 95 ? 'text-emerald-600' : ratio >= 85 ? 'text-amber-500' : 'text-red-500'}`}>
                {ratio}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${ratio}%` }}
              />
            </div>
          </div>
        )}

        {policy.add_ons && policy.add_ons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {policy.add_ons.slice(0, 3).map((addon) => (
              <span key={addon} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 font-medium">
                {addon}
              </span>
            ))}
            {policy.add_ons.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 text-emerald-600 font-semibold">
                +{policy.add_ons.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/compare/${policy.id}`} className="w-full" onClick={(e) => e.stopPropagation()}>
          <div className="w-full py-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-200">
            <Info size={14} /> View Details
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
