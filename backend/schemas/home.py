from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from backend.schemas.location import LocationDetails
from backend.schemas.weather import CurrentWeather, WeatherWarning

class CardScoreBreakdown(BaseModel):
    base_priority: float
    profile_relevance: float
    weather_relevance: float
    time_relevance: float
    severe_alert_boost: float

class PersonalizedCard(BaseModel):
    id: str = Field(..., description="Unique card instance identifier")
    type: str = Field(..., description="Card type discriminator e.g. running_score, aqi, agriculture, commute")
    title: str
    category: str
    priority: int = Field(..., description="Calculated sorting priority rank")
    final_score: float = Field(..., description="Continuous scoring engine output")
    explanation: str = Field(..., description="Transparent 'Why am I seeing this?' text for user/judge")
    score_breakdown: CardScoreBreakdown
    data: Dict[str, Any] = Field(..., description="Payload consumed directly by the React card component")

class PersonalizedHomeResponse(BaseModel):
    location: LocationDetails
    current_weather: CurrentWeather
    warnings: List[WeatherWarning]
    has_active_critical_warning: bool = False
    active_persona: str
    cards: List[PersonalizedCard]
    meta: Dict[str, Any]
