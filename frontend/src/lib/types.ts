/**
 * lib/types.ts
 * TypeScript interfaces matching the Phase 2 backend Pydantic schemas.
 */

// ── Policy ──────────────────────────────────────────────────────────────────

export type PolicyType = "comprehensive" | "third_party" | "standalone_od";

export interface Policy {
  id: number;
  name: string;
  insurer_name: string;
  policy_type: PolicyType;
  premium_min: number;
  premium_max: number;
  coverage_amount: number;
  claim_settlement_ratio: number | null;
  add_ons: string[] | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface PolicyCreate {
  name: string;
  insurer_name: string;
  policy_type: PolicyType;
  premium_min: number;
  premium_max: number;
  coverage_amount: number;
  claim_settlement_ratio?: number;
  add_ons?: string[];
  description?: string;
}

export interface PolicyFilter {
  policy_type?: PolicyType;
  insurer_name?: string;
  budget_min?: number;
  budget_max?: number;
  min_coverage?: number;
  min_claim_ratio?: number;
}

// ── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

// ── Recommendation ───────────────────────────────────────────────────────────

export interface RecommendationRequest {
  car_model?: string;
  city?: string;
  budget_min?: number;
  budget_max?: number;
  coverage_preference?: string;
  session_id?: string;
}

export interface RecommendationResponse {
  request_id: number;
  total_matches: number;
  policies: Policy[];
  message: string;
}

// ── API Envelope ─────────────────────────────────────────────────────────────

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// ── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}
