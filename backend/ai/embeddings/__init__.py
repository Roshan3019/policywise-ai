"""
ai/embeddings/__init__.py
-----------------------
Embedding generation module.
"""
from ai.embeddings.embedder import get_embedder, embed_texts, embed_chunks

__all__ = ["get_embedder", "embed_texts", "embed_chunks"]