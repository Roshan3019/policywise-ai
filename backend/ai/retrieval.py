"""
ai/retrieval.py
---------------
Queries ChromaDB using HuggingFace embeddings to find relevant policy chunks.
"""
from dataclasses import dataclass

from ai.embeddings import embed_texts, get_collection


@dataclass
class RetrievedChunk:
    text: str
    source: str
    page: int
    score: float


def retrieve(query: str, top_k: int = 5) -> list[RetrievedChunk]:
    """
    Embed the user query (HuggingFace, free) and find top-k chunks in ChromaDB.
    """
    query_embedding = embed_texts([query])[0]

    collection = get_collection()
    if collection.count() == 0:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    chunks: list[RetrievedChunk] = []
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for doc, meta, dist in zip(docs, metas, distances):
        similarity = round(1.0 - float(dist), 4)
        chunks.append(RetrievedChunk(
            text=doc,
            source=meta.get("source", "unknown"),
            page=int(meta.get("page", 0)),
            score=similarity,
        ))

    return chunks


def format_context(chunks: list[RetrievedChunk]) -> str:
    if not chunks:
        return "No specific policy documents were found for this query."
    parts = []
    for i, chunk in enumerate(chunks, start=1):
        citation = f"[Source: {chunk.source}, Page {chunk.page}]"
        parts.append(f"--- EXCERPT {i} {citation} ---\n{chunk.text}")
    return "\n\n".join(parts)