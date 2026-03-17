"""
api/v1/users.py
---------------
User CRUD endpoints.
Routes are intentionally thin — all business logic is in user_service.py.
"""
from typing import List

from fastapi import APIRouter, status

from database.deps import DBSession
from schemas.common import APIResponse
from schemas.user import UserCreate, UserRead, UserUpdate
from services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=APIResponse[UserRead], status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, db: DBSession):
    """Register a new user account."""
    user = await user_service.create_user(db, payload)
    return APIResponse(data=UserRead.model_validate(user), message="User created successfully.")


@router.get("/", response_model=APIResponse[List[UserRead]])
async def list_users(db: DBSession, skip: int = 0, limit: int = 20):
    """Return a paginated list of all users."""
    users = await user_service.list_users(db, skip=skip, limit=limit)
    return APIResponse(data=[UserRead.model_validate(u) for u in users])


@router.get("/{user_id}", response_model=APIResponse[UserRead])
async def get_user(user_id: int, db: DBSession):
    """Fetch a single user by ID."""
    user = await user_service.get_user_by_id(db, user_id)
    return APIResponse(data=UserRead.model_validate(user))


@router.patch("/{user_id}", response_model=APIResponse[UserRead])
async def update_user(user_id: int, payload: UserUpdate, db: DBSession):
    """Partially update user fields."""
    user = await user_service.update_user(db, user_id, payload)
    return APIResponse(data=UserRead.model_validate(user), message="User updated successfully.")


@router.delete("/{user_id}", response_model=APIResponse[dict])
async def delete_user(user_id: int, db: DBSession):
    """Soft-delete (deactivate) a user."""
    result = await user_service.delete_user(db, user_id)
    return APIResponse(data=result, message=result["detail"])
