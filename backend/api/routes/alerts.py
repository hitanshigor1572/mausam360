from fastapi import APIRouter, Query, Depends
from typing import Optional
from backend.schemas.location import LocationDetails
from backend.schemas.alerts import AlertsResponse
from backend.services.weather_service import weather_service
from backend.services.geolocation_service import GeolocationService

router = APIRouter(prefix="/alerts", tags=["Severe Weather Alerts"])

@router.get("", response_model=AlertsResponse)
async def get_alerts(
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude")
):
    if lat is not None and lon is not None:
        loc = await GeolocationService.resolve_coordinates(lat, lon)
    else:
        loc = GeolocationService.get_default_location()

    weather = await weather_service.get_weather(loc)
    warnings = weather.warnings

    crit = sum(1 for w in warnings if w.severity == "critical")
    warn = sum(1 for w in warnings if w.severity == "warning")
    watc = sum(1 for w in warnings if w.severity == "watch")
    advi = sum(1 for w in warnings if w.severity == "advisory")

    return AlertsResponse(
        location_name=f"{loc.name}, {loc.district}, {loc.state}",
        active_count=len(warnings),
        critical_count=crit,
        warning_count=warn,
        watch_count=watc,
        advisory_count=advi,
        alerts=warnings,
        official_source="India Meteorological Department (IMD) / MoES National Weather Forecasting Centre",
        bulletin_issued=weather.data_timestamp
    )
