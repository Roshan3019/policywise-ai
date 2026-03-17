# schemas/__init__.py
# Re-exports all schemas for convenient imports.

from schemas.common import APIResponse, PaginationParams
from schemas.user import UserCreate, UserRead, UserUpdate
from schemas.policy import PolicyCreate, PolicyFilter, PolicyRead, PolicyUpdate
from schemas.recommendation import RecommendationRequest, RecommendationResponse

__all__ = [
    "APIResponse", "PaginationParams",
    "UserCreate", "UserRead", "UserUpdate",
    "PolicyCreate", "PolicyFilter", "PolicyRead", "PolicyUpdate",
    "RecommendationRequest", "RecommendationResponse",
]
