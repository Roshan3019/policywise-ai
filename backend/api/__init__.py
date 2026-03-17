# api/__init__.py
# Re-exports v1_router for use in main.py.

from api.v1 import v1_router

__all__ = ["v1_router"]
