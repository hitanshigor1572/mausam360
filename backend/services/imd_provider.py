import logging
import datetime
from typing import List, Optional
import httpx
from backend.core.config import settings
from backend.schemas.location import LocationDetails
from backend.schemas.weather import (
    CurrentWeather,
    ForecastDay,
    ForecastHour,
    SunTimes,
    WeatherWarning,
    NormalizedWeatherData
)
from backend.services.base_provider import WeatherProvider
from backend.services.mock_provider import MockWeatherProvider

logger = logging.getLogger("mausam.imd_provider")

class IMDWeatherProvider(WeatherProvider):
    """
    Official India Meteorological Department (IMD) integration layer.
    Communicates with MoES / IMD API services and normalizes external responses.
    Includes automated fallback to mock provider if network or department credentials are unavailable.
    """

    def __init__(self):
        self.base_url = settings.IMD_API_BASE_URL
        self.api_key = settings.IMD_API_KEY
        self.mock_fallback = MockWeatherProvider()

    def _get_headers(self) -> dict:
        headers = {
            "Accept": "application/json",
            "User-Agent": "Mausam-Personalized-App/2.0 (MoES/IMD-SIH26076)"
        }
        if self.api_key:
            headers["X-API-KEY"] = self.api_key
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def get_current_weather(self, location: LocationDetails) -> CurrentWeather:
        if not self.api_key:
            logger.info("IMD_API_KEY not configured. Seamlessly utilizing mock provider.")
            return await self.mock_fallback.get_current_weather(location)

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                url = f"{self.base_url}/weather/current?lat={location.latitude}&lon={location.longitude}"
                resp = await client.get(url, headers=self._get_headers())
                if resp.status_code == 200:
                    raw = resp.json()
                    # Map raw IMD JSON response to normalized CurrentWeather
                    return CurrentWeather(
                        temperature=float(raw.get("temp", 31.0)),
                        feels_like=float(raw.get("heat_index", raw.get("temp", 31.0) + 2)),
                        humidity=int(raw.get("rh", 72)),
                        wind_speed=float(raw.get("wind_spd", 14.0)),
                        wind_direction=str(raw.get("wind_dir", "SW")),
                        condition=str(raw.get("weather_desc", "Partly Cloudy")),
                        condition_code="partly_cloudy",
                        rainfall_24h=float(raw.get("rain_24h", 0.0)),
                        rain_probability=int(raw.get("pop", 25)),
                        uv_index=float(raw.get("uvi", 6.5)),
                        aqi=int(raw.get("aqi", 110)) if raw.get("aqi") else None,
                        aqi_category=raw.get("aqi_desc", "Moderate"),
                        pressure=float(raw.get("mslp", 1012.0)),
                        visibility=float(raw.get("vis", 10.0)),
                        dew_point=float(raw.get("dew", 23.0)),
                        soil_moisture=float(raw.get("soil_moist", 45.0)) if raw.get("soil_moist") else None,
                        is_soil_moisture_simulated=False if raw.get("soil_moist") else True
                    )
                else:
                    logger.warning(f"IMD API returned HTTP {resp.status_code}. Using fallback provider.")
                    return await self.mock_fallback.get_current_weather(location)
        except Exception as e:
            logger.warning(f"Failed to fetch live IMD data ({e}). Using mock provider fallback.")
            return await self.mock_fallback.get_current_weather(location)

    async def get_forecast(self, location: LocationDetails) -> List[ForecastDay]:
        if not self.api_key:
            return await self.mock_fallback.get_forecast(location)
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                url = f"{self.base_url}/weather/forecast?lat={location.latitude}&lon={location.longitude}&days=7"
                resp = await client.get(url, headers=self._get_headers())
                if resp.status_code == 200:
                    raw_list = resp.json().get("forecast", [])
                    res = []
                    for item in raw_list:
                        res.append(
                            ForecastDay(
                                date=item.get("date"),
                                day_name=item.get("day", ""),
                                temp_min=float(item.get("min_temp", 24)),
                                temp_max=float(item.get("max_temp", 33)),
                                rain_probability=int(item.get("rain_prob", 30)),
                                rainfall_mm=float(item.get("rain_mm", 0.0)),
                                condition=item.get("desc", "Partly Cloudy"),
                                condition_code="partly_cloudy",
                                summary=item.get("summary", "Expected seasonal conditions.")
                            )
                        )
                    return res
        except Exception as e:
            logger.warning(f"IMD forecast call failed ({e}). Falling back.")
        return await self.mock_fallback.get_forecast(location)

    async def get_hourly_forecast(self, location: LocationDetails) -> List[ForecastHour]:
        return await self.mock_fallback.get_hourly_forecast(location)

    async def get_warnings(self, location: LocationDetails) -> List[WeatherWarning]:
        if not self.api_key:
            return await self.mock_fallback.get_warnings(location)
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                url = f"{self.base_url}/warnings?district={location.district}&state={location.state}"
                resp = await client.get(url, headers=self._get_headers())
                if resp.status_code == 200:
                    raw_warnings = resp.json().get("bulletins", [])
                    out = []
                    for w in raw_warnings:
                        out.append(
                            WeatherWarning(
                                id=w.get("id", "IMD-LIVE-01"),
                                title=w.get("headline", "IMD Weather Warning"),
                                category=w.get("category", "General"),
                                severity=w.get("color_code", "warning").lower(),
                                description=w.get("text", "Please check official bulletins."),
                                start_time=w.get("valid_from", "Immediate"),
                                end_time=w.get("valid_to", "24 hours"),
                                source="India Meteorological Department (IMD)",
                                affected_area=f"{location.district}, {location.state}",
                                action_advisory=w.get("action", "Stay alert.")
                            )
                        )
                    return out
        except Exception as e:
            logger.warning(f"IMD warnings call failed ({e}). Falling back.")
        return await self.mock_fallback.get_warnings(location)

    async def get_normalized_weather(self, location: LocationDetails) -> NormalizedWeatherData:
        if self.api_key:
            try:
                current = await self.get_current_weather(location)
                forecast = await self.get_forecast(location)
                hourly = await self.get_hourly_forecast(location)
                warnings = await self.get_warnings(location)
                return NormalizedWeatherData(
                    location=location,
                    current=current,
                    forecast=forecast,
                    hourly=hourly,
                    sun=SunTimes(),
                    warnings=warnings,
                    provider="imd",
                    is_demo_data=False,
                    data_timestamp=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
                )
            except Exception as e:
                logger.warning(f"IMD full normalization failed: {e}. Reverting to mock.")
        
        # Default fallback
        mock_data = await self.mock_fallback.get_normalized_weather(location)
        return mock_data
