"""
services/recommendation_service.py
------------------------------------
Rule-based recommendation engine (Phase 2).
In Phase 5 this service will be upgraded to use the RAG AI pipeline.

Logic:
  1. Map coverage_preference string → PolicyType enum
  2. Build PolicyFilter from user preferences
  3. Fetch matching policies via policy_service
  4. Log the request in UserRecommendationRequest table
  5. Return logged request id + matched policies
"""
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from models.policy import PolicyType
from models.recommendation import UserRecommendationRequest
from schemas.policy import PolicyFilter, PolicyRead
from schemas.recommendation import RecommendationRequest, RecommendationResponse
from services.policy_service import list_policies


# Mapping from human-readable strings to our PolicyType enum
_COVERAGE_MAP: dict[str, PolicyType] = {
    "comprehensive": PolicyType.COMPREHENSIVE,
    "third_party": PolicyType.THIRD_PARTY,
    "standalone_od": PolicyType.STANDALONE_OD,
}


async def get_recommendations(
    db: AsyncSession,
    request: RecommendationRequest,
) -> RecommendationResponse:
    """
    Generate policy recommendations based on user preferences.

    Steps:
      1. Translate coverage_preference string to PolicyType (if provided).
      2. Build PolicyFilter and fetch matching policies.
      3. Log the request in the DB for analytics.
      4. Return structured response.
    """
    # --- Build filter ---
    policy_type: Optional[PolicyType] = None
    if request.coverage_preference:
        policy_type = _COVERAGE_MAP.get(request.coverage_preference.lower())

    filters = PolicyFilter(
        policy_type=policy_type,
        budget_min=request.budget_min,
        budget_max=request.budget_max,
    )

    # --- Fetch matching policies (max 10 recommendations) ---
    matched_policies = await list_policies(db, filters=filters, limit=10)

    # --- Log the request ---
    policy_ids_str = ",".join(str(p.id) for p in matched_policies)
    log_entry = UserRecommendationRequest(
        session_id=request.session_id,
        car_model=request.car_model,
        city=request.city,
        budget_min=request.budget_min,
        budget_max=request.budget_max,
        coverage_preference=request.coverage_preference,
        recommended_policy_ids=policy_ids_str,
    )
    db.add(log_entry)
    await db.flush()
    await db.refresh(log_entry)

    # --- Serialize ---
    policies_read = [PolicyRead.model_validate(p) for p in matched_policies]

    return RecommendationResponse(
        request_id=log_entry.id,
        total_matches=len(policies_read),
        policies=policies_read,
        message=(
            f"Found {len(policies_read)} matching policies."
            if policies_read
            else "No policies matched your criteria. Try broadening your budget or coverage preference."
        ),
    )
