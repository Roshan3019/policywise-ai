"""
api/v1/recommendations.py
--------------------------
Recommendation endpoint — accepts user preferences and returns a
ranked list of matching insurance policies.

In Phase 2 this is rule-based. The AI upgrade happens in Phase 5.
"""
from fastapi import APIRouter, status

from database.deps import DBSession
from schemas.common import APIResponse
from schemas.recommendation import RecommendationRequest, RecommendationResponse
from services import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post(
    "/",
    response_model=APIResponse[RecommendationResponse],
    status_code=status.HTTP_200_OK,
)
async def recommend_policies(payload: RecommendationRequest, db: DBSession):
    """
    Submit user preferences and receive recommended insurance policies.

    Example input:
    ```json
    {
        "car_model": "Maruti Swift",
        "city": "Mumbai",
        "budget_min": 5000,
        "budget_max": 15000,
        "coverage_preference": "comprehensive"
    }
    ```
    """
    result = await recommendation_service.get_recommendations(db, payload)
    return APIResponse(
        data=result,
        message=result.message,
    )
