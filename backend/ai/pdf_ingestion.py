"""
ai/pdf_ingestion.py
-------------------
Extracts and chunks text from PDF files for embedding.

Uses PyMuPDF (fitz) for fast, high-quality text extraction from
insurance policy PDFs (Bajaj Allianz and others).
"""
import re
from pathlib import Path
from dataclasses import dataclass, field

import fitz  # PyMuPDF


@dataclass
class DocumentChunk:
    """A single text chunk ready for embedding."""
    text: str
    metadata: dict = field(default_factory=dict)


def _clean_text(raw: str) -> str:
    """Remove noise common in insurance PDF pages."""
    # Collapse multiple whitespace/newlines
    text = re.sub(r"\n{3,}", "\n\n", raw)
    text = re.sub(r"[ \t]+", " ", text)
    # Remove lone page numbers
    text = re.sub(r"^\s*\d+\s*$", "", text, flags=re.MULTILINE)
    # Remove common header/footer patterns
    text = re.sub(r"(?i)(bajaj allianz|policy document|page \d+|uin:.*?[\s\n])", " ", text)
    return text.strip()


def _split_into_chunks(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    """Split text into overlapping chunks by rough token count (1 word ≈ 1.3 tokens)."""
    words = text.split()
    char_limit = int(chunk_size * 4.5)  # approx chars per chunk
    overlap_chars = int(overlap * 4.5)

    chunks = []
    start = 0
    while start < len(text):
        end = start + char_limit
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        if end >= len(text):
            break
        start = end - overlap_chars  # back up for overlap

    return chunks


def extract_chunks_from_pdf(pdf_path: str | Path, source_name: str | None = None) -> list[DocumentChunk]:
    """
    Parse a PDF and return a list of DocumentChunk objects.

    Args:
        pdf_path: Path to the PDF file.
        source_name: Human-readable source label (defaults to filename stem).

    Returns:
        List of DocumentChunk with text + metadata.
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    source = source_name or pdf_path.stem
    doc = fitz.open(str(pdf_path))

    chunks: list[DocumentChunk] = []
    for page_num, page in enumerate(doc, start=1):
        raw = page.get_text("text")  # type: ignore[attr-defined]
        cleaned = _clean_text(raw)
        if len(cleaned) < 50:
            continue  # skip near-empty pages

        page_chunks = _split_into_chunks(cleaned)
        for i, chunk_text in enumerate(page_chunks):
            chunks.append(DocumentChunk(
                text=chunk_text,
                metadata={
                    "source": source,
                    "page": page_num,
                    "chunk_index": i,
                    "file": pdf_path.name,
                }
            ))

    doc.close()
    return chunks


def extract_chunks_from_directory(dir_path: str | Path) -> list[DocumentChunk]:
    """
    Walk a directory and extract chunks from all PDFs found.

    Args:
        dir_path: Directory path containing PDF files.

    Returns:
        Combined list of DocumentChunks from all PDFs.
    """
    dir_path = Path(dir_path)
    all_chunks: list[DocumentChunk] = []

    for pdf_file in sorted(dir_path.glob("**/*.pdf")):
        print(f"  📄 Processing: {pdf_file.name}")
        try:
            chunks = extract_chunks_from_pdf(pdf_file)
            all_chunks.extend(chunks)
            print(f"     → {len(chunks)} chunks extracted")
        except Exception as e:
            print(f"     ⚠ Skipped {pdf_file.name}: {e}")

    return all_chunks
