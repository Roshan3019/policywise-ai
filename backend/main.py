"""
main.py
-------
PolicyWise AI — FastAPI application entry point.

Startup sequence:
  1. Load settings from .env
  2. Create all DB tables (idempotent — skips if already exist)
  3. Pre-warm Ollama LLM (if using local model)
  4. Mount all API v1 routers
  5. Start the server

Production tip: use Alembic migrations (not create_all_tables)
for schema changes in production deployments.
"""
import os

# Disable Chroma telemetry before any imports
os.environ["CHROMA_DISABLE_TELEMETRY"] = "true"

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from api import v1_router
from database.connection import create_all_tables
from utils.config import get_settings

settings = get_settings()


async def warmup_llm():
    """Pre-warm the LLM service on startup (especially for Ollama)."""
    try:
        from ai.services.llm_service import LLMService
        logger.info("[Warmup] Pre-loading LLM model...")
        LLMService()
        logger.info("[Warmup] LLM service ready")
    except Exception as e:
        logger.warning(f"[Warmup] Could not pre-load LLM: {e}")


# ---------------------------------------------------------------------------
# Lifespan — runs once on startup and once on shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: create tables on startup, clean up on shutdown."""
    logger.info(f"[Start] Starting {settings.app_name} v{settings.app_version}")
    await create_all_tables()
    logger.info("[Ready] Database tables ready")
    await warmup_llm()
    yield
    logger.info("[Stop] Shutting down PolicyWise AI")


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "PolicyWise AI — Intelligent Car Insurance Analysis & Recommendation System. "
        "Provides CRUD for users and policies, plus a rule-based recommendation engine."
    ),
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow local frontend (Next.js on port 3000) during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(v1_router)


# ---------------------------------------------------------------------------
# Dev entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
