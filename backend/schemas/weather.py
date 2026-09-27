from pydantic import BaseModel, Field
from typing import List, Optional
from backend.schemas.location import LocationDetails

class WeatherWarning(BaseModel):
    id: str
    title: str = Field(..., description="Warning headline e.g. Severe Thunderstorm Warning")
    category: str = Field("Severe Weather", description="Category e.g. Thunderstorm, Heatwave, Heavy Rain, Marine")
    severity: str = Field("warning", description="'critical' (Red), 'warning' (Orange), 'watch' (Yellow), 'advisory' (Green)")
    description: str
    start_time: str
    end_time: str
    source: str = "India Meteorological Department (IMD)"
    affected_area: str = "District / Sub-division"
    action_advisory: str = "Take necessary precautions."

class CurrentWeather(BaseModel):
    temperature: float = Field(..., description="Temperature in °C")
    feels_like: float = Field(..., description="Apparent temperature in °C")
    humidity: int = Field(..., description="Relative humidity in %")
    wind_speed: float = Field(..., description="Wind speed in km/h")
    wind_direction: str = Field("SW", description="Compass wind direction e.g. SW, NE")
    condition: str = Field(..., description="Sky condition e.g. Partly Cloudy, Thunderstorm, Sunny")
    condition_code: str = Field("partly_cloudy", description="Icon identifier")
    rainfall_24h: float = Field(0.0, description="Observed rainfall past 24h in mm")
    rain_probability: int = Field(20, description="Chance of rain today in %")
    uv_index: float = Field(5.0, description="UV Index (0-12)")
    aqi: Optional[int] = Field(None, description="Air Quality Index")
    aqi_category: Optional[str] = Field(None, description="Good, Moderate, Poor, Very Poor, Severe")
    pressure: float = Field(1012.0, description="Atmospheric pressure in hPa")
    visibility: float = Field(10.0, description="Visibility in km")
    dew_point: Optional[float] = Field(None, description="Dew point in °C")
    # Agriculture indicators (simulated if sensor data unavailable)
    soil_moisture: Optional[float] = Field(None, description="Volumetric soil moisture %")
    is_soil_moisture_simulated: bool = True
    # Marine indicators for coastal stations
    wave_height: Optional[float] = Field(None, description="Wave height in meters")
    tide_info: Optional[str] = Field(None, description="High/Low tide timing")

class ForecastHour(BaseModel):
    time: str = Field(..., description="Hour representation e.g. 06:00")
    temperature: float
    feels_like: float
    rain_probability: int
    condition: str
    condition_code: str
    wind_speed: float
    uv_index: float

class ForecastDay(BaseModel):
    date: str = Field(..., description="YYYY-MM-DD")
    day_name: str = Field(..., description="Mon, Tue, etc.")
    temp_min: float
    temp_max: float
    rain_probability: int
    rainfall_mm: float = 0.0
    condition: str
    condition_code: str
    summary: str

class SunTimes(BaseModel):
    sunrise: str = "06:15 AM"
    sunset: "str" = "06:45 PM"
    daylight_hours: str = "12h 30m"
    golden_hour: str = "06:00 PM - 06:45 PM"

class NormalizedWeatherData(BaseModel):
    location: LocationDetails
    current: CurrentWeather
    forecast: List[ForecastDay]
    hourly: List[ForecastHour]
    sun: SunTimes
    warnings: List[WeatherWarning]
    provider: str = Field("mock", description="'imd' or 'mock'")
    is_demo_data: bool = True
    data_timestamp: str
