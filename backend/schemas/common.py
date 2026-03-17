"""
schemas/common.py
-----------------
Shared Pydantic schemas used across the API:
  - APIResponse[T]     — standard JSON envelope for all responses
  - PaginationParams   — query-param model for skip/limit pagination
"""
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standard API response wrapper.
    Every endpoint returns this structure for consistency.

    Example:
        {
            "success": true,
            "message": "Policy created successfully",
            "data": { ... }
        }
    """
    success: bool = True
    message: str = "OK"
    data: Optional[T] = None


class PaginationParams(BaseModel):
    """Common pagination query parameters."""
    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(default=20, ge=1, le=100, description="Max records to return")
