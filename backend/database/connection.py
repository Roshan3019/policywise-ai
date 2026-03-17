"""
database/connection.py
----------------------
Async SQLAlchemy engine + session factory.

Provides:
  - `engine`               — shared async engine instance
  - `AsyncSessionLocal`    — session factory (used by get_db)
  - `get_db()`             — FastAPI dependency that yields an AsyncSession
  - `create_all_tables()`  — called at app startup to create tables
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from database.base import Base
from utils.config import get_settings

settings = get_settings()

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
engine = create_async_engine(
    settings.database_async_url,
    echo=settings.debug,
    pool_size=10,
    max_overflow=20,
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# FastAPI dependency — yields an async DB session per request
# ---------------------------------------------------------------------------
async def get_db() -> AsyncSession:
    """
    Dependency-injected database session.
    Usage in routes:
        async def my_route(db: AsyncSession = Depends(get_db)): ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


# ---------------------------------------------------------------------------
# Startup helper
# ---------------------------------------------------------------------------
async def create_all_tables() -> None:
    """
    Create all ORM-defined tables that do not yet exist in the database.
    Called during the app lifespan startup.
    NOTE: In production, prefer Alembic migrations over this function.
    """
    # Import all models so Base.metadata is populated
    import models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
