"""
ai/prompts/__init__.py
--------------------
Prompt templates for RAG.
"""
from ai.prompts.rag_prompt import RAG_PROMPT, format_rag_prompt

__all__ = ["RAG_PROMPT", "format_rag_prompt"]