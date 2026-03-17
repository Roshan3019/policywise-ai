"""
database/deps.py
----------------
Typed FastAPI dependency shortcuts for clean route signatures.

Usage in routes:
    from database.deps import DBSession
    async def my_route(db: DBSession): ...
"""
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.connection import get_db

# Annotated shorthand — saves repeating `Depends(get_db)` everywhere
DBSession = Annotated[AsyncSession, Depends(get_db)]
