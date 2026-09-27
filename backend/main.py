import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings
from backend.core.database import init_db
from backend.api.api_router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("mausam.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Mausam Database schema...")
    try:
        init_db()
        logger.info("Database initialization successful.")
    except Exception as e:
        logger.error(f"Database init warning: {e}")
    yield
    logger.info("Mausam server shutting down.")

app = FastAPI(
    title="Mausam Personalized Weather API",
    description="Smart India Hackathon 2026 (SIH26076) - MoES / IMD Personalized Weather Homepage Engine",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Mausam Personalized Weather Engine",
        "organization": "Ministry of Earth Sciences (MoES) / IMD",
        "provider_mode": settings.WEATHER_PROVIDER,
        "version": "2.0.0"
    }

# Include all modular API routes
app.include_router(api_router, prefix=settings.API_PREFIX)

# Global error handler to prevent crashing or raw stack trace leaks
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal meteorological service error",
            "message": "The weather service encountered a temporary error. Graceful fallback data remains accessible.",
            "path": str(request.url.path)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
