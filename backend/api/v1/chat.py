"""
api/v1/chat.py
--------------
POST /api/v1/chat — Real LLM Chat Endpoint

Accepts a user question, runs it through the RAG pipeline,
and returns a grounded answer with source citations.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from loguru import logger

from ai.rag_chain import answer_question, RAGResponse

router = APIRouter(prefix="/chat", tags=["AI Chat"])


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=2, max_length=2000, description="User's insurance question")
    top_k: int = Field(default=5, ge=1, le=10, description="Number of context chunks to retrieve")


class SourceCitation(BaseModel):
    source: str
    page: int
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceCitation]
    retrieved_count: int
    fallback: bool


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Ask a car insurance question and get an AI-powered answer.

    The response is grounded in ingested policy documents (PDFs) from
    Indian insurers (Bajaj Allianz, HDFC ERGO, etc.) stored in ChromaDB.
    """
    logger.info(f"Chat question received: {request.question[:80]}...")

    try:
        result: RAGResponse = answer_question(
            question=request.question,
            top_k=request.top_k,
        )

        logger.info(
            f"Chat answered | retrieved={result.retrieved_count} "
            f"fallback={result.fallback} sources={[s['source'] for s in result.sources]}"
        )

        return ChatResponse(
            answer=result.answer,
            sources=[SourceCitation(**s) for s in result.sources],
            retrieved_count=result.retrieved_count,
            fallback=result.fallback,
        )

    except Exception as e:
        logger.error(f"Chat pipeline error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI pipeline error: {str(e)}"
        )
