from fastapi import APIRouter, HTTPException, Query
from typing import List
from backend.schemas.location import LocationCoordinates, LocationDetails, LocationSearchResult
from backend.services.geolocation_service import GeolocationService

router = APIRouter(prefix="/location", tags=["Location"])

@router.post("/resolve", response_model=LocationDetails)
async def resolve_location(coords: LocationCoordinates):
    """
    Resolves browser latitude and longitude to the nearest Indian city / district.
    Does not request or store exact street addresses.
    """
    try:
        details = await GeolocationService.resolve_coordinates(coords.latitude, coords.longitude)
        return details
    except Exception as e:
        # Fallback safely to Bhuj, Gujarat without crashing
        return GeolocationService.get_default_location()

@router.get("/search", response_model=List[LocationSearchResult])
async def search_locations(q: str = Query(..., min_length=1, description="City or district search term")):
    """Search Indian cities and districts with fast autocomplete."""
    return await GeolocationService.search_locations(q)

@router.get("/default", response_model=LocationDetails)
def get_default_location():
    """Returns official default location (Bhuj, Gujarat)."""
    return GeolocationService.get_default_location()
