"""
ai/pipelines/ingest_pipeline.py
-------------------------------
Complete ingestion pipeline for documents -> embeddings -> vector store.
"""
from pathlib import Path
from typing import Any

from ai.loaders.base import DocumentChunk
from ai.loaders.document_loader import load_all_documents
from ai.chunking.text_chunker import split_documents
from ai.vectorstore.chroma_store import create_vector_store
from ai.utils.logging import logger
from utils.config import get_settings


def run_ingestion(
    docs_path: str | Path | None = None,
    chunk_size: int = 1000,
    chunk_overlap: int = 200,
) -> dict[str, Any]:
    """
    Run the complete ingestion pipeline.
    
    Steps:
    1. Load documents from directory
    2. Chunk documents
    3. Generate embeddings
    4. Store in ChromaDB
    
    Args:
        docs_path: Path to insurance documents directory.
        chunk_size: Target chunk size in characters.
        chunk_overlap: Overlap between chunks.
        
    Returns:
        Dictionary with ingestion statistics.
    """
    settings = get_settings()
    
    if docs_path:
        docs_path = Path(docs_path)
    else:
        # Default to backend/data/insurance_docs relative to this file
        docs_path = Path(__file__).parent.parent.parent / "data" / "insurance_docs"
    
    logger.info(f"Starting ingestion from {docs_path}")
    
    # Step 1: Load documents
    logger.info("Step 1: Loading documents...")
    documents = load_all_documents(docs_path)
    logger.info(f"Loaded {len(documents)} documents")
    
    if not documents:
        logger.warning(f"No documents found in {docs_path}")
        return {"documents": 0, "chunks": 0, "stored": 0}
    
    # Step 2: Chunk documents
    logger.info("Step 2: Chunking documents...")
    chunks = split_documents(documents, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    logger.info(f"Created {len(chunks)} chunks")
    
    # Step 3 & 4: Embed and store
    logger.info("Step 3 & 4: Embedding and storing in ChromaDB...")
    stored = create_vector_store(chunks)
    
    logger.info(f"Ingestion complete: {stored} chunks stored")
    
    return {
        "documents": len(documents),
        "chunks": len(chunks),
        "stored": stored,
    }


if __name__ == "__main__":
    result = run_ingestion()
    print(f"\nIngestion Results:")
    print(f"  Documents loaded: {result['documents']}")
    print(f"  Chunks created: {result['chunks']}")
    print(f"  Chunks stored: {result['stored']}")