from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "PolicyWise AI"
    app_version: str = "0.1.0"
    debug: bool = False

    database_url: str
    database_async_url: str

    openai_api_key: str = ""
    vector_db_path: str = "../data/vector_store"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()