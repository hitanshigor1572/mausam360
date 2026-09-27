import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.core.config import settings

logger = logging.getLogger("mausam.database")

# Build primary engine or fallback gracefully to SQLite
engine = None
SessionLocal = None
Base = declarative_base()

def get_engine():
    global engine
    if engine is not None:
        return engine

    db_url = settings.DATABASE_URL
    is_sqlite = db_url.startswith("sqlite")
    
    # Try connecting to the specified DATABASE_URL
    try:
        if is_sqlite:
            candidate_engine = create_engine(
                db_url, connect_args={"check_same_thread": False}
            )
        else:
            candidate_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args={"connect_timeout": 3} if "postgres" in db_url else {}
            )
        # Test connection
        with candidate_engine.connect() as conn:
            pass
        logger.info(f"Database connected successfully via: {db_url.split('@')[-1] if '@' in db_url else db_url}")
        engine = candidate_engine
    except Exception as e:
        logger.warning(
            f"Could not connect to configured DATABASE_URL ({e}). "
            "Falling back to zero-configuration SQLite for seamless local/demo execution."
        )
        sqlite_fallback = "sqlite:///./mausam.db"
        engine = create_engine(
            sqlite_fallback, connect_args={"check_same_thread": False}
        )
    return engine

def get_session_factory():
    global SessionLocal
    if SessionLocal is None:
        eng = get_engine()
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=eng)
    return SessionLocal

def get_db():
    session_factory = get_session_factory()
    db = session_factory()
    try:
        yield db
    finally:
        db.close()

def init_db():
    eng = get_engine()
    # Import all models before create_all
    import backend.models.user # noqa
    import backend.models.preferences # noqa
    import backend.models.destination # noqa
    import backend.models.event # noqa
    import backend.models.weather_cache # noqa
    Base.metadata.create_all(bind=eng)
    logger.info("Database schema initialized.")

# Auto-initialize on module load to guarantee tables exist
try:
    init_db()
except Exception as e:
    logger.warning(f"Initial schema setup deferred: {e}")

