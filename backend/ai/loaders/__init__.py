"""
ai/loaders/__init__.py
---------------------
Document loaders for various file formats.
"""
from ai.loaders.document_loader import (
    load_all_documents,
    load_pdf_documents,
    load_text_documents,
    load_markdown_documents,
)
from ai.loaders.base import DocumentChunk

__all__ = [
    "load_all_documents",
    "load_pdf_documents",
    "load_text_documents",
    "load_markdown_documents",
    "DocumentChunk",
]