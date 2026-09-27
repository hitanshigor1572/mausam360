from backend.models.user import User
from backend.models.preferences import UserPreference
from backend.models.destination import SavedDestination
from backend.models.event import Event
from backend.models.weather_cache import WeatherCache

__all__ = [
    "User",
    "UserPreference",
    "SavedDestination",
    "Event",
    "WeatherCache",
]
