"""
ai/rag_chain.py
---------------
RAG pipeline using OpenAI embeddings and GPT-4o-mini.
"""
from dataclasses import dataclass

from ai.pipelines.rag_pipeline import ask_insurance_ai as _ask_insurance_ai
from ai.retrieval.retriever import RetrievedChunk


@dataclass
class RAGResponse:
    answer: str
    sources: list[dict]
    retrieved_count: int
    fallback: bool = False


def answer_question(question: str, top_k: int = 5) -> RAGResponse:
    """Run the full RAG pipeline with OpenAI embeddings and GPT-4o-mini."""
    result = _ask_insurance_ai(question, top_k=top_k)
    return RAGResponse(
        answer=result.answer,
        sources=result.sources,
        retrieved_count=result.retrieved_chunks,
        fallback=result.fallback,
    )