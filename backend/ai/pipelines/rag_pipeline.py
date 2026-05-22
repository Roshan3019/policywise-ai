"""
ai/pipelines/rag_pipeline.py
----------------------------
Complete RAG pipeline for answering insurance questions.
"""
from dataclasses import dataclass
from typing import Any

from ai.retrieval.retriever import RetrievedChunk, Retriever
from ai.services.llm_service import get_llm_service, LLMService
from ai.utils.logging import logger


@dataclass
class RAGResponse:
    """Response from the RAG pipeline."""
    answer: str
    sources: list[dict[str, Any]]
    retrieved_chunks: int
    fallback: bool = False


def ask_insurance_ai(
    query: str,
    top_k: int = 5,
) -> RAGResponse:
    """
    Ask the insurance AI a question using RAG.
    
    Args:
        query: The user's question.
        top_k: Number of context chunks to retrieve.
        
    Returns:
        RAGResponse with answer, sources, and metadata.
    """
    logger.info(f"Processing query: {query[:80]}...")
    
    # Step 1: Retrieve relevant chunks
    retriever = Retriever(top_k=top_k)
    chunks = retriever.retrieve(query)
    
    # Step 2: Generate response
    llm = get_llm_service()
    
    if not chunks:
        logger.warning("No relevant chunks found - using fallback")
        answer = llm.generate_response(
            f"No policy documents found. Answer this general car insurance question for an Indian user:\n\n{query}"
        )
        return RAGResponse(
            answer=answer,
            sources=[],
            retrieved_chunks=0,
            fallback=True,
        )
    
    answer = llm.generate_rag_response(query, chunks)
    
    # Step 3: Build sources
    sources = [
        {
            "source": chunk.source,
            "page": chunk.page,
            "score": chunk.score,
        }
        for chunk in chunks[:3]
    ]
    
    logger.info(f"Answered with {len(chunks)} retrieved chunks")
    
    return RAGResponse(
        answer=answer,
        sources=sources,
        retrieved_chunks=len(chunks),
        fallback=False,
    )