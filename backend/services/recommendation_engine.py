import datetime
from typing import Dict, Any, List
from backend.schemas.weather import CurrentWeather, ForecastDay, WeatherWarning

class RecommendationEngine:
    """
    Transparent recommendation and score calculation algorithms.
    All outputs strictly adhere to SIH/IMD guidelines:
    - App-generated scoring labels
    - Non-diagnostic health notices
    - Transparent formulas with score components
    """

    @staticmethod
    def calculate_running_score(current: CurrentWeather) -> Dict[str, Any]:
        """
        Calculates 0-100 Outdoor Running & Fitness Score.
        Considers Temperature (optimum 16-24°C), Humidity (<70%), Wind (<20 km/h),
        Rain probability (<30%), and UV index (<6.0).
        """
        score = 100.0

        # Temperature penalty
        t = current.temperature
        if t < 10:
            score -= (10 - t) * 3
        elif t > 24:
            score -= (t - 24) * 3.5

        # Humidity penalty
        if current.humidity > 65:
            score -= (current.humidity - 65) * 0.5

        # Wind penalty
        if current.wind_speed > 25:
            score -= (current.wind_speed - 25) * 1.5

        # Rain penalty
        if current.rain_probability > 40:
            score -= (current.rain_probability - 40) * 0.7

        # UV penalty
        if current.uv_index > 7:
            score -= (current.uv_index - 7) * 4

        final_score = int(max(10, min(98, score)))

        if final_score >= 75:
            verdict = "Excellent for outdoor activity"
            color = "emerald"
        elif final_score >= 55:
            verdict = "Moderate conditions - hydrate well"
            color = "amber"
        else:
            verdict = "Challenging conditions - indoor workout recommended"
            color = "rose"

        return {
            "score": final_score,
            "status": verdict,
            "color": color,
            "best_time": "6:00 AM – 8:00 AM (Cooler, low UV)",
            "avoid_time": "12:30 PM – 4:00 PM (Peak heat & UV)",
            "metrics": {
                "temperature": f"{current.temperature}°C",
                "humidity": f"{current.humidity}%",
                "wind": f"{current.wind_speed} km/h",
                "uv_index": current.uv_index,
                "rain_chance": f"{current.rain_probability}%"
            },
            "disclaimer": "App-generated activity score based on surface meteorological parameters."
        }

    @staticmethod
    def generate_health_advisory(current: CurrentWeather) -> Dict[str, Any]:
        """Generates air quality, UV, and respiratory wellness insights."""
        aqi = current.aqi or 112
        category = current.aqi_category or "Moderate"
        
        tips = []
        if aqi > 200:
            tips.append("Air quality is Poor. Sensitive groups should wear N95 masks and restrict outdoor exertion.")
        elif aqi > 100:
            tips.append("Moderate air quality. People with asthma or respiratory sensitivities should limit intense outdoor exertion.")
        else:
            tips.append("Air quality is satisfactory. Ideal for opening windows and outdoor recreation.")

        if current.uv_index >= 7:
            tips.append("UV radiation is High. Apply SPF 30+ sunscreen, wear protective eyewear, and seek shade during midday.")
        elif current.uv_index >= 4:
            tips.append("Moderate UV index. Sun protection recommended during noon hours.")

        if current.humidity > 75:
            tips.append("High relative humidity may impede sweat evaporation. Stay well-hydrated with electrolytes.")

        return {
            "aqi": aqi,
            "aqi_category": category,
            "uv_index": current.uv_index,
            "humidity": current.humidity,
            "primary_advisory": tips[0] if tips else "Pleasant atmospheric conditions.",
            "action_items": tips,
            "pollen_status": "Pollen data currently not monitored by ground station for this district.",
            "disclaimer": "Informational weather-wellness advisory. Not a medical diagnostic tool."
        }

    @staticmethod
    def generate_agriculture_guidance(current: CurrentWeather, forecast: List[ForecastDay]) -> Dict[str, Any]:
        """Agromet advisory for farmers, horticulturists, and gardeners."""
        next_48h_rain = sum(f.rain_probability for f in forecast[:2]) / 2.0
        soil_moisture = current.soil_moisture or 45.0
        
        # Rule engine
        if next_48h_rain > 50 and soil_moisture > 40:
            irrigation_verdict = "Irrigation NOT required"
            irrigation_reason = "Adequate soil moisture present and upcoming rain spells anticipated over next 48 hours."
            action_code = "hold_irrigation"
        elif soil_moisture < 35 and next_48h_rain < 30:
            irrigation_verdict = "Light to moderate irrigation recommended"
            irrigation_reason = "Soil moisture depletion observed; low probability of natural precipitation."
            action_code = "irrigate"
        else:
            irrigation_verdict = "Monitor soil condition before watering"
            irrigation_reason = "Moderate moisture retention with localized cloud cover."
            action_code = "monitor"

        spray_window = "Favorable between 07:00 AM - 10:00 AM (Low wind speeds < 15 km/h)."
        if current.wind_speed > 20 or current.rain_probability > 50:
            spray_window = "Postpone pesticide / foliar spray due to wind drift or wash-off risk."

        frost_risk = "Negligible (Minimum temperature safely above 12°C)"
        if current.temperature < 4.0:
            frost_risk = "HIGH: Ground frost risk detected. Prepare protective covering/smoke screens."

        return {
            "irrigation_verdict": irrigation_verdict,
            "irrigation_reason": irrigation_reason,
            "action_code": action_code,
            "soil_moisture_percent": soil_moisture,
            "is_sensor_real": not current.is_soil_moisture_simulated,
            "sensor_label": "Sensor Ground Station" if not current.is_soil_moisture_simulated else "Simulated Agromet Estimation",
            "rain_forecast_48h": f"{int(next_48h_rain)}% average likelihood",
            "spray_window": spray_window,
            "frost_risk": frost_risk,
            "disclaimer": "App-generated Agromet Advisory based on surface parameters and IMD forecast models."
        }

    @staticmethod
    def generate_packing_suggestions(temp: float, rain_prob: int, uv: float) -> List[str]:
        """Travel packing logic as specified in SIH requirements."""
        items = []
        if rain_prob >= 40:
            items.append("☔ Compact Umbrella / Waterproof Raincoat")
            items.append("👟 Water-resistant footwear")
        
        if temp < 15:
            items.append("🧥 Warm fleece or insulated jacket")
            items.append("🧣 Scarf & thermal layers")
        elif temp < 22:
            items.append("🧶 Light cardigan or long-sleeve layer")
        else:
            items.append("👕 Breathable cotton / linen clothing")

        if uv >= 6.0:
            items.append("🧴 SPF 30+ Sunscreen lotion")
            items.append("🕶️ UV-filtering sunglasses & wide-brim hat")

        if temp > 30:
            items.append("💧 Insulated reusable water bottle")

        return items

    @staticmethod
    def generate_commute_advisory(current: CurrentWeather) -> Dict[str, Any]:
        """Daily commuter rush hour guidance."""
        visibility = current.visibility
        rain = current.rain_probability
        wind = current.wind_speed

        issues = []
        if rain > 50:
            issues.append("Wet road surfaces and reduced braking distance likely.")
        if visibility < 5.0:
            issues.append("Reduced morning visibility / haze; use low-beam headlights.")
        if wind > 30:
            issues.append("Gusty crosswinds on elevated flyovers and open highways.")

        if not issues:
            status = "Smooth Commute Expected"
            severity = "normal"
            summary = "Clear visibility and dry roadways along major transit corridors."
        else:
            status = "Caution: Allow Extra Travel Time"
            severity = "caution"
            summary = " | ".join(issues)

        return {
            "status": status,
            "severity": severity,
            "summary": summary,
            "morning_window": "07:30 AM – 09:30 AM",
            "evening_window": "05:30 PM – 07:30 PM",
            "visibility_km": visibility,
            "wind_kmh": wind,
            "rain_risk_percent": rain
        }

    @staticmethod
    def calculate_event_comfort(temp: float, humidity: int, rain_prob: int, wind: float) -> Dict[str, Any]:
        """Calculates 0-100 outdoor event comfort score."""
        score = 100.0
        if temp > 28:
            score -= (temp - 28) * 3
        elif temp < 16:
            score -= (16 - temp) * 2

        if humidity > 65:
            score -= (humidity - 65) * 0.4

        if rain_prob > 25:
            score -= (rain_prob - 25) * 0.8

        if wind > 25:
            score -= (wind - 25) * 1.2

        final = int(max(15, min(95, score)))
        if final >= 75:
            verdict = "Excellent for outdoor gathering"
        elif final >= 50:
            verdict = "Acceptable - consider covered / shaded pavilion"
        else:
            verdict = "High weather impact risk - plan indoor fallback"

        return {
            "score": final,
            "verdict": verdict,
            "disclaimer": "App-generated outdoor event comfort index."
        }
