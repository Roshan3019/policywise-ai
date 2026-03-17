"""
api/v1/__init__.py
------------------
Aggregates all v1 routers into a single `v1_router` instance.
Add new feature routers here as the project grows.
"""
from fastapi import APIRouter

from api.v1.health import router as health_router
from api.v1.users import router as users_router
from api.v1.policies import router as policies_router
from api.v1.recommendations import router as recommendations_router

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(health_router)
v1_router.include_router(users_router)
v1_router.include_router(policies_router)
v1_router.include_router(recommendations_router)
