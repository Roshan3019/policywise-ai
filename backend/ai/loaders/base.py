"""
ai/loaders/base.py
------------------
Base types for document loading.
"""
from dataclasses import dataclass, field
from typing import Any


@dataclass
class DocumentChunk:
    """A single text chunk ready for embedding."""
    text: str
    metadata: dict[str, Any] = field(default_factory=dict)