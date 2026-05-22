"""
ai/retrieval/retriever.py
-----------------------
Semantic similarity search retrieval system.
"""
from dataclasses import dataclass
from typing import Any

from ai.vectorstore.chroma_store import similarity_search
from ai.utils.logging import logger


@dataclass
class RetrievedChunk:
    """A retrieved chunk with metadata and score."""
    text: str
    source: str
    page: int
    score: float


class Retriever:
    """Retrieves relevant document chunks for a query."""
    
    def __init__(self, top_k: int = 5):
        self.top_k = top_k
    
    def retrieve(self, query: str, top_k: int | None = None) -> list[RetrievedChunk]:
        """
        Retrieve relevant chunks for a query.
        
        Args:
            query: The user's question.
            top_k: Number of results to return (overrides default).
            
        Returns:
            List of RetrievedChunk objects.
        """
        k = top_k or self.top_k
        results = similarity_search(query, top_k=k)
        
        chunks = []
        for text, meta, score in results:
            chunks.append(RetrievedChunk(
                text=text,
                source=meta.get("source", "unknown"),
                page=int(meta.get("page", 0)),
                score=score,
            ))
        
        return chunks


def format_context(chunks: list[RetrievedChunk]) -> str:
    """Format retrieved chunks as context string."""
    if not chunks:
        return "No specific policy documents were found for this query."
    parts = []
    for i, chunk in enumerate(chunks, start=1):
        citation = f"[Source: {chunk.source}, Page {chunk.page}]"
        parts.append(f"--- EXCERPT {i} {citation} ---\n{chunk.text}")
    return "\n\n".join(parts)


def retrieve_relevant_context(
    query: str,
    top_k: int = 5,
    retriever: Retriever | None = None,
) -> list[RetrievedChunk]:
    """
    Retrieve relevant context chunks for a query.
    
    Args:
        query: The user's question.
        top_k: Number of results to return.
        retriever: Optional Retriever instance (creates default if None).
        
    Returns:
        List of RetrievedChunk objects.
    """
    r = retriever or Retriever(top_k=top_k)
    return r.retrieve(query, top_k=top_k)