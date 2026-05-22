"""
ai/loaders/document_loader.py
----------------------------
Document loaders for PDF, TXT, and MD files using LangChain.
Supports recursive folder reading, metadata support, and source filename tracking.
"""
from pathlib import Path
from typing import Any

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)
from langchain_core.documents import Document

from ai.loaders.base import DocumentChunk
from ai.utils.logging import logger


def _langchain_doc_to_chunk(doc: Document, source: str) -> DocumentChunk:
    """Convert a LangChain Document to a DocumentChunk."""
    metadata = dict(doc.metadata)
    metadata["source"] = source
    return DocumentChunk(text=doc.page_content, metadata=metadata)


def load_pdf_documents(pdf_path: str | Path) -> list[DocumentChunk]:
    """
    Load a PDF file and return DocumentChunks.
    
    Args:
        pdf_path: Path to the PDF file.
        
    Returns:
        List of DocumentChunks with text and metadata.
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")
    
    loader = PyPDFLoader(str(pdf_path))
    docs = loader.load()
    
    chunks = []
    for i, doc in enumerate(docs):
        chunk = _langchain_doc_to_chunk(
            doc,
            source=pdf_path.stem,
        )
        chunk.metadata["page"] = i + 1
        chunk.metadata["file"] = pdf_path.name
        chunks.append(chunk)
    
    logger.info(f"Loaded {len(chunks)} chunks from PDF: {pdf_path.name}")
    return chunks


def load_text_documents(text_path: str | Path) -> list[DocumentChunk]:
    """
    Load a text file and return DocumentChunks.
    
    Args:
        text_path: Path to the text file.
        
    Returns:
        List of DocumentChunks with text and metadata.
    """
    text_path = Path(text_path)
    if not text_path.exists():
        raise FileNotFoundError(f"Text file not found: {text_path}")
    
    loader = TextLoader(str(text_path), encoding="utf-8")
    docs = loader.load()
    
    chunks = []
    for doc in docs:
        chunk = _langchain_doc_to_chunk(doc, source=text_path.stem)
        chunk.metadata["file"] = text_path.name
        chunks.append(chunk)
    
    logger.info(f"Loaded {len(chunks)} chunks from text file: {text_path.name}")
    return chunks


def load_markdown_documents(md_path: str | Path) -> list[DocumentChunk]:
    """
    Load a markdown file and return DocumentChunks.
    Uses TextLoader for markdown to avoid unstructured dependency.
    
    Args:
        md_path: Path to the markdown file.
        
    Returns:
        List of DocumentChunks with text and metadata.
    """
    md_path = Path(md_path)
    if not md_path.exists():
        raise FileNotFoundError(f"Markdown file not found: {md_path}")
    
    loader = TextLoader(str(md_path), encoding="utf-8")
    docs = loader.load()
    
    chunks = []
    for doc in docs:
        chunk = _langchain_doc_to_chunk(doc, source=md_path.stem)
        chunk.metadata["file"] = md_path.name
        chunks.append(chunk)
    
    logger.info(f"Loaded {len(chunks)} chunks from markdown file: {md_path.name}")
    return chunks


def load_all_documents(
    directory: str | Path,
    extensions: tuple[str, ...] = (".pdf", ".txt", ".md"),
) -> list[DocumentChunk]:
    """
    Recursively load all documents from a directory.
    
    Args:
        directory: Directory path to search for documents.
        extensions: Tuple of file extensions to load.
        
    Returns:
        Combined list of DocumentChunks from all files.
    """
    directory = Path(directory)
    if not directory.exists():
        raise FileNotFoundError(f"Directory not found: {directory}")
    
    all_chunks: list[DocumentChunk] = []
    
    for ext in extensions:
        for file_path in sorted(directory.rglob(f"*{ext}")):
            try:
                if ext == ".pdf":
                    chunks = load_pdf_documents(file_path)
                elif ext == ".txt":
                    chunks = load_text_documents(file_path)
                elif ext == ".md":
                    chunks = load_markdown_documents(file_path)
                else:
                    continue
                all_chunks.extend(chunks)
            except Exception as e:
                logger.error(f"Error loading {file_path.name}: {e}")
    
    logger.info(f"Total chunks loaded: {len(all_chunks)} from {directory}")
    return all_chunks