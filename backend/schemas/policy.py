"""
schemas/policy.py
-----------------
Pydantic v2 schemas for InsurancePolicy CRUD and filtering.
"""
from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field

from models.policy import PolicyType


# ---------------------------------------------------------------------------
# Input schemas
# ---------------------------------------------------------------------------

class PolicyCreate(BaseModel):
    """Payload to add a new insurance policy."""
    name: str = Field(..., min_length=1, max_length=200)
    insurer_name: str = Field(..., min_length=1, max_length=100)
    policy_type: PolicyType
    premium_min: float = Field(..., gt=0, description="Minimum annual premium (₹)")
    premium_max: float = Field(..., gt=0, description="Maximum annual premium (₹)")
    coverage_amount: float = Field(..., gt=0, description="IDV / sum insured (₹)")
    claim_settlement_ratio: Optional[float] = Field(
        None, ge=0, le=100, description="Claim settlement % (0–100)"
    )
    add_ons: Optional[List[str]] = Field(None, description="List of available add-on names")
    description: Optional[str] = None


class PolicyUpdate(BaseModel):
    """Partial update payload — all fields optional."""
    name: Optional[str] = Field(None, max_length=200)
    insurer_name: Optional[str] = Field(None, max_length=100)
    policy_type: Optional[PolicyType] = None
    premium_min: Optional[float] = Field(None, gt=0)
    premium_max: Optional[float] = Field(None, gt=0)
    coverage_amount: Optional[float] = Field(None, gt=0)
    claim_settlement_ratio: Optional[float] = Field(None, ge=0, le=100)
    add_ons: Optional[List[str]] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class PolicyFilter(BaseModel):
    """
    Query filters for the list-policies endpoint.
    All fields are optional; omitting a field means 'no filter'.
    """
    policy_type: Optional[PolicyType] = None
    insurer_name: Optional[str] = None
    budget_min: Optional[float] = Field(None, gt=0, description="Min premium the user can pay")
    budget_max: Optional[float] = Field(None, gt=0, description="Max premium the user can pay")
    min_coverage: Optional[float] = Field(None, gt=0, description="Minimum IDV required")
    min_claim_ratio: Optional[float] = Field(None, ge=0, le=100)


# ---------------------------------------------------------------------------
# Output schemas
# ---------------------------------------------------------------------------

class PolicyRead(BaseModel):
    """Insurance policy data as returned by the API."""
    id: int
    name: str
    insurer_name: str
    policy_type: PolicyType
    premium_min: float
    premium_max: float
    coverage_amount: float
    claim_settlement_ratio: Optional[float]
    add_ons: Optional[Any]
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
