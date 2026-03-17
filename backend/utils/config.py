"""
utils/config.py
---------------
Centralised application settings loaded from .env via pydantic-settings.
All settings are typed and validated at startup.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── App ─────────────────────────────────────────────────────────────────
    app_name: str = "PolicyWise AI"
    app_version: str = "0.1.0"
    debug: bool = False

    # ── Database ─────────────────────────────────────────────────────────────
    database_url: str          # sync URL used by Alembic
    database_async_url: str    # async URL used by SQLAlchemy engine

    # ── Security ─────────────────────────────────────────────────────────────
    secret_key: str = "change-me-in-production-use-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # ── AI (wired in Phase 5) ─────────────────────────────────────────────────
    openai_api_key: str = ""
    vector_db_path: str = "../data/vector_store"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (reads .env once at startup)."""
    return Settings()