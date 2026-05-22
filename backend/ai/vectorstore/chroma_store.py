"""
ai/vectorstore/chroma_store.py
------------------------------
ChromaDB vector store implementation for storing and retrieving embeddings.
"""
import hashlib
import json
from pathlib import Path
from typing import Any

import chromadb

from ai.loaders.base import DocumentChunk
from ai.utils.logging import logger
from ai.utils.errors import VectorStoreError
from utils.config import get_settings


COLLECTION_NAME = "policywise_knowledge"


def _get_db_path() -> Path:
    """Get the vector database path."""
    settings = get_settings()
    db_path = Path(settings.vector_db_path).resolve()
    db_path.mkdir(parents=True, exist_ok=True)
    return db_path


def get_chroma_client() -> chromadb.PersistentClient:
    """Get or create the ChromaDB client."""
    return chromadb.PersistentClient(path=str(_get_db_path()))


def get_collection():
    """Get or create the main collection."""
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def _chunk_id(chunk: DocumentChunk) -> str:
    """Generate a stable, deterministic ID for a chunk."""
    payload = chunk.text + json.dumps(chunk.metadata, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()[:32]


def create_vector_store(
    chunks: list[DocumentChunk],
    batch_size: int = 50,
) -> int:
    """
    Create a vector store with embeddings.
    """
    if not chunks:
        return 0
    
    collection = get_collection()
    stored = 0
    
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        texts = [c.text for c in batch]
        ids = [_chunk_id(c) for c in batch]
        metadatas = [c.metadata for c in batch]
        
        logger.info(f"Embedding and storing batch {i // batch_size + 1} ({len(batch)} chunks)...")
        
        # Import here to avoid circular import
        from ai.embeddings import embed_texts
        embeddings = embed_texts(texts)
        
        collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )
        stored += len(batch)
    
    logger.info(f"Vector store created with {stored} chunks")
    return stored


def load_vector_store():
    """Load the existing vector store."""
    collection = get_collection()
    count = collection.count()
    logger.info(f"Loaded vector store with {count} chunks")
    return collection


def similarity_search(
    query: str,
    top_k: int = 5,
    filter_metadata: dict[str, Any] | None = None,
) -> list[tuple[str, dict[str, Any], float]]:
    """
    Perform similarity search on the vector store.
    
    Args:
        query: Search query text.
        top_k: Number of results to return.
        filter_metadata: Optional metadata filter.
        
    Returns:
        List of (text, metadata, score) tuples.
    """
    collection = get_collection()
    
    if collection.count() == 0:
        logger.warning("Vector store is empty")
        return []
    
    # Import here to avoid circular import
    from ai.embeddings import embed_texts
    query_embedding = embed_texts([query])[0]
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
        where=filter_metadata,
    )
    
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    
    output = []
    for doc, meta, dist in zip(docs, metas, distances):
        similarity = round(1.0 - float(dist), 4)
        output.append((doc, meta, similarity))
    
    logger.info(f"Retrieved {len(output)} chunks for query")
    return output


def collection_stats() -> dict:
    """Get collection statistics."""
    collection = get_collection()
    return {"name": COLLECTION_NAME, "total_chunks": collection.count()}


def embed_and_store(chunks: list[DocumentChunk], batch_size: int = 50) -> int:
    """
    Backward-compatible function: embed chunks and store in ChromaDB.
    """
    return create_vector_store(chunks, batch_size)


class VectorStore:
    """High-level vector store interface."""
    
    def __init__(self):
        self.collection = load_vector_store()
    
    def add_chunks(self, chunks: list[DocumentChunk]) -> int:
        """Add chunks to the vector store."""
        return create_vector_store(chunks)
    
    def search(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        """Search for similar chunks."""
        results = similarity_search(query, top_k)
        return [
            {"text": text, "metadata": meta, "score": score}
            for text, meta, score in results
        ]
    
    def count(self) -> int:
        """Get the number of chunks in the store."""
        return self.collection.count()