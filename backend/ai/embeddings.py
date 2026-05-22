"""
ai/embeddings.py
----------------
Embeds DocumentChunks and stores them in ChromaDB.

Uses HuggingFace sentence-transformers/all-MiniLM-L6-v2:
  - 100% FREE — no API key required
  - Runs locally
  - 384-dimensional embeddings
"""
import hashlib
import json
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

from ai.pdf_ingestion import DocumentChunk
from utils.config import get_settings

COLLECTION_NAME = "policywise_knowledge"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Singleton so we don't reload the model for every call
_model: SentenceTransformer | None = None


def get_embedder() -> SentenceTransformer:
    """Return (or create) a singleton SentenceTransformer embedder."""
    global _model
    if _model is None:
        print(f"  🧠 Loading embedding model: {EMBEDDING_MODEL}")
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a list of strings and return a list of float vectors."""
    model = get_embedder()
    return model.encode(texts, normalize_embeddings=True).tolist()


def _chunk_id(chunk: DocumentChunk) -> str:
    """Stable, deterministic ID — re-ingestion is idempotent."""
    payload = chunk.text + json.dumps(chunk.metadata, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()[:32]


def get_chroma_client() -> chromadb.PersistentClient:
    settings = get_settings()
    db_path = Path(settings.vector_db_path).resolve()
    db_path.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(db_path))


def get_collection() -> chromadb.Collection:
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def embed_and_store(chunks: list[DocumentChunk], batch_size: int = 50) -> int:
    """
    Embed chunks with HuggingFace and upsert into ChromaDB.
    Returns the number of chunks stored.
    """
    if not chunks:
        return 0

    embedder = get_embedder()
    collection = get_collection()
    stored = 0

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i: i + batch_size]
        texts = [c.text for c in batch]
        ids = [_chunk_id(c) for c in batch]
        metadatas = [c.metadata for c in batch]

        print(f"  🔢 Embedding batch {i // batch_size + 1} ({len(batch)} chunks)...")
        embeddings = embed_texts(texts)

        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )
        stored += len(batch)

    return stored


def collection_stats() -> dict:
    collection = get_collection()
    return {"name": COLLECTION_NAME, "total_chunks": collection.count()}