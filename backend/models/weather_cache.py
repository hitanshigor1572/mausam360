import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from backend.core.database import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cache_key = Column(String(100), unique=True, index=True) # e.g. "cur_23.24_69.67"
    data_json = Column(Text, nullable=False)
    provider = Column(String(50), default="imd") # "imd" or "mock"
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
