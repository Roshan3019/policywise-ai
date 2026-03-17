"""
models/user.py
--------------
User ORM model — expanded from Phase 1 skeleton.
Adds hashed_password, is_active, and timestamp columns.
Password auth will be integrated in Phase 6.
"""
from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from database.base import Base


class User(Base):
    """Application user account."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)

    # Password stored as bcrypt hash; plain-text never stored
    hashed_password = Column(String(255), nullable=False, default="")

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"