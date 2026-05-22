"""
ai/ingest_cli.py
----------------
CLI script to ingest PDF files into the ChromaDB vector store.

Usage:
    # Ingest all PDFs in the default docs/pdfs/ directory:
    python -m ai.ingest_cli

    # Ingest a specific file:
    python -m ai.ingest_cli --source ../docs/pdfs/hdfc-ergo-car-wording.pdf

    # Ingest a custom directory:
    python -m ai.ingest_cli --source ../docs/pdfs/

    # Check how many chunks are currently stored:
    python -m ai.ingest_cli --stats
"""
import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from ai.pdf_ingestion import extract_chunks_from_pdf, extract_chunks_from_directory
from ai.embeddings import embed_and_store, collection_stats


# Default PDF directory (relative to this script's project root)
DEFAULT_PDF_DIR = Path(__file__).resolve().parents[2] / "docs" / "pdfs"


def main():
    parser = argparse.ArgumentParser(
        description="PolicyWise AI — PDF Knowledge Ingestion CLI"
    )
    parser.add_argument(
        "--source",
        type=str,
        default=None,
        help="Path to a PDF file or directory of PDFs. Defaults to docs/pdfs/",
    )
    parser.add_argument(
        "--stats",
        action="store_true",
        help="Print current ChromaDB collection stats and exit.",
    )
    args = parser.parse_args()

    # ── Stats mode ────────────────────────────────────────────────────────────
    if args.stats:
        stats = collection_stats()
        print(f"\n📊 ChromaDB Collection Stats")
        print(f"   Collection : {stats['name']}")
        print(f"   Total chunks: {stats['total_chunks']}")
        return

    # ── Resolve source path ───────────────────────────────────────────────────
    source_path = Path(args.source).resolve() if args.source else DEFAULT_PDF_DIR

    if not source_path.exists():
        print(f"❌ Source path not found: {source_path}")
        sys.exit(1)

    print(f"\n🚀 PolicyWise AI — PDF Ingestion")
    print(f"   Source: {source_path}")
    print()

    # ── Extract chunks ────────────────────────────────────────────────────────
    if source_path.is_file():
        if source_path.suffix.lower() != ".pdf":
            print("❌ File must be a .pdf")
            sys.exit(1)
        chunks = extract_chunks_from_pdf(source_path)
    else:
        chunks = extract_chunks_from_directory(source_path)

    if not chunks:
        print("⚠  No text chunks extracted. Check that the PDFs contain extractable text.")
        sys.exit(1)

    print(f"\n✅ Extracted {len(chunks)} chunks from PDFs")
    print(f"\n🔢 Embedding and storing in ChromaDB...")

    # ── Embed + store ─────────────────────────────────────────────────────────
    stored = embed_and_store(chunks)

    print(f"\n✅ Done! Stored {stored} chunks in ChromaDB.")

    stats = collection_stats()
    print(f"   Total chunks in DB: {stats['total_chunks']}")
    print(f"\n🎉 Knowledge base updated! Restart the backend to use the new knowledge.\n")


if __name__ == "__main__":
    main()
