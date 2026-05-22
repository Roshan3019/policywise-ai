"""
ai/chunking/__init__.py
----------------------
Document chunking module.
"""
from ai.chunking.text_chunker import split_documents, TextChunker

__all__ = ["split_documents", "TextChunker"]