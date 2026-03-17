"""
services/user_service.py
------------------------
Business logic for User CRUD operations.
All DB queries are async; no ORM logic leaks into the API layer.
"""
from typing import List, Optional, Sequence

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from schemas.user import UserCreate, UserUpdate
from utils.security import hash_password


async def create_user(db: AsyncSession, payload: UserCreate) -> User:
    """Create and persist a new user. Raises 409 if email already exists."""
    # Check for duplicate email
    existing = await db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email '{payload.email}' already exists.",
        )

    user = User(
        email=payload.email,
        name=payload.name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.flush()   # populate user.id without committing
    await db.refresh(user)
    return user


async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
    """Fetch a single user by PK. Raises 404 if not found."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found.",
        )
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    """Return a User or None — useful for auth checks."""
    return await db.scalar(select(User).where(User.email == email))


async def list_users(
    db: AsyncSession, skip: int = 0, limit: int = 20
) -> Sequence[User]:
    """Return a paginated list of all users."""
    result = await db.execute(
        select(User).order_by(User.id).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def update_user(
    db: AsyncSession, user_id: int, payload: UserUpdate
) -> User:
    """Partially update a user. Raises 404 if not found."""
    user = await get_user_by_id(db, user_id)

    update_data = payload.model_dump(exclude_unset=True)

    # Hash password if it was provided in the update
    if "password" in update_data:
        update_data["hashed_password"] = hash_password(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.flush()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user_id: int) -> dict:
    """Soft-delete: set is_active = False. Returns confirmation dict."""
    user = await get_user_by_id(db, user_id)
    user.is_active = False
    await db.flush()
    return {"detail": f"User {user_id} deactivated successfully."}
