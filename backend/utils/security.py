"""
utils/security.py
-----------------
Password hashing utilities using passlib with bcrypt backend.
No JWT is wired yet (Phase 6); this module only handles hashing.
"""
from passlib.context import CryptContext

# bcrypt is the industry-standard hashing algorithm for passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Return the bcrypt hash of a plain-text password."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if plain_password matches the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)
