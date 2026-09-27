from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from backend.schemas.location import LocationDetails
from backend.schemas.weather import (
    CurrentWeather,
    ForecastDay,
    ForecastHour,
    SunTimes,
    WeatherWarning,
    NormalizedWeatherData
)
from backend.services.weather_service import weather_service
from backend.services.geolocation_service import GeolocationService

router = APIRouter(prefix="/weather", tags=["Weather"])

async def _get_location_obj(lat: Optional[float], lon: Optional[float]) -> LocationDetails:
    if lat is not None and lon is not None:
        return await GeolocationService.resolve_coordinates(lat, lon)
    return GeolocationService.get_default_location()

@router.get("/current", response_model=CurrentWeather)
async def get_current_weather(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    normalized = await weather_service.get_weather(loc)
    return normalized.current

@router.get("/forecast", response_model=List[ForecastDay])
async def get_forecast(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    normalized = await weather_service.get_weather(loc)
    return normalized.forecast

@router.get("/hourly", response_model=List[ForecastHour])
async def get_hourly_forecast(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    normalized = await weather_service.get_weather(loc)
    return normalized.hourly

@router.get("/warnings", response_model=List[WeatherWarning])
async def get_warnings(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    normalized = await weather_service.get_weather(loc)
    return normalized.warnings

@router.get("/sun", response_model=SunTimes)
async def get_sun_times(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    normalized = await weather_service.get_weather(loc)
    return normalized.sun

@router.post("/refresh")
async def refresh_weather(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    loc = await _get_location_obj(lat, lon)
    weather_service.invalidate_cache(loc)
    fresh_data = await weather_service.get_weather(loc)
    return {"status": "refreshed", "timestamp": fresh_data.data_timestamp}
