"""
models/policy.py
----------------
InsurancePolicy ORM model.
Stores car insurance policy master data that will be compared
and recommended to users via the AI layer (Phase 5).
"""
import enum
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float,
    Integer, String, Text, JSON
)
from sqlalchemy.sql import func

from database.base import Base


class PolicyType(str, enum.Enum):
    """Car insurance policy categories."""
    COMPREHENSIVE = "comprehensive"          # Own damage + third-party
    THIRD_PARTY = "third_party"             # Only third-party liability
    STANDALONE_OD = "standalone_od"         # Only own damage


class InsurancePolicy(Base):
    """
    Master table of insurance policies.
    Populated via admin API or seeder scripts.
    """
    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, index=True)

    # --- Identity ---
    name = Column(String(200), nullable=False, index=True)
    insurer_name = Column(String(100), nullable=False, index=True)
    policy_type = Column(
        Enum(PolicyType, name="policy_type_enum"),
        nullable=False,
        index=True
    )

    # --- Financial ---
    premium_min = Column(Float, nullable=False)   # Annual premium lower bound (₹)
    premium_max = Column(Float, nullable=False)   # Annual premium upper bound (₹)
    coverage_amount = Column(Float, nullable=False)  # IDV / sum insured (₹)

    # --- Quality indicators ---
    claim_settlement_ratio = Column(Float, nullable=True)  # 0–100 %

    # --- Extra details ---
    add_ons = Column(JSON, nullable=True)       # List of add-on names
    description = Column(Text, nullable=True)

    # --- Status ---
    is_active = Column(Boolean, default=True, nullable=False)

    # --- Timestamps ---
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    def __repr__(self) -> str:
        return f"<InsurancePolicy id={self.id} name={self.name!r}>"
