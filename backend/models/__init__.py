"""
models/__init__.py
------------------
Re-exports all ORM models so that:
  1. Alembic autogenerate can detect every table in one import.
  2. Application code can do: `from models import User, InsurancePolicy, ...`
"""
from models.user import User
from models.policy import InsurancePolicy, PolicyType
from models.recommendation import UserRecommendationRequest
from models.query_log import AIQueryLog

__all__ = [
    "User",
    "InsurancePolicy",
    "PolicyType",
    "UserRecommendationRequest",
    "AIQueryLog",
]
