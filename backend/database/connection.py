from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from utils.config import get_settings
 
settings = get_settings()
 
engine = create_async_engine(
    settings.DATABASE_ASYNC_URL,
    echo=settings.DEBUG,
    pool_size=10,
    max_overflow=20,
)
 
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
 
class Base(DeclarativeBase):
    pass
