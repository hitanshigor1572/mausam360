from pydantic import BaseModel, Field
from typing import List, Optional
from backend.schemas.weather import WeatherWarning

class AlertsResponse(BaseModel):
    location_name: str
    active_count: int
    critical_count: int
    warning_count: int
    watch_count: int
    advisory_count: int
    alerts: List[WeatherWarning]
    official_source: str = "India Meteorological Department (IMD) / MoES National Weather Forecasting Centre"
    bulletin_issued: str
