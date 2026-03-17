"""
services/policy_service.py
--------------------------
Business logic for InsurancePolicy CRUD and filtering.
Filtering is used both by the list-policies endpoint and the
recommendation engine, so all filter logic lives here in one place.
"""
from typing import List, Optional, Sequence

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.policy import InsurancePolicy, PolicyType
from schemas.policy import PolicyCreate, PolicyFilter, PolicyUpdate


async def create_policy(db: AsyncSession, payload: PolicyCreate) -> InsurancePolicy:
    """Add a new insurance policy to the database."""
    policy = InsurancePolicy(**payload.model_dump())
    db.add(policy)
    await db.flush()
    await db.refresh(policy)
    return policy


async def get_policy_by_id(db: AsyncSession, policy_id: int) -> InsurancePolicy:
    """Fetch a single policy by PK. Raises 404 if not found."""
    policy = await db.get(InsurancePolicy, policy_id)
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy {policy_id} not found.",
        )
    return policy


async def list_policies(
    db: AsyncSession,
    filters: Optional[PolicyFilter] = None,
    skip: int = 0,
    limit: int = 20,
) -> Sequence[InsurancePolicy]:
    """
    Return policies with optional filtering.
    Filters applied:
      - policy_type     : exact match
      - insurer_name    : case-insensitive contains
      - budget_min/max  : policy.premium_min >= budget_min
                          policy.premium_max <= budget_max
      - min_coverage    : policy.coverage_amount >= min_coverage
      - min_claim_ratio : policy.claim_settlement_ratio >= min_claim_ratio
    Only active policies are returned.
    """
    stmt = select(InsurancePolicy).where(InsurancePolicy.is_active.is_(True))

    if filters:
        if filters.policy_type:
            stmt = stmt.where(InsurancePolicy.policy_type == filters.policy_type)

        if filters.insurer_name:
            stmt = stmt.where(
                InsurancePolicy.insurer_name.ilike(f"%{filters.insurer_name}%")
            )

        if filters.budget_min is not None:
            stmt = stmt.where(InsurancePolicy.premium_min >= filters.budget_min)

        if filters.budget_max is not None:
            stmt = stmt.where(InsurancePolicy.premium_max <= filters.budget_max)

        if filters.min_coverage is not None:
            stmt = stmt.where(InsurancePolicy.coverage_amount >= filters.min_coverage)

        if filters.min_claim_ratio is not None:
            stmt = stmt.where(
                InsurancePolicy.claim_settlement_ratio >= filters.min_claim_ratio
            )

    stmt = (
        stmt.order_by(InsurancePolicy.claim_settlement_ratio.desc().nullslast())
        .offset(skip)
        .limit(limit)
    )

    result = await db.execute(stmt)
    return result.scalars().all()


async def update_policy(
    db: AsyncSession, policy_id: int, payload: PolicyUpdate
) -> InsurancePolicy:
    """Partially update a policy."""
    policy = await get_policy_by_id(db, policy_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(policy, field, value)
    await db.flush()
    await db.refresh(policy)
    return policy


async def delete_policy(db: AsyncSession, policy_id: int) -> dict:
    """Soft-delete: set is_active = False."""
    policy = await get_policy_by_id(db, policy_id)
    policy.is_active = False
    await db.flush()
    return {"detail": f"Policy {policy_id} deactivated successfully."}
