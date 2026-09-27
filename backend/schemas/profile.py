from pydantic import BaseModel, Field
from typing import Optional, List
from backend.schemas.location import LocationDetails

class InterestsUpdate(BaseModel):
    health: Optional[bool] = None
    fitness: Optional[bool] = None
    travel: Optional[bool] = None
    family: Optional[bool] = None
    agriculture: Optional[bool] = None
    commuter: Optional[bool] = None
    beach: Optional[bool] = None
    event_planner: Optional[bool] = None

class ProfileCreateOrUpdate(BaseModel):
    user_id: Optional[str] = "demo_user"
    name: Optional[str] = "Citizen"
    home_city: Optional[str] = "Bhuj"
    home_district: Optional[str] = "Kutch"
    home_state: Optional[str] = "Gujarat"
    latitude: Optional[float] = 23.2420
    longitude: Optional[float] = 69.6669
    interests: Optional[InterestsUpdate] = None
    units: Optional[str] = "metric"
    location_enabled: Optional[bool] = True

class UserProfileResponse(BaseModel):
    user_id: str
    name: str
    home_city: str
    home_district: str
    home_state: str
    latitude: float
    longitude: float
    interests: dict
    active_demo_persona: Optional[str] = None
    units: str
    location_enabled: bool

class SetDemoPersonaRequest(BaseModel):
    persona: str = Field(..., description="'health' | 'fitness' | 'travel' | 'family' | 'agriculture' | 'commuter' | 'beach' | 'event_planner' | 'clear'")
