"use client";

import type { PolicyType } from "@/lib/types";

type BadgeVariant = "blue" | "amber" | "green" | "purple";

const POLICY_TYPE_MAP: Record<PolicyType, { label: string; variant: BadgeVariant }> = {
  comprehensive:  { label: "Comprehensive",  variant: "blue"   },
  third_party:    { label: "Third Party",    variant: "amber"  },
  standalone_od:  { label: "Standalone OD",  variant: "green"  },
};

interface BadgeProps {
  type: PolicyType;
}

export default function PolicyTypeBadge({ type }: BadgeProps) {
  const { label, variant } = POLICY_TYPE_MAP[type] ?? {
    label: type,
    variant: "purple",
  };
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
