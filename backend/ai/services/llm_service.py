"""
ai/services/llm_service.py
--------------------------
LLM service with OpenAI and Google Gemini (fallback) support.
"""
import time
from typing import Any

from langchain_openai import ChatOpenAI
from openai import OpenAIError

from ai.retrieval.retriever import RetrievedChunk, format_context
from ai.prompts.rag_prompt import SYSTEM_PROMPT, format_rag_prompt
from ai.utils.logging import logger
from ai.utils.errors import LLMError
from utils.config import get_settings


class LLMService:
    """LLM service with OpenAI primary and Google Gemini fallback."""
    
    def __init__(
        self,
        model: str = "gpt-4o-mini",
        temperature: float = 0.2,
        max_tokens: int = 1024,
        max_retries: int = 3,
        retry_delay: float = 1.0,
    ):
        self.settings = get_settings()
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        
        self.use_openai = bool(self.settings.openai_api_key)
        
        if self.use_openai:
            logger.info(f"Using OpenAI LLM with model: {model}")
            self.client = ChatOpenAI(
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                openai_api_key=self.settings.openai_api_key,
            )
        elif self.settings.google_api_key:
            self._load_google_fallback()
        else:
            logger.warning("No LLM API key available - LLM calls will fail")
    
    def _load_google_fallback(self):
        """Load Google Gemini as fallback."""
        try:
            from google import genai
            from google.genai import types
            logger.info("Using Google Gemini as fallback LLM")
            self.genai_client = genai.Client(api_key=self.settings.google_api_key)
            self.types = types
            self.use_openai = False
            self.use_google = True
        except ImportError:
            logger.warning("Google genai not installed - falling back to template responses")
            self.use_google = False
    
    def generate_response(self, prompt: str, system_prompt: str = SYSTEM_PROMPT) -> str:
        """Generate a response from a prompt."""
        if self.use_openai:
            return self._generate_openai(prompt, system_prompt)
        elif hasattr(self, 'use_google') and self.use_google:
            return self._generate_google(prompt, system_prompt)
        else:
            return self._template_fallback(prompt)
    
    def _generate_openai(self, prompt: str, system_prompt: str) -> str:
        """Generate using OpenAI."""
        for attempt in range(self.max_retries):
            try:
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ]
                response = self.client.invoke(messages)
                return response.content or "No response generated."
            except OpenAIError as e:
                if attempt < self.max_retries - 1:
                    logger.warning(f"LLM call failed, retry {attempt + 1}/{self.max_retries}: {e}")
                    time.sleep(self.retry_delay * (attempt + 1))
                else:
                    raise LLMError(f"Failed to generate response after {self.max_retries} retries: {e}")
    
    def _generate_google(self, prompt: str, system_prompt: str) -> str:
        """Generate using Google Gemini."""
        try:
            response = self.genai_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=self.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=self.temperature,
                    max_output_tokens=self.max_tokens,
                ),
            )
            return response.text or "No response generated."
        except Exception as e:
            logger.error(f"Google Gemini call failed: {e}")
            return self._template_fallback(prompt)
    
    def _template_fallback(self, prompt: str) -> str:
        """Fallback response when no LLM is available."""
        return f"""⚠️ **No LLM API key configured.**

The system cannot generate a response because no OpenAI or Google API key is available.

To fix this, add an API key to your `.env` file:
- `OPENAI_API_KEY=sk-...` for OpenAI GPT-4o-mini
- `GOOGLE_API_KEY=AIza...` for Google Gemini (free tier)"""

    def generate_rag_response(
        self,
        question: str,
        chunks: list[RetrievedChunk],
    ) -> str:
        """Generate a RAG response from question and retrieved chunks."""
        context = format_context(chunks)
        prompt = format_rag_prompt(context, question)
        return self.generate_response(prompt)


_llm_service: LLMService | None = None


def get_llm_service() -> LLMService:
    """Get or create the singleton LLM service."""
    global _llm_service
    if _llm_service is None:
        settings = get_settings()
        _llm_service = LLMService(model=settings.llm_model)
    return _llm_service


def generate_response(prompt: str) -> str:
    """Generate a response from a prompt."""
    return get_llm_service().generate_response(prompt)


def generate_rag_response(
    question: str,
    chunks: list[RetrievedChunk],
) -> str:
    """Generate a RAG response."""
    return get_llm_service().generate_rag_response(question, chunks)