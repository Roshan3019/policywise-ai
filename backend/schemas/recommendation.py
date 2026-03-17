"""
schemas/recommendation.py
-------------------------
Pydantic v2 schemas for the recommendation engine.
"""
from typing import List, Optional

from pydantic import BaseModel, Field

from schemas.policy import PolicyRead


# ---------------------------------------------------------------------------
# Input schema
# ---------------------------------------------------------------------------

class RecommendationRequest(BaseModel):
    """
    User preference inputs submitted to the recommendation engine.
    All fields are optional so users can submit partial preferences.
    """
    car_model: Optional[str] = Field(None, description="e.g. 'Maruti Swift', 'Honda City'")
    city: Optional[str] = Field(None, description="City of registration")
    budget_min: Optional[float] = Field(None, gt=0, description="Minimum annual premium (₹)")
    budget_max: Optional[float] = Field(None, gt=0, description="Maximum annual premium (₹)")
    coverage_preference: Optional[str] = Field(
        None,
        description="'comprehensive', 'third_party', or 'standalone_od'"
    )
    session_id: Optional[str] = Field(None, description="Client session identifier for tracking")


# ---------------------------------------------------------------------------
# Output schema
# ---------------------------------------------------------------------------

class RecommendationResponse(BaseModel):
    """Response from the recommendation engine."""
    request_id: int = Field(..., description="ID of logged recommendation request")
    total_matches: int
    policies: List[PolicyRead]
    message: str = "Recommendations generated successfully"
