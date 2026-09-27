import datetime
from typing import List, Dict, Any
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

class MockWeatherProvider(WeatherProvider):
    """
    High-fidelity mock provider generating realistic, meteorologically grounded Indian data.
    Clearly marks simulation metadata as requested by IMD/SIH guidelines.
    """
    
    # State for dynamic demonstration scenarios (e.g. toggling severe thunderstorm)
    _severe_warning_active: bool = False

    @classmethod
    def set_severe_warning_active(cls, active: bool):
        cls._severe_warning_active = active

    @classmethod
    def is_severe_warning_active(cls) -> bool:
        return cls._severe_warning_active

    async def get_current_weather(self, location: LocationDetails) -> CurrentWeather:
        # Base realistic weather profile tailored by region
        is_coastal = location.is_coastal or ("gujarat" in location.state.lower() and "kutch" in location.district.lower())
        
        # If severe warning scenario is active
        if self._severe_warning_active:
            return CurrentWeather(
                temperature=28.5,
                feels_like=33.0,
                humidity=88,
                wind_speed=42.0,
                wind_direction="SW",
                condition="Severe Thunderstorm & Squall",
                condition_code="thunderstorm",
                rainfall_24h=38.5,
                rain_probability=95,
                uv_index=2.5,
                aqi=45,
                aqi_category="Good",
                pressure=998.2,
                visibility=3.5,
                dew_point=26.0,
                soil_moisture=78.0,
                is_soil_moisture_simulated=True,
                wave_height=3.8 if is_coastal else None,
                tide_info="High Tide: 3.4m at 14:15" if is_coastal else None
            )

        # Realistic normal weather: Bhuj / Western India (Warm, partly cloudy, coastal breeze)
        temp = 31.0
        feels = 33.0
        humidity = 72
        wind = 14.5
        condition = "Partly Cloudy"
        condition_code = "partly_cloudy"

        # Adapt slightly by region
        if "himachal" in location.state.lower() or "kashmir" in location.state.lower():
            temp = 14.0
            feels = 13.0
            humidity = 58
            wind = 9.0
            condition = "Cool & Sunny"
            condition_code = "sunny"
        elif "delhi" in location.state.lower() or "uttar pradesh" in location.state.lower():
            temp = 34.0
            feels = 38.0
            humidity = 64
            condition = "Hazy Sunshine"
            condition_code = "hazy"

        return CurrentWeather(
            temperature=temp,
            feels_like=feels,
            humidity=humidity,
            wind_speed=wind,
            wind_direction="SW",
            condition=condition,
            condition_code=condition_code,
            rainfall_24h=2.0,
            rain_probability=35,
            uv_index=7.8,
            aqi=112,
            aqi_category="Moderate",
            pressure=1011.5,
            visibility=9.0,
            dew_point=22.5,
            soil_moisture=46.0,
            is_soil_moisture_simulated=True,
            wave_height=1.4 if is_coastal else None,
            tide_info="High Tide: 2.1m at 16:30 | Low Tide: 0.8m at 22:15" if is_coastal else None
        )

    async def get_forecast(self, location: LocationDetails) -> List[ForecastDay]:
        today = datetime.date.today()
        days_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        
        forecast = []
        templates = [
            {"delta": 0, "name": "Today", "t_min": 24, "t_max": 32, "rain": 35, "cond": "Partly Cloudy", "code": "partly_cloudy", "summ": "Warm day with coastal breeze and isolated cloud patches."},
            {"delta": 1, "name": "Tomorrow", "t_min": 25, "t_max": 33, "rain": 40, "cond": "Scattered Clouds", "code": "cloudy", "summ": "Passing clouds, comfortable early morning for fitness."},
            {"delta": 2, "name": "Day 3", "t_min": 24, "t_max": 31, "rain": 60, "cond": "Light Rain / Showers", "code": "rain_light", "summ": "Short spell of rain likely during afternoon."},
            {"delta": 3, "name": "Day 4", "t_min": 23, "t_max": 30, "rain": 75, "cond": "Thunderstorm Likely", "code": "thunderstorm", "summ": "Gusty winds and moderate rain expected."},
            {"delta": 4, "name": "Day 5", "t_min": 24, "t_max": 31, "rain": 30, "cond": "Clearing Sky", "code": "partly_cloudy", "summ": "Conditions improving after morning moisture."},
            {"delta": 5, "name": "Day 6", "t_min": 25, "t_max": 33, "rain": 15, "cond": "Sunny", "code": "sunny", "summ": "Bright sunny conditions, elevated UV index during noon."},
            {"delta": 6, "name": "Day 7", "t_min": 25, "t_max": 34, "rain": 10, "cond": "Sunny & Warm", "code": "sunny", "summ": "Warm and dry conditions across district."}
        ]

        for item in templates:
            f_date = today + datetime.timedelta(days=item["delta"])
            day_label = item["name"] if item["delta"] < 2 else days_names[f_date.weekday()]
            forecast.append(
                ForecastDay(
                    date=f_date.isoformat(),
                    day_name=day_label,
                    temp_min=float(item["t_min"]),
                    temp_max=float(item["t_max"]),
                    rain_probability=item["rain"],
                    rainfall_mm=8.5 if item["rain"] > 60 else (1.5 if item["rain"] > 30 else 0.0),
                    condition=item["cond"],
                    condition_code=item["code"],
                    summary=item["summ"]
                )
            )
        return forecast

    async def get_hourly_forecast(self, location: LocationDetails) -> List[ForecastHour]:
        current_hour = datetime.datetime.now().hour
        hours = []
        hour_samples = [
            ("06:00", 24.0, 24.5, 10, "Clear Sky", "sunny", 8.0, 0.5),
            ("08:00", 26.5, 27.0, 15, "Sunny", "sunny", 11.0, 3.2),
            ("10:00", 29.0, 31.0, 20, "Partly Cloudy", "partly_cloudy", 13.0, 6.8),
            ("12:00", 31.5, 34.0, 30, "Partly Cloudy", "partly_cloudy", 16.0, 8.5),
            ("14:00", 32.0, 35.0, 45, "Isolated Cloud", "cloudy", 18.0, 7.8),
            ("16:00", 30.5, 33.0, 50, "Passing Shower", "rain_light", 15.0, 4.2),
            ("18:00", 28.5, 30.5, 35, "Sunset Glow", "partly_cloudy", 12.0, 1.0),
            ("20:00", 27.0, 28.5, 20, "Clear Night", "night_clear", 10.0, 0.0),
            ("22:00", 25.5, 26.5, 15, "Cool Breeze", "night_clear", 9.0, 0.0),
        ]
        for time_str, t, feels, rain_p, cond, code, wind, uv in hour_samples:
            hours.append(
                ForecastHour(
                    time=time_str,
                    temperature=t,
                    feels_like=feels,
                    rain_probability=rain_p,
                    condition=cond,
                    condition_code=code,
                    wind_speed=wind,
                    uv_index=uv
                )
            )
        return hours

    async def get_warnings(self, location: LocationDetails) -> List[WeatherWarning]:
        warnings = []
        
        # Severe warning trigger (for judge demonstration)
        if self._severe_warning_active:
            warnings.append(
                WeatherWarning(
                    id="IMD-WARN-THUNDERSTORM-01",
                    title="🚨 CRITICAL: Severe Thunderstorm & Lightning Warning",
                    category="Thunderstorm & Lightning",
                    severity="critical",
                    description=(
                        f"IMD NWFC Bulletin: Severe thunderstorm accompanied by squall (wind gusting up to 55-65 km/h) "
                        f"and frequent lightning flashes observed over {location.district} and adjoining coastal belt."
                    ),
                    start_time="Today, 09:30 AM IST",
                    end_time="Today, 06:00 PM IST",
                    source="India Meteorological Department (IMD) - NWFC New Delhi",
                    affected_area=f"{location.district}, {location.state}",
                    action_advisory="Postpone non-essential outdoor activities immediately. Do not take shelter under trees or open metal structures."
                )
            )
        else:
            # Standard realistic seasonal advisory / watch
            warnings.append(
                WeatherWarning(
                    id="IMD-ADV-HEAT-HUMID-02",
                    title="⚠️ IMD Weather Watch: Elevated Coastal Humidity & Afternoon Heat",
                    category="Heat & Humidity",
                    severity="watch",
                    description=(
                        f"Maximum temperatures likely to remain around 32-34°C with relative humidity 70-80% "
                        f"causing elevated Discomfort Index over {location.district}."
                    ),
                    start_time="Valid: Today, 11:00 AM",
                    end_time="Valid: Today, 05:00 PM",
                    source="IMD Regional Meteorological Centre",
                    affected_area=f"{location.district} & coastal belt",
                    action_advisory="Drink adequate water, avoid prolonged exertion during afternoon peak hours."
                )
            )
        return warnings

    async def get_normalized_weather(self, location: LocationDetails) -> NormalizedWeatherData:
        current = await self.get_current_weather(location)
        forecast = await self.get_forecast(location)
        hourly = await self.get_hourly_forecast(location)
        warnings = await self.get_warnings(location)
        
        sun = SunTimes(
            sunrise="06:21 AM",
            sunset="06:48 PM",
            daylight_hours="12h 27m",
            golden_hour="06:05 PM - 06:48 PM"
        )
        
        return NormalizedWeatherData(
            location=location,
            current=current,
            forecast=forecast,
            hourly=hourly,
            sun=sun,
            warnings=warnings,
            provider="mock",
            is_demo_data=True,
            data_timestamp=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        )
