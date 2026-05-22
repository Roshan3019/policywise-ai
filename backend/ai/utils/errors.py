"""
ai/utils/errors.py
------------------
Custom exception classes for the AI module.
"""


class AIError(Exception):
    """Base exception for AI module errors."""
    pass


class DocumentLoadError(AIError):
    """Raised when document loading fails."""
    pass


class EmbeddingError(AIError):
    """Raised when embedding generation fails."""
    pass


class VectorStoreError(AIError):
    """Raised when vector store operations fail."""
    pass


class RetrievalError(AIError):
    """Raised when retrieval fails."""
    pass


class LLMError(AIError):
    """Raised when LLM operations fail."""
    pass