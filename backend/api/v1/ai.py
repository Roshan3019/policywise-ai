"""
api/v1/ai.py
------------
AI Insurance Advisor API endpoint.
"""
from fastapi import APIRouter, HTTPException
from loguru import logger

from ai.pipelines.rag_pipeline import ask_insurance_ai, RAGResponse
from schemas.ai import AIQuestionRequest, AIAnswerResponse, SourceCitation

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/ask", response_model=AIAnswerResponse)
async def ask_ai(request: AIQuestionRequest) -> AIAnswerResponse:
    """
    Ask an insurance question and get an AI-powered answer.
    
    The response is grounded in ingested policy documents stored in ChromaDB.
    """
    logger.info(f"AI question: {request.question[:80]}...")
    
    try:
        result: RAGResponse = ask_insurance_ai(
            query=request.question,
            top_k=request.top_k,
        )
        
        logger.info(
            f"AI answered | chunks={result.retrieved_chunks} fallback={result.fallback}"
        )
        
        return AIAnswerResponse(
            answer=result.answer,
            sources=[SourceCitation(**s) for s in result.sources],
            retrieved_chunks=result.retrieved_chunks,
            fallback=result.fallback,
        )
    
    except Exception as e:
        logger.error(f"AI pipeline error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"AI pipeline error: {str(e)}",
        )