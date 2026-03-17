"""
models/query_log.py
-------------------
AIQueryLog ORM model.
Persists every AI chat interaction for audit, debugging, and
future fine-tuning. The AI response field is populated in Phase 5
when the RAG pipeline is connected.
"""
from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from database.base import Base


class AIQueryLog(Base):
    """Stores user questions and AI-generated responses."""
    __tablename__ = "ai_query_logs"

    id = Column(Integer, primary_key=True, index=True)

    # --- Session context ---
    session_id = Column(String(64), nullable=True, index=True)

    # --- Interaction ---
    user_query = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=True)   # Null until Phase 5 AI wired

    # --- Source context used by RAG (populated in Phase 5) ---
    retrieved_sources = Column(Text, nullable=True)  # JSON list of source chunks

    # --- Timestamps ---
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    def __repr__(self) -> str:
        return f"<AIQueryLog id={self.id} query={self.user_query[:40]!r}>"
