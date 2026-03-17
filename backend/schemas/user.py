"""
schemas/user.py
---------------
Pydantic v2 schemas for the User entity.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------------------------------------------------------------------------
# Input schemas
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    """Payload to create a new user account."""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6, description="Plain-text password (will be hashed)")


class UserUpdate(BaseModel):
    """Payload to partially update an existing user. All fields are optional."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    password: Optional[str] = Field(None, min_length=6)
    is_active: Optional[bool] = None


# ---------------------------------------------------------------------------
# Output schemas
# ---------------------------------------------------------------------------

class UserRead(BaseModel):
    """User data returned by API — never exposes hashed_password."""
    id: int
    email: EmailStr
    name: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}   # allows ORM → Pydantic conversion
