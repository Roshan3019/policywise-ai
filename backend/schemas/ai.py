"""
schemas/ai.py
-------------
Pydantic schemas for AI endpoints.
"""
from typing import Any

from pydantic import BaseModel, Field


class AIQuestionRequest(BaseModel):
    """Request schema for AI questions."""
    question: str = Field(
        ...,
        min_length=2,
        max_length=2000,
        description="User's insurance question",
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=10,
        description="Number of context chunks to retrieve",
    )


class SourceCitation(BaseModel):
    """Source citation in AI response."""
    source: str
    page: int
    score: float


class AIAnswerResponse(BaseModel):
    """Response schema for AI answers."""
    answer: str
    sources: list[SourceCitation] = Field(default_factory=list)
    retrieved_chunks: int = 0
    fallback: bool = False