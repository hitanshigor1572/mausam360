import pytest
from backend.services.mock_provider import MockWeatherProvider
from backend.services.geolocation_service import GeolocationService
from backend.services.personalization_engine import PersonalizationEngine
from backend.models.preferences import UserPreference
from backend.schemas.weather import WeatherWarning

@pytest.mark.asyncio
async def test_severe_weather_override_priority():
    """Verify that severe weather warnings strictly override normal personalization."""
    location = GeolocationService.get_default_location()
    provider = MockWeatherProvider()
    
    # 1. Normal conditions: Fitness user should have running card near top
    MockWeatherProvider.set_severe_warning_active(False)
    weather_normal = await provider.get_normalized_weather(location)
    pref_fitness = UserPreference(fitness=True, health=False, agriculture=False)
    
    cards_normal = PersonalizationEngine.rank_cards(weather_normal, pref_fitness)
    top_normal_type = cards_normal[0].type
    assert top_normal_type == "running_score"

    # 2. Severe warning activated: Warning card MUST become rank 1
    MockWeatherProvider.set_severe_warning_active(True)
    weather_severe = await provider.get_normalized_weather(location)
    cards_severe = PersonalizationEngine.rank_cards(weather_severe, pref_fitness)
    
    assert cards_severe[0].type == "warning_alert"
    assert cards_severe[0].priority == 1
    assert "🚨 Shown at top priority" in cards_severe[0].explanation
    
    # Reset
    MockWeatherProvider.set_severe_warning_active(False)

@pytest.mark.asyncio
async def test_persona_dynamic_reordering():
    """Verify that different personas rearrange cards from the SAME weather data."""
    location = GeolocationService.get_default_location()
    provider = MockWeatherProvider()
    weather = await provider.get_normalized_weather(location)

    # Fitness persona
    cards_fit = PersonalizationEngine.rank_cards(weather, None, active_persona_override="fitness")
    fit_top_card = cards_fit[0].type
    assert fit_top_card == "running_score"

    # Agriculture persona
    cards_agri = PersonalizationEngine.rank_cards(weather, None, active_persona_override="agriculture")
    agri_top_card = cards_agri[0].type
    assert agri_top_card == "agriculture"

    # Health persona
    cards_health = PersonalizationEngine.rank_cards(weather, None, active_persona_override="health")
    health_top_card = cards_health[0].type
    assert health_top_card == "health_wellness"

    # Commuter persona
    cards_commuter = PersonalizationEngine.rank_cards(weather, None, active_persona_override="commuter")
    commuter_top_card = cards_commuter[0].type
    assert commuter_top_card == "commute"
