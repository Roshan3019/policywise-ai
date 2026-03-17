"""
database/base.py
----------------
Single source-of-truth Base class for all SQLAlchemy models.
Uses the modern SQLAlchemy 2.x DeclarativeBase style so it is fully
compatible with the async engine in connection.py.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """All ORM models inherit from this class."""
    pass