from pydantic import BaseModel, Field
from typing import Optional, List

class LocationCoordinates(BaseModel):
    latitude: float = Field(..., description="Latitude of user or place")
    longitude: float = Field(..., description="Longitude of user or place")

class LocationDetails(BaseModel):
    name: str = Field("Bhuj", description="City / Town / Station name")
    district: str = Field("Kutch", description="District name")
    state: str = Field("Gujarat", description="State name")
    country: str = Field("India", description="Country name")
    latitude: float
    longitude: float
    station_code: Optional[str] = None
    is_coastal: bool = False

class LocationSearchResult(BaseModel):
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    is_coastal: bool = False
