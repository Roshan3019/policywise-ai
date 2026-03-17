"""
api/v1/policies.py
------------------
InsurancePolicy CRUD + filter endpoints.
Filtering query params are passed via request body on the GET list endpoint
(using POST /filter for richer filter payloads).
"""
from typing import List, Optional

from fastapi import APIRouter, Query, status

from database.deps import DBSession
from schemas.common import APIResponse
from schemas.policy import PolicyCreate, PolicyFilter, PolicyRead, PolicyUpdate
from services import policy_service

router = APIRouter(prefix="/policies", tags=["Policies"])


@router.post("/", response_model=APIResponse[PolicyRead], status_code=status.HTTP_201_CREATED)
async def create_policy(payload: PolicyCreate, db: DBSession):
    """Add a new insurance policy (admin / seed use)."""
    policy = await policy_service.create_policy(db, payload)
    return APIResponse(data=PolicyRead.model_validate(policy), message="Policy created successfully.")


@router.get("/", response_model=APIResponse[List[PolicyRead]])
async def list_policies(
    db: DBSession,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    policy_type: Optional[str] = Query(None, description="comprehensive | third_party | standalone_od"),
    insurer_name: Optional[str] = Query(None),
    budget_min: Optional[float] = Query(None, gt=0),
    budget_max: Optional[float] = Query(None, gt=0),
    min_coverage: Optional[float] = Query(None, gt=0),
    min_claim_ratio: Optional[float] = Query(None, ge=0, le=100),
):
    """
    List active insurance policies with optional filters.
    All filter params are optional — omit any to skip that filter.
    Results are sorted by claim_settlement_ratio (highest first).
    """
    filters = PolicyFilter(
        policy_type=policy_type,
        insurer_name=insurer_name,
        budget_min=budget_min,
        budget_max=budget_max,
        min_coverage=min_coverage,
        min_claim_ratio=min_claim_ratio,
    )
    policies = await policy_service.list_policies(db, filters=filters, skip=skip, limit=limit)
    return APIResponse(data=[PolicyRead.model_validate(p) for p in policies])


@router.get("/{policy_id}", response_model=APIResponse[PolicyRead])
async def get_policy(policy_id: int, db: DBSession):
    """Fetch a single insurance policy by ID."""
    policy = await policy_service.get_policy_by_id(db, policy_id)
    return APIResponse(data=PolicyRead.model_validate(policy))


@router.patch("/{policy_id}", response_model=APIResponse[PolicyRead])
async def update_policy(policy_id: int, payload: PolicyUpdate, db: DBSession):
    """Partially update an insurance policy."""
    policy = await policy_service.update_policy(db, policy_id, payload)
    return APIResponse(data=PolicyRead.model_validate(policy), message="Policy updated successfully.")


@router.delete("/{policy_id}", response_model=APIResponse[dict])
async def delete_policy(policy_id: int, db: DBSession):
    """Soft-delete (deactivate) a policy."""
    result = await policy_service.delete_policy(db, policy_id)
    return APIResponse(data=result, message=result["detail"])
