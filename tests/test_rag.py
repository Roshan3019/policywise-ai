"""
tests/test_rag.py
-----------------
Tests for the RAG pipeline.
"""
import pytest
from pathlib import Path

from ai.loaders.document_loader import load_all_documents
from ai.chunking.text_chunker import split_documents
from ai.vectorstore.chroma_store import create_vector_store, similarity_search, get_collection
from ai.pipelines.rag_pipeline import ask_insurance_ai


class TestDocumentLoading:
    """Tests for document loading."""
    
    def test_load_markdown_documents(self):
        """Test loading markdown documents from the knowledge base."""
        docs_path = Path(__file__).parent.parent / "backend" / "data" / "insurance_docs"
        
        if docs_path.exists():
            documents = load_all_documents(docs_path)
            assert len(documents) > 0, "Should load at least one document"
            
            for doc in documents:
                assert doc.text, "Document should have text content"
                assert "source" in doc.metadata, "Document should have source metadata"


class TestChunking:
    """Tests for document chunking."""
    
    def test_split_documents(self):
        """Test document splitting."""
        from ai.loaders.base import DocumentChunk
        
        docs = [
            DocumentChunk(
                text="This is a test document. " * 100,
                metadata={"source": "test"},
            )
        ]
        
        chunks = split_documents(docs, chunk_size=500, chunk_overlap=100)
        
        assert len(chunks) > 1, "Should split into multiple chunks"
        
        for chunk in chunks:
            assert len(chunk.text) <= 600, "Chunks should respect size limit"


class TestVectorStore:
    """Tests for vector store operations."""
    
    def test_collection_exists(self):
        """Test that the collection can be created/loaded."""
        collection = get_collection()
        assert collection is not None, "Collection should exist"
        
        # Check initial count (may be 0 if not ingested yet)
        count = collection.count()
        assert count >= 0, "Collection count should be non-negative"


class TestRAGPipeline:
    """Tests for the RAG pipeline."""
    
    def test_ask_insurance_ai_returns_response(self):
        """Test that ask_insurance_ai returns a valid response."""
        response = ask_insurance_ai("What is No Claim Bonus?", top_k=3)
        
        assert response is not None, "Response should not be None"
        assert isinstance(response.answer, str), "Answer should be a string"
        assert response.retrieved_chunks >= 0, "Retrieved chunks should be non-negative"


class TestSimilaritySearch:
    """Tests for similarity search."""
    
    def test_search_returns_results(self):
        """Test that similarity search returns results."""
        # First, ensure we have some data
        collection = get_collection()
        
        if collection.count() > 0:
            results = similarity_search("NCB", top_k=3)
            
            # Results should be a list of tuples
            assert isinstance(results, list), "Results should be a list"
            
            for result in results:
                assert len(result) == 3, "Each result should be (text, metadata, score)"
                text, metadata, score = result
                assert isinstance(text, str), "Text should be a string"
                assert isinstance(score, float), "Score should be a float"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])