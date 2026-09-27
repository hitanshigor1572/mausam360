import datetime
from typing import List, Dict, Any, Optional
from backend.models.preferences import UserPreference
from backend.schemas.location import LocationDetails
from backend.schemas.weather import NormalizedWeatherData, WeatherWarning
from backend.schemas.home import PersonalizedCard, CardScoreBreakdown
from backend.services.recommendation_engine import RecommendationEngine

class PersonalizationEngine:
    """
    Core Dynamic Personalization Engine for Mausam.
    Calculates multi-dimensional relevance scores for weather cards:
      final_score = base_priority + (profile_relevance * 40) + (weather_relevance * 35) + (time_relevance * 25) + severe_alert_boost
    
    Ensures severe weather warnings strictly override normal personalization (Priority 1),
    while tailoring remaining cards to active personas and current meteorological triggers.
    """

    @classmethod
    def rank_cards(
        cls,
        weather: NormalizedWeatherData,
        preferences: Optional[UserPreference],
        active_persona_override: Optional[str] = None
    ) -> List[PersonalizedCard]:
        cards: List[PersonalizedCard] = []
        current = weather.current
        hour_now = datetime.datetime.now().hour
        has_critical_warning = any(w.severity in ["critical", "warning"] for w in weather.warnings)

        # 1. Determine active persona configuration
        # If active_persona_override is set (e.g. from SIH Judge Demo Toolbar), use it directly
        effective_persona = active_persona_override or (preferences.active_demo_persona if preferences else None)
        
        # Build profile interest dictionary
        profile_interests = {
            "fitness": False,
            "health": False,
            "agriculture": False,
            "travel": False,
            "family": False,
            "commuter": False,
            "beach": False,
            "event_planner": False
        }

        if effective_persona and effective_persona in profile_interests:
            # Single persona override for judge demo
            profile_interests[effective_persona] = True
        elif preferences:
            profile_interests["fitness"] = bool(preferences.fitness)
            profile_interests["health"] = bool(preferences.health)
            profile_interests["agriculture"] = bool(preferences.agriculture)
            profile_interests["travel"] = bool(preferences.travel)
            profile_interests["family"] = bool(preferences.family)
            profile_interests["commuter"] = bool(preferences.commuter)
            profile_interests["beach"] = bool(preferences.beach)
            profile_interests["event_planner"] = bool(preferences.event_planner)
        else:
            # Default fallback: Fitness & Health active
            profile_interests["fitness"] = True
            profile_interests["health"] = True

        # ============================================================
        # CANDIDATE CARDS GENERATION & SCORING
        # ============================================================

        # ------------------------------------------------------------
        # CARD 1: SEVERE WEATHER WARNING CARD (Always evaluated first)
        # ------------------------------------------------------------
        if weather.warnings:
            highest_warn = weather.warnings[0]
            is_critical = highest_warn.severity in ["critical", "warning"]
            # Overwhelming priority boost ONLY when critical or warning level is active
            alert_boost = 3000.0 if is_critical else 0.0
            base_p = 100.0 if is_critical else 35.0
            
            p_score = 1.0 if is_critical else 0.4
            w_score = 1.0 if is_critical else 0.5
            t_score = 1.0 if is_critical else 0.5
            final = base_p + (p_score * 40) + (w_score * 35) + (t_score * 25) + alert_boost
            
            cards.append(
                PersonalizedCard(
                    id="severe_alert_priority_card",
                    type="warning_alert",
                    title="Official IMD Weather Warning" if is_critical else "IMD Weather Watch Bulletin",
                    category="Safety & Emergency",
                    priority=1 if is_critical else 40,
                    final_score=round(final, 1),
                    explanation=(
                        "🚨 Shown at top priority because an official IMD Severe Weather Warning takes absolute precedence over personal preferences."
                        if is_critical
                        else "Routine IMD meteorological watch bulletin for regional atmospheric awareness."
                    ),
                    score_breakdown=CardScoreBreakdown(
                        base_priority=base_p,
                        profile_relevance=round(p_score * 40, 1),
                        weather_relevance=round(w_score * 35, 1),
                        time_relevance=round(t_score * 25, 1),
                        severe_alert_boost=alert_boost
                    ),
                    data={
                        "warning": highest_warn.model_dump(),
                        "is_critical": is_critical
                    }
                )
            )

        # ------------------------------------------------------------
        # CARD 2: RUNNING & FITNESS CONDITIONS CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["fitness"] else 0.15
        # Weather relevance: high if pleasant temperature or rain threat
        w_weight = 0.9 if (18 <= current.temperature <= 28 and current.rain_probability < 40) else 0.6
        # Time relevance: peak running hours (morning 5-9 AM, evening 17-20 PM)
        t_weight = 0.95 if (5 <= hour_now <= 9 or 17 <= hour_now <= 20) else 0.5
        
        running_data = RecommendationEngine.calculate_running_score(current)
        score_val = 50.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_running_conditions",
                type="running_score",
                title="Outdoor Activity & Running Score",
                category="Fitness",
                priority=10,
                final_score=round(score_val, 1),
                explanation=(
                    "Shown with high priority because Outdoor Fitness is in your interests, and current conditions are actively evaluated for outdoor exercise."
                    if profile_interests["fitness"]
                    else "General outdoor activity score calculated for today's weather profile."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=50.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data=running_data
            )
        )

        # ------------------------------------------------------------
        # CARD 3: HEALTH, AQI & UV CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["health"] else 0.25
        w_weight = 0.95 if ((current.aqi and current.aqi > 100) or current.uv_index > 6.0) else 0.6
        t_weight = 0.9 if (10 <= hour_now <= 16) else 0.6
        
        health_data = RecommendationEngine.generate_health_advisory(current)
        score_val = 55.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_health_aqi_uv",
                type="health_wellness",
                title="Air Quality & UV Health Insights",
                category="Health",
                priority=10,
                final_score=round(score_val, 1),
                explanation=(
                    "Shown because Health is selected in your profile and UV/AQI levels warrant hydration or sun protection."
                    if profile_interests["health"]
                    else "Daily environmental health summary (AQI and UV index)."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=55.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data=health_data
            )
        )

        # ------------------------------------------------------------
        # CARD 4: AGRICULTURE & IRRIGATION ADVISORY CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["agriculture"] else 0.1
        w_weight = 0.9 if profile_interests["agriculture"] else (0.9 if current.rain_probability > 40 else 0.6)
        t_weight = 0.85
        
        agri_data = RecommendationEngine.generate_agriculture_guidance(current, weather.forecast)
        score_val = 55.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_agriculture_guidance",
                type="agriculture",
                title="Agromet Advisory & Irrigation Guidance",
                category="Agriculture & Gardening",
                priority=10,
                final_score=round(score_val, 1),
                explanation=(
                    "Promoted because Agriculture/Gardening is in your interests. Displays irrigation guidance based on 48h rainfall probabilities and soil moisture."
                    if profile_interests["agriculture"]
                    else "Agromet meteorological guidance for local crops and soil management."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=55.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data=agri_data
            )
        )

        # ------------------------------------------------------------
        # CARD 5: DAILY COMMUTER CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["commuter"] else 0.15
        w_weight = 0.9 if profile_interests["commuter"] else (0.9 if (current.rain_probability > 40 or current.visibility < 6.0) else 0.5)
        t_weight = 1.0 if (7 <= hour_now <= 10 or 17 <= hour_now <= 20) else 0.5
        
        commute_data = RecommendationEngine.generate_commute_advisory(current)
        score_val = 55.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_daily_commute",
                type="commute",
                title="Daily Transit & Commute Outlook",
                category="Commuter",
                priority=10,
                final_score=round(score_val, 1),
                explanation=(
                    "Shown because Daily Commuter is in your interests. Highlights rush-hour weather hazards and road visibility."
                    if profile_interests["commuter"]
                    else "Transit and route visibility conditions."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=55.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data=commute_data
            )
        )

        # ------------------------------------------------------------
        # CARD 6: TRAVELLER & SMART PACKING CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["travel"] else 0.2
        w_weight = 0.8
        t_weight = 0.7
        
        packing_items = RecommendationEngine.generate_packing_suggestions(
            current.temperature, current.rain_probability, current.uv_index
        )
        score_val = 45.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_travel_packing",
                type="travel_advice",
                title="Travel Weather & Smart Packing Assistant",
                category="Travel",
                priority=18,
                final_score=round(score_val, 1),
                explanation=(
                    "Highlighted because Travel is an active interest. Automatically suggests luggage essentials matched to forecast weather."
                    if profile_interests["travel"]
                    else "Recommended packing tips for prevailing weather."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=45.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "packing_suggestions": packing_items,
                    "destination_quick_glance": [
                        {"city": "Mumbai", "temp": 32, "cond": "Humid / Haze", "rain": 40},
                        {"city": "New Delhi", "temp": 34, "cond": "Hazy Sunshine", "rain": 10},
                        {"city": "Shimla", "temp": 14, "cond": "Cool & Clear", "rain": 15},
                    ]
                }
            )
        )

        # ------------------------------------------------------------
        # CARD 7: FAMILY & SCHOOL COMMUTE CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["family"] else 0.15
        w_weight = 0.85 if current.rain_probability > 40 else 0.5
        t_weight = 0.95 if (6 <= hour_now <= 9 or 14 <= hour_now <= 17) else 0.45
        
        score_val = 45.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_family_safety",
                type="family_routine",
                title="Family & School Routine Weather",
                category="Family & Parents",
                priority=20,
                final_score=round(score_val, 1),
                explanation=(
                    "Customized for Parents & Families. Evaluates morning school hours and afternoon returns for rain, heat, and comfort."
                    if profile_interests["family"]
                    else "Family routine weather summary."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=45.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "school_commute": {
                        "time": "07:30 AM",
                        "rain_chance": f"{current.rain_probability}%",
                        "temp": f"{current.temperature - 2}°C",
                        "advice": "Carry rain protection and light jackets for the early morning bus stop." if current.rain_probability > 40 else "Pleasant morning for school commute."
                    },
                    "afternoon_return": {
                        "time": "02:30 PM",
                        "uv": current.uv_index,
                        "temp": f"{current.temperature + 2}°C",
                        "advice": "Keep children hydrated during afternoon dismissal."
                    }
                }
            )
        )

        # ------------------------------------------------------------
        # CARD 8: BEACHGOER & MARINE CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["beach"] else 0.1
        w_weight = 0.9 if weather.location.is_coastal else 0.2
        t_weight = 0.8 if (8 <= hour_now <= 18) else 0.4
        
        score_val = 40.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_marine_beach",
                type="marine_beach",
                title="Coastal & Marine Conditions",
                category="Beach & Watersports",
                priority=22,
                final_score=round(score_val, 1),
                explanation=(
                    "Shown because Beach/Marine is an interest and your station is located along a coastal maritime sector."
                    if profile_interests["beach"]
                    else "Coastal marine, wave, and tide status."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=40.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "is_coastal": weather.location.is_coastal,
                    "wave_height_m": current.wave_height if current.wave_height else "1.4 m",
                    "tide_schedule": current.tide_info if current.tide_info else "High Tide: 16:30 | Low Tide: 22:15",
                    "sea_condition": "Moderate chop - safe for designated beach zones" if not has_critical_warning else "Rough sea - Fishermen advised not to venture into deep sea",
                    "uv_radiation": f"UV {current.uv_index} - High sun exposure along open sand",
                    "disclaimer": "Official Indian National Centre for Ocean Information Services (INCOIS) / IMD Marine Bulletin."
                }
            )
        )

        # ------------------------------------------------------------
        # CARD 9: OUTDOOR EVENTS & PLANNER CARD
        # ------------------------------------------------------------
        p_weight = 1.0 if profile_interests["event_planner"] else 0.15
        w_weight = 0.8
        t_weight = 0.75
        
        event_score = RecommendationEngine.calculate_event_comfort(
            current.temperature, current.humidity, current.rain_probability, current.wind_speed
        )
        score_val = 40.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_event_planner",
                type="event_planner",
                title="Event Planning & Outdoor Comfort Score",
                category="Events",
                priority=24,
                final_score=round(score_val, 1),
                explanation=(
                    "Customized for Event Planners. Evaluates open-air comfort index, wind stability, and sudden precipitation probability."
                    if profile_interests["event_planner"]
                    else "General outdoor gathering comfort score."
                ),
                score_breakdown=CardScoreBreakdown(
                    base_priority=40.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "comfort_score": event_score["score"],
                    "verdict": event_score["verdict"],
                    "next_weekend_outlook": "Saturday: 31°C (20% rain) | Sunday: 32°C (15% rain)"
                }
            )
        )

        # ------------------------------------------------------------
        # CARD 10: SUNRISE, SUNSET & GOLDEN HOUR CARD
        # ------------------------------------------------------------
        p_weight = 0.9 if (profile_interests["fitness"] or profile_interests["beach"]) else 0.4
        w_weight = 0.7
        t_weight = 0.95 if (5 <= hour_now <= 7 or 17 <= hour_now <= 19) else 0.5
        score_val = 40.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_sun_times",
                type="sun_astronomy",
                title="Sun Track & Golden Hour",
                category="Astronomy & Context",
                priority=30,
                final_score=round(score_val, 1),
                explanation="Tracking daylight cycles and dusk/dawn transitions for outdoor activities.",
                score_breakdown=CardScoreBreakdown(
                    base_priority=40.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "sunrise": weather.sun.sunrise,
                    "sunset": weather.sun.sunset,
                    "daylight": weather.sun.daylight_hours,
                    "golden_hour": weather.sun.golden_hour
                }
            )
        )

        # ------------------------------------------------------------
        # CARD 11: PRECIPITATION & WIND RADAR METRICS CARD
        # ------------------------------------------------------------
        p_weight = 0.6 if (profile_interests["agriculture"] or profile_interests["commuter"]) else 0.25
        w_weight = 0.85 if (current.rainfall_24h > 0 or current.rain_probability > 30) else 0.4
        t_weight = 0.6
        score_val = 35.0 + (p_weight * 40) + (w_weight * 35) + (t_weight * 25)
        
        cards.append(
            PersonalizedCard(
                id="card_rain_wind_radar",
                type="rain_wind",
                title="Precipitation & Wind Diagnostics",
                category="Surface Observations",
                priority=35,
                final_score=round(score_val, 1),
                explanation="Real-time wind velocity and rainfall probability diagnostics from IMD surface sensors.",
                score_breakdown=CardScoreBreakdown(
                    base_priority=35.0,
                    profile_relevance=round(p_weight * 40, 1),
                    weather_relevance=round(w_weight * 35, 1),
                    time_relevance=round(t_weight * 25, 1),
                    severe_alert_boost=0.0
                ),
                data={
                    "rain_probability": current.rain_probability,
                    "rainfall_24h": current.rainfall_24h,
                    "wind_speed": current.wind_speed,
                    "wind_direction": current.wind_direction,
                    "pressure": current.pressure,
                    "humidity": current.humidity
                }
            )
        )

        # ============================================================
        # SORT CARDS STRICTLY BY FINAL_SCORE DESCENDING
        # ============================================================
        cards.sort(key=lambda c: c.final_score, reverse=True)

        return cards
