import datetime
import json
import logging
from typing import Optional
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.core.database import get_session_factory
from backend.models.weather_cache import WeatherCache
from backend.schemas.location import LocationDetails
from backend.schemas.weather import NormalizedWeatherData
from backend.services.base_provider import WeatherProvider
from backend.services.mock_provider import MockWeatherProvider
from backend.services.imd_provider import IMDWeatherProvider
from backend.services.live_provider import LiveWeatherProvider

logger = logging.getLogger("mausam.weather_service")

class WeatherService:
    def __init__(self):
        self.mock_provider = MockWeatherProvider()
        self.imd_provider = IMDWeatherProvider()
        self.live_provider = LiveWeatherProvider()
        # In-memory fast cache
        self._memory_cache = {}

    def get_provider(self) -> WeatherProvider:
        if settings.WEATHER_PROVIDER.lower() == "imd" and settings.IMD_API_KEY:
            return self.imd_provider
        if settings.WEATHER_PROVIDER.lower() == "mock":
            return self.mock_provider
        return self.live_provider

    async def get_weather(self, location: LocationDetails) -> NormalizedWeatherData:
        # Cache key rounded to ~10km grid
        cache_key = f"weather_{round(location.latitude, 2)}_{round(location.longitude, 2)}"
        now = datetime.datetime.utcnow()

        # 1. In-memory check
        if cache_key in self._memory_cache:
            entry = self._memory_cache[cache_key]
            if entry["expires_at"] > now:
                logger.debug(f"Serving weather from memory cache: {cache_key}")
                return entry["data"]

        # 2. Database cache check
        session_factory = get_session_factory()
        db: Session = session_factory()
        try:
            cached_db = db.query(WeatherCache).filter(
                WeatherCache.cache_key == cache_key,
                WeatherCache.expires_at > now
            ).first()
            if cached_db:
                logger.debug(f"Serving weather from database cache: {cache_key}")
                data_dict = json.loads(cached_db.data_json)
                normalized = NormalizedWeatherData(**data_dict)
                self._memory_cache[cache_key] = {
                    "data": normalized,
                    "expires_at": cached_db.expires_at
                }
                return normalized
        except Exception as e:
            logger.warning(f"Cache lookup error: {e}")
        finally:
            db.close()

        # 3. Fetch fresh data from provider
        provider = self.get_provider()
        weather_data = await provider.get_normalized_weather(location)

        # 4. Save to cache
        expires_at = now + datetime.timedelta(seconds=settings.CACHE_TTL_CURRENT_SECONDS)
        self._memory_cache[cache_key] = {
            "data": weather_data,
            "expires_at": expires_at
        }

        db = session_factory()
        try:
            # Upsert cache entry
            existing = db.query(WeatherCache).filter(WeatherCache.cache_key == cache_key).first()
            if existing:
                existing.data_json = weather_data.model_dump_json()
                existing.expires_at = expires_at
                existing.provider = weather_data.provider
            else:
                db_entry = WeatherCache(
                    cache_key=cache_key,
                    data_json=weather_data.model_dump_json(),
                    provider=weather_data.provider,
                    expires_at=expires_at
                )
                db.add(db_entry)
            db.commit()
        except Exception as e:
            logger.warning(f"Failed to persist weather cache: {e}")
            db.rollback()
        finally:
            db.close()

        return weather_data

    def invalidate_cache(self, location: Optional[LocationDetails] = None):
        """Manually invalidate cache (e.g. on refresh button click or demo trigger)."""
        session_factory = get_session_factory()
        db: Session = session_factory()
        try:
            if location:
                cache_key = f"weather_{round(location.latitude, 2)}_{round(location.longitude, 2)}"
                self._memory_cache.pop(cache_key, None)
                db.query(WeatherCache).filter(WeatherCache.cache_key == cache_key).delete()
            else:
                self._memory_cache.clear()
                db.query(WeatherCache).delete()
            db.commit()
        except Exception as e:
            logger.warning(f"Error purging database cache: {e}")
            db.rollback()
        finally:
            db.close()

weather_service = WeatherService()

