/**
 * lib/api.ts
 * Typed fetch wrapper for the PolicyWise AI backend (localhost:8000).
 * All functions return typed data or throw with an error message.
 */

import type {
  APIResponse,
  Policy,
  PolicyCreate,
  PolicyFilter,
  RecommendationRequest,
  RecommendationResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Generic helper ────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<APIResponse<T>>;
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/api/v1/health/`);
  return res.json();
}

// ── Policies ──────────────────────────────────────────────────────────────────

export async function getPolicies(
  filters: PolicyFilter = {},
  skip = 0,
  limit = 20
): Promise<Policy[]> {
  const params = new URLSearchParams();
  params.set("skip", String(skip));
  params.set("limit", String(limit));

  if (filters.policy_type)    params.set("policy_type", filters.policy_type);
  if (filters.insurer_name)   params.set("insurer_name", filters.insurer_name);
  if (filters.budget_min)     params.set("budget_min", String(filters.budget_min));
  if (filters.budget_max)     params.set("budget_max", String(filters.budget_max));
  if (filters.min_coverage)   params.set("min_coverage", String(filters.min_coverage));
  if (filters.min_claim_ratio) params.set("min_claim_ratio", String(filters.min_claim_ratio));

  const response = await apiFetch<Policy[]>(`/api/v1/policies/?${params}`);
  return response.data ?? [];
}

export async function getPolicy(id: number): Promise<Policy> {
  const response = await apiFetch<Policy>(`/api/v1/policies/${id}`);
  if (!response.data) throw new Error("Policy not found");
  return response.data;
}

export async function createPolicy(payload: PolicyCreate): Promise<Policy> {
  const response = await apiFetch<Policy>("/api/v1/policies/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.data) throw new Error("Failed to create policy");
  return response.data;
}

// ── Recommendations ────────────────────────────────────────────────────────────

export async function getRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await apiFetch<RecommendationResponse>(
    "/api/v1/recommendations/",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
  if (!response.data) throw new Error("Failed to get recommendations");
  return response.data;
}
