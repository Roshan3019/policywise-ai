"""
ai/utils/__init__.py
------------------
Utility functions for the AI module.
"""
from ai.utils.logging import logger
from ai.utils.errors import (
    AIError,
    DocumentLoadError,
    EmbeddingError,
    VectorStoreError,
    RetrievalError,
    LLMError,
)

__all__ = [
    "logger",
    "AIError",
    "DocumentLoadError",
    "EmbeddingError",
    "VectorStoreError",
    "RetrievalError",
    "LLMError",
]