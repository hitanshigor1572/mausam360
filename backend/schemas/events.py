from pydantic import BaseModel, Field
from typing import Optional, List
from backend.schemas.weather import CurrentWeather, WeatherWarning

class DestinationCreate(BaseModel):
    name: str = Field(..., description="e.g. Mumbai, Delhi, Shimla, London")
    district: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"
    latitude: float
    longitude: float
    trip_date: Optional[str] = None
    category: Optional[str] = "Leisure"

class DestinationResponse(BaseModel):
    id: int
    name: str
    district: Optional[str]
    state: Optional[str]
    country: str
    latitude: float
    longitude: float
    trip_date: Optional[str]
    category: str
    current_weather: Optional[CurrentWeather] = None
    warning: Optional[WeatherWarning] = None
    packing_suggestions: List[str] = []

class EventCreate(BaseModel):
    title: str = Field(..., description="e.g. College Fest, Community Marathon")
    event_date: str = Field(..., description="YYYY-MM-DD")
    event_time: str = Field(..., description="HH:MM")
    location_name: str
    latitude: float
    longitude: float
    is_outdoor: Optional[str] = "yes"

class EventResponse(BaseModel):
    id: int
    title: str
    event_date: str
    event_time: str
    location_name: str
    latitude: float
    longitude: float
    is_outdoor: str
    outdoor_comfort_score: int
    comfort_verdict: str
    advisory: str
    forecast_temp: float
    rain_risk: str
