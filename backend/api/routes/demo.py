from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.schemas.profile import SetDemoPersonaRequest
from backend.services.mock_provider import MockWeatherProvider
from backend.services.weather_service import weather_service
from backend.api.routes.profile import DEFAULT_USER_ID, _get_or_create_user

router = APIRouter(prefix="/demo", tags=["SIH Judge Demo"])

@router.post("/set-persona")
def set_demo_persona(payload: SetDemoPersonaRequest, user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    """
    Instantly switch persona for live SIH judge demonstration.
    Allows judges to experience the same weather dataset dynamically reordered.
    """
    user = _get_or_create_user(db, user_id)
    persona = payload.persona.lower()
    valid_personas = ["health", "fitness", "travel", "family", "agriculture", "commuter", "beach", "event_planner", "clear", "auto"]
    
    if persona not in valid_personas:
        raise HTTPException(status_code=400, detail=f"Invalid persona. Supported: {valid_personas}")

    if persona in ["clear", "auto"]:
        user.preference.active_demo_persona = None
    else:
        user.preference.active_demo_persona = persona
    
    db.commit()
    return {
        "status": "success",
        "active_persona": user.preference.active_demo_persona,
        "message": f"Homepage dynamically adapted to '{persona}' persona."
    }

@router.post("/toggle-severe-warning")
def toggle_severe_warning():
    """
    Toggles the simulated IMD Severe Thunderstorm Warning to demonstrate
    that Severe Weather Alerts strictly override normal personalization (Priority 1 rule).
    """
    current_state = MockWeatherProvider.is_severe_warning_active()
    new_state = not current_state
    MockWeatherProvider.set_severe_warning_active(new_state)
    # Invalidate cache so changes reflect instantly
    weather_service.invalidate_cache()
    
    return {
        "severe_warning_active": new_state,
        "message": "🚨 Severe Thunderstorm Warning ACTIVE. Observe Priority 1 override on homepage!" if new_state else "✅ Severe warning cleared. Standard personalization restored."
    }

@router.get("/status")
def get_demo_status(user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    user = _get_or_create_user(db, user_id)
    return {
        "active_demo_persona": user.preference.active_demo_persona or "auto (based on interests)",
        "severe_warning_simulated": MockWeatherProvider.is_severe_warning_active(),
        "available_personas": [
            {"id": "fitness", "name": "🏃 Outdoor Fitness", "key_metric": "Running score, UV & wind"},
            {"id": "health", "name": "❤️ Health-Conscious", "key_metric": "AQI, UV & Air wellness"},
            {"id": "agriculture", "name": "🌾 Agriculture / Gardener", "key_metric": "Rain forecast & Soil moisture"},
            {"id": "travel", "name": "✈️ Traveller", "key_metric": "Destinations & Packing tips"},
            {"id": "commuter", "name": "🚗 Daily Commuter", "key_metric": "Transit & Visibility hazards"},
            {"id": "family", "name": "👨‍👩‍👧 Parents & Families", "key_metric": "School hours & Rain safety"},
            {"id": "beach", "name": "🏖️ Beach & Marine", "key_metric": "Wave height, Tides & Wind"},
            {"id": "event_planner", "name": "🎉 Event Planner", "key_metric": "Outdoor comfort score"}
        ]
    }
