# PolicyWise AI — Phase 1–3 Gap Analysis Report

**Role**: Senior Product Architect & Technical Auditor
**Date**: 2026-03-18
**Scope**: Phase 1 (Project Init) · Phase 2 (Backend Core) · Phase 3 (Frontend)
**Documents reviewed**: PRD v1.0 · TRD v1.0 · SRS v1.0 · workflow.md

---

## 1. ✅ Implemented Features (Correctly Done)

These features exist and are aligned with the PRD/TRD/SRS specifications.

### Phase 1 — Project Initialization
| Item | Status |
|------|--------|
| GitHub repository & folder structure | ✅ Complete |
| Next.js (React) frontend framework | ✅ Correct tech (TRD §4) |
| FastAPI (Python) backend framework | ✅ Correct tech (TRD §5) |
| PostgreSQL database | ✅ Correct choice (TRD §10) |
| Alembic migration setup | ✅ Present (`alembic/`, `alembic.ini`) |
| Environment variable configuration | ✅ `.env` (backend) + `.env.local` (frontend) |
| CORS middleware for Next.js ↔ FastAPI | ✅ Configured in `main.py` |

### Phase 2 — Backend Core Development
| Item | Status |
|------|--------|
| `GET /api/v1/policies` — list policies | ✅ Implemented with filters |
| `GET /api/v1/policies/{id}` — single policy | ✅ Implemented |
| `POST /api/v1/policies` — create policy | ✅ Implemented |
| `PATCH/DELETE /api/v1/policies/{id}` | ✅ Implemented (soft-delete) |
| `POST /api/v1/recommendations` | ✅ Implemented (rule-based) |
| **InsurancePolicy** ORM model | ✅ Complete (premium, IDV, claim ratio, add-ons, type) |
| **UserRecommendationRequest** log model | ✅ Implemented |
| Policy filtering (type, budget, insurer, claim ratio) | ✅ Rich filter in `policy_service.py` |
| Rule-based recommendation engine | ✅ Filters by budget + coverage type; logs results |
| Swagger / ReDoc API documentation | ✅ Available at `/docs` and `/redoc` |
| Loguru structured logging | ✅ In use |
| `health` endpoint | ✅ Present (`api/v1/health.py`) |
| `users.py` endpoint with user service | ✅ Present |

### Phase 3 — Frontend Development
| Item | Status |
|------|--------|
| Next.js project setup & routing | ✅ App router with `/chat`, `/recommend`, `/compare` |
| Custom TailwindCSS-like design system (vanilla CSS) | ✅ Rich `globals.css` with tokens, glass UI |
| Landing page with hero, stats, and feature cards | ✅ Complete and polished |
| Navigation bar (`Navbar.tsx`) | ✅ Implemented |
| `PolicyCard.tsx` component | ✅ Shows premium, IDV, claim ratio, add-ons |
| `ChatBubble.tsx` component | ✅ Present |
| `LoadingSpinner.tsx` component | ✅ Present |
| `Badge.tsx` component | ✅ Present |
| Policy Recommendation Form (`/recommend`) | ✅ Connects to backend API; renders results |
| Policy Comparison Browser (`/compare`) | ✅ Loads all policies; filter controls implemented |
| Side-by-side comparison modal | ✅ Compares premium, IDV, claim ratio, add-ons |
| Responsive layout (grid/flex, `container-main`) | ✅ Implemented |
| Frontend API client (`lib/api.ts`) | ✅ `getPolicies`, `getRecommendations` wired |
| TypeScript types (`lib/types.ts`) | ✅ `Policy`, `PolicyFilter`, `RecommendationRequest` |

---

## 2. ⚠️ Partially Implemented Features

### 2.1 AI Insurance Assistant (`/chat`)
- **What exists**: A full front-end chat UI (`ChatBubble`, input bar, loading indicator, quick-topic chips).
- **What is missing**: No real AI. The `sendMessage` function calls a local `generateStubResponse()` function with 5 hardcoded keyword matches (IDV, NCB, Zero Dep, Comprehensive, Third-Party). All other queries return a generic "coming in Phase 5" message.
- **Root cause**: `backend/ai/` directory contains only an empty `__init__.py`. No AI service, no LLM API call exists.
- **Required by**: PRD §8.1, SRS §3.1, SRS FR-1, FR-2, FR-6

### 2.2 Policy Comparison Tool
- **What exists**: A policy browser with filters + side-by-side comparison table for 2 policies.
- **What is missing**:
  - No `POST /api/compare` backend endpoint (SRS §4.2 / TRD §11 define this).
  - Comparison is done entirely on the frontend with pre-fetched data.
  - No `/compare/[id]` dedicated page (a `[id]` directory exists but its purpose is unclear without content).
- **Required by**: PRD §8.3, SRS §3.4, TRD §11

### 2.3 Policy Recommendation Intelligence
- **What exists**: Rule-based filtering by budget range and coverage type.
- **What is missing**:
  - No car-model-aware ranking (car model is accepted as input but not used in the filter logic in `recommendation_service.py`).
  - No city-aware filtering (city is accepted + logged but not used to filter/rank results).
  - Coverage preference filtering is present but basic — no scoring or ranking system.
- **Required by**: PRD §8.2, SRS §3.3

### 2.4 Insurance Term Explainer
- **What exists**: 5 hardcoded term definitions embedded inside the chat stub function.
- **What is missing**: No dedicated search UI, no `/terms` page, no database table, no backend endpoint for term lookup.
- **Required by**: PRD §8.4, SRS §3.2

### 2.5 Claim Scenario Guidance
- **What exists**: Chat UI can receive claim questions; hardcoded stub handles none of them (generic fallback only).
- **What is missing**: No claim-specific logic, no `claim_scenarios` in data, no backend endpoint.
- **Required by**: PRD §8.5, SRS §3.5

### 2.6 Database Schema — Missing Tables
- **What exists**: `insurance_policies`, `user_recommendation_requests`, `users` tables.
- **What is missing**:
  - `policy_addons` table (TRD §10) — add-ons are stored as a JSON blob instead of a relational table
  - `policy_features` table (TRD §10) — not implemented
  - `user_queries` / `query_log` table — `query_log.py` model exists but no endpoint persists AI queries
  - `insurance_companies` master table (TRD §10) — not a separate table; insurer_name is a string column

---

## 3. ❌ Missing Features

Features fully defined in documentation but **not implemented at all**.

| # | Feature | Required by | Notes |
|---|---------|-------------|-------|
| M-1 | `POST /api/ask` — AI query endpoint | TRD §11, SRS §4.2 | No route exists; `ai/` is empty |
| M-2 | `POST /api/compare` — backend compare endpoint | TRD §11, SRS §4.2 | Comparison is client-side only |
| M-3 | Insurance Term Explainer page (`/terms`) | PRD §8.4, SRS §3.2 | No page, no endpoint, no data |
| M-4 | Claim Scenario Guidance (functional) | PRD §8.5, SRS §3.5 | Completely absent beyond chat stub |
| M-5 | `insurance_companies` master table | TRD §10 | Merged into policy record as a string |
| M-6 | `policy_features` relational table | TRD §10 | Not implemented |
| M-7 | Input validation / rate limiting on AI endpoint | TRD §13 | No AI endpoint to protect yet |
| M-8 | Seed data / policy seeder script | Phase 2 workflow | `data/` and `scripts/` dirs exist but appear empty |
| M-9 | User authentication / session management | SRS §2.3, TRD §13 | `users.py` model exists; no auth (JWT/session) |
| M-10 | `GET /api/policy/{id}` detailed page in frontend | PRD §8.3 user journey Step 6 | PolicyCard links exist but no detail page renders |

---

## 4. 🔍 Misaligned Implementations

Features that exist but deviate from what the documentation specifies.

| # | Item | Document Says | Actual Implementation | Risk |
|---|------|---------------|-----------------------|------|
| A-1 | Styling framework | TRD §4: **TailwindCSS + Shadcn UI** | Vanilla CSS custom design system; no Shadcn | Low — UI is functional and polished, but TRD specifies Tailwind specifically |
| A-2 | `POST /api/compare` endpoint | TRD §11, SRS §4.2: server-side comparison | Comparison done client-side in a modal | Medium — fine for MVP but not aligned with TRD spec |
| A-3 | Recommendation ranking logic | SRS §3.3: "System filters and **ranks** policies" | Uses DB sort by `claim_settlement_ratio`; car model & city inputs are ignored in filtering | Medium — car model and city are collected but silently discarded |
| A-4 | API URL prefix | TRD §11 defines `/api/ask`, `/api/recommend` etc. | Actual routes are `/api/v1/recommendations`, `/api/v1/policies` | Low — v1 versioning is good practice but frontend must align |
| A-5 | Chat AI response time | PRD §11: under 3 seconds; TRD §14: 2–4s | Stub uses `setTimeout(800ms)` — no real AI latency measured | None currently; will be relevant in Phase 5 |

---

## 5. 📊 Coverage Summary

| Phase | Document Section | Coverage |
|-------|-----------------|----------|
| **Phase 1** — Project Init | Folder structure, frameworks, DB, env | **95%** — Only gap: no GitHub Actions/CI |
| **Phase 2** — Backend Core | API endpoints, DB models, services | **70%** — Missing: AI endpoint, compare endpoint, seed data, auth |
| **Phase 3** — Frontend | UI components, pages, API wiring | **65%** — Missing: AI chat integration, term explainer, claim guidance, policy detail page |
| **PRD Core Features (8.1–8.5)** | 5 features total | **2 partial / 3 incomplete** — only recommendation & comparison have real backend data |
| **SRS Functional Requirements (FR-1–FR-6)** | 6 requirements | **FR-3 ✅, FR-4 ⚠️, FR-1 ❌, FR-2 ❌, FR-5 ❌, FR-6 ❌** |
| **TRD API Endpoints** | 5 defined endpoints | **3 of 5 implemented** — `/api/ask` and `/api/compare` missing |

### Overall Phase 1–3 Completion: **~70%**

> The infrastructure and visual layer are strong. The critical gap is the **AI layer** (`/api/ask`, LLM integration), which is correctly deferred to Phase 5. However, several structural items (seed data, term explainer, policy detail page, compare endpoint) belong to Phase 2–3 scope and should be completed.

---

## 6. 🎯 Recommended Next Priorities (Before Phase 4)

Ordered by impact and dependencies:

### 🔴 High Priority — Must Do Before Phase 4

| # | Action | Reason |
|---|--------|--------|
| P-1 | **Create seed data / policy seeder script** | `scripts/` and `data/` dirs appear empty; without real data, the recommendation and compare features cannot be meaningfully tested or demonstrated |
| P-2 | **Fix recommendation engine — use car_model & city inputs** | Both fields are accepted, logged, but silently ignored in `recommendation_service.py`. This is a known gap in SRS §3.3 |
| P-3 | **Add `POST /api/compare` backend endpoint** | TRD §11 and SRS §4.2 both define this. Currently comparison is client-side only |
| P-4 | **Create `/policy/[id]` detail page in frontend** | The user journey in PRD §9 (Step 4–6) expects a detail view; PolicyCard has an id but no detail route renders |

### 🟡 Medium Priority — Recommended Before Phase 4

| # | Action | Reason |
|---|--------|--------|
| P-5 | **Add Insurance Term Explainer page `/terms`** | PRD §8.4 is a core MVP feature; a static or DB-backed term list would fulfill this without AI |
| P-6 | **Normalize `insurance_companies` into its own table** | TRD §10 schema specifies a separate table; current string column will create data duplication |
| P-7 | **Add `policy_features` relational table** | TRD §10 schema requirement; add-ons as JSON is a workaround |
| P-8 | **Implement basic session/user auth (JWT)** | TRD §13 requires API authentication; currently any client can create/delete policies |

### 🟢 Low Priority — Nice to Have

| # | Action | Reason |
|---|--------|--------|
| P-9 | Align styling with TRD (consider adding Shadcn/Tailwind) | Minor misalignment; current CSS works well |
| P-10 | Wire `user_queries` log model to an endpoint | Infrastructure for analytics is in place (`query_log.py`) but unused |
| P-11 | Add basic Prometheus/logging middleware | TRD §16 defines monitoring requirements |

---

> **Auditor Note**: The team has built a solid, well-structured foundation. The backend architecture is clean, the frontend is visually polished, and the rule-based pipeline for recommendations works end-to-end. The primary architectural gap — the AI layer — is correctly deferred. However, **seed data (P-1) and the car_model/city filtering fix (P-2) are the minimum requirements before Phase 4 makes sense**, since Phase 4 is about building the knowledge base that will feed the AI, which requires real policy data to be present and functional.
