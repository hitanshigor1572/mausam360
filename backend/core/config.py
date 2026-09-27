from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    APP_NAME: str = "Mausam - MoES / IMD Personalized Weather"
    ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    # Database
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/mausam_db"
    
    # Official IMD API Layer
    IMD_API_BASE_URL: str = "https://api.imd.gov.in/v1"
    IMD_API_KEY: str = ""
    
    # Provider: "live" | "imd" | "mock"
    WEATHER_PROVIDER: str = "live"
    
    # Cache settings (seconds)
    CACHE_TTL_CURRENT_SECONDS: int = 600       # 10 minutes
    CACHE_TTL_FORECAST_SECONDS: int = 1800     # 30 minutes
    CACHE_TTL_WARNINGS_SECONDS: int = 300      # 5 minutes
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
