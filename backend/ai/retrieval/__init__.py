"""
ai/retrieval/__init__.py
-----------------------
Retrieval module for finding relevant document chunks.
"""
from ai.retrieval.retriever import (
    retrieve_relevant_context,
    Retriever,
    RetrievedChunk,
    format_context,
)

__all__ = ["retrieve_relevant_context", "Retriever", "RetrievedChunk", "format_context"]