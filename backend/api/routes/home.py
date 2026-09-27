from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from typing import Optional

from backend.core.database import get_db
from backend.models.user import User
from backend.schemas.location import LocationDetails
from backend.schemas.home import PersonalizedHomeResponse
from backend.services.geolocation_service import GeolocationService
from backend.services.weather_service import weather_service
from backend.services.personalization_engine import PersonalizationEngine
from backend.api.routes.profile import _get_or_create_user, DEFAULT_USER_ID

router = APIRouter(prefix="/home", tags=["Personalized Home"])

@router.get("/personalized", response_model=PersonalizedHomeResponse)
async def get_personalized_home(
    lat: Optional[float] = Query(None, description="Current device latitude"),
    lon: Optional[float] = Query(None, description="Current device longitude"),
    user_id: str = Query(DEFAULT_USER_ID, description="Unique citizen user ID"),
    persona: Optional[str] = Query(None, description="Optional instant demo persona override ('fitness', 'agriculture', etc.)"),
    db: Session = Depends(get_db)
):
    """
    Main Personalized Homepage Endpoint (SIH26076 Core Innovation).
    Consolidates:
      1. Location resolution
      2. Normalized Weather (IMD or high-fidelity fallback)
      3. User Profile & Persona Interests
      4. Severe Weather Warning Precedence
      5. Multi-factor Personalization Engine Ranking
    """
    # 1. Resolve Location
    user = _get_or_create_user(db, user_id)
    if lat is not None and lon is not None:
        location = await GeolocationService.resolve_coordinates(lat, lon)
    else:
        # Use user's profile location or default to Bhuj
        location = LocationDetails(
            name=user.home_city or "Bhuj",
            district=user.home_district or "Kutch",
            state=user.home_state or "Gujarat",
            latitude=user.latitude or 23.2420,
            longitude=user.longitude or 69.6669,
            is_coastal=True
        )

    # 2. Fetch Normalized Weather Data
    weather = await weather_service.get_weather(location)

    # 3. Determine active persona label for ranking & UI display
    single_override = persona or (user.preference.active_demo_persona if user.preference else None)
    if single_override and single_override not in ["clear", "auto"]:
        effective_persona = single_override
        active_persona_label = single_override
    else:
        effective_persona = None
        p = user.preference
        if p:
            all_keys = [
                ("fitness", "Fitness"),
                ("health", "Health"),
                ("agriculture", "Agriculture"),
                ("travel", "Travel"),
                ("commuter", "Commuter"),
                ("family", "Family"),
                ("beach", "Beach"),
                ("event_planner", "Events")
            ]
            active_names = [label for key, label in all_keys if getattr(p, key, False)]
            if active_names:
                if len(active_names) <= 2:
                    active_persona_label = f"Saved Profile ({', '.join(active_names)})"
                else:
                    active_persona_label = f"Saved Profile ({active_names[0]}, {active_names[1]} +{len(active_names)-2})"
            else:
                active_persona_label = "Saved Profile (Standard)"
        else:
            active_persona_label = "Saved Profile (Standard)"

    # 4. Invoke Personalization Engine
    ranked_cards = PersonalizationEngine.rank_cards(
        weather=weather,
        preferences=user.preference,
        active_persona_override=effective_persona
    )

    has_critical = any(w.severity in ["critical", "warning"] for w in weather.warnings)

    return PersonalizedHomeResponse(
        location=weather.location,
        current_weather=weather.current,
        warnings=weather.warnings,
        has_active_critical_warning=has_critical,
        active_persona=active_persona_label,
        cards=ranked_cards,
        meta={
            "provider": weather.provider,
            "is_demo_data": weather.is_demo_data,
            "timestamp": weather.data_timestamp,
            "cached": True
        }
    )
