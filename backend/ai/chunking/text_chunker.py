"""
ai/chunking/text_chunker.py
--------------------------
Intelligent document chunking system using LangChain's RecursiveCharacterTextSplitter.
"""
from typing import Any

from langchain_text_splitters import RecursiveCharacterTextSplitter
from ai.loaders.base import DocumentChunk
from ai.utils.logging import logger

# Default chunking parameters
DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 200


class TextChunker:
    """Text chunker using RecursiveCharacterTextSplitter."""
    
    def __init__(
        self,
        chunk_size: int = DEFAULT_CHUNK_SIZE,
        chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
        separators: list[str] | None = None,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", " ", ""]
        
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=self.separators,
            length_function=len,
        )
    
    def chunk_document(self, chunk: DocumentChunk) -> list[DocumentChunk]:
        """Split a single DocumentChunk into smaller chunks."""
        docs = self.splitter.create_documents(
            [chunk.text],
            metadatas=[chunk.metadata],
        )
        
        return [
            DocumentChunk(text=doc.page_content, metadata=dict(doc.metadata))
            for doc in docs
        ]


def split_documents(
    documents: list[DocumentChunk],
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[DocumentChunk]:
    """
    Split a list of DocumentChunks into smaller chunks.
    
    Args:
        documents: List of DocumentChunks to split.
        chunk_size: Target chunk size in characters.
        chunk_overlap: Overlap between chunks in characters.
        
    Returns:
        List of smaller DocumentChunks.
    """
    if not documents:
        return []
    
    chunker = TextChunker(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    total_chunks = []
    source_stats: dict[str, int] = {}
    
    for doc in documents:
        chunks = chunker.chunk_document(doc)
        
        # Track source statistics
        source = doc.metadata.get("source", "unknown")
        source_stats[source] = source_stats.get(source, 0) + len(chunks)
        
        for i, chunk in enumerate(chunks):
            chunk.metadata["chunk_index"] = i
        total_chunks.extend(chunks)
    
    logger.info(f"Split {len(documents)} documents into {len(total_chunks)} chunks")
    for source, count in source_stats.items():
        logger.info(f"  - {source}: {count} chunks")
    
    return total_chunks