from abc import ABC, abstractmethod
from typing import List
from backend.schemas.location import LocationDetails
from backend.schemas.weather import (
    CurrentWeather,
    ForecastDay,
    ForecastHour,
    SunTimes,
    WeatherWarning,
    NormalizedWeatherData
)

class WeatherProvider(ABC):
    """Abstract interface for all weather data providers (IMD, Mock, etc.)"""

    @abstractmethod
    async def get_normalized_weather(self, location: LocationDetails) -> NormalizedWeatherData:
        """Fetches and normalizes all weather data for the specified location."""
        pass

    @abstractmethod
    async def get_current_weather(self, location: LocationDetails) -> CurrentWeather:
        """Fetches real-time surface meteorological observations."""
        pass

    @abstractmethod
    async def get_forecast(self, location: LocationDetails) -> List[ForecastDay]:
        """Fetches multi-day outlook."""
        pass

    @abstractmethod
    async def get_hourly_forecast(self, location: LocationDetails) -> List[ForecastHour]:
        """Fetches 24h hourly forecast trend."""
        pass

    @abstractmethod
    async def get_warnings(self, location: LocationDetails) -> List[WeatherWarning]:
        """Fetches active severe weather bulletins and warnings."""
        pass
