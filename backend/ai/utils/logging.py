"""
ai/utils/logging.py
-------------------
Central logging configuration using Loguru.
"""
from loguru import logger
import sys

def setup_logging():
    """Configure loguru for the AI module."""
    logger.remove()
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level="INFO",
    )
    logger.add(
        "logs/ai.log",
        rotation="10 MB",
        retention="7 days",
        level="DEBUG",
    )

setup_logging()