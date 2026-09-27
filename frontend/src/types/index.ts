export type PersonaKey = 
  | 'fitness' 
  | 'health' 
  | 'agriculture' 
  | 'travel' 
  | 'commuter' 
  | 'family' 
  | 'beach' 
  | 'event_planner';

export interface LocationDetails {
  name: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  station_code?: string;
  is_coastal: boolean;
}

export interface LocationSearchResult {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  is_coastal: boolean;
}

export interface WeatherWarning {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'watch' | 'advisory';
  description: string;
  start_time: string;
  end_time: string;
  source: string;
  affected_area: string;
  action_advisory: string;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  condition: string;
  condition_code: string;
  rainfall_24h: number;
  rain_probability: number;
  uv_index: number;
  aqi?: number;
  aqi_category?: string;
  pressure: number;
  visibility: number;
  dew_point?: number;
  soil_moisture?: number;
  is_soil_moisture_simulated?: boolean;
  wave_height?: number;
  tide_info?: string;
}

export interface ForecastHour {
  time: string;
  temperature: number;
  feels_like: number;
  rain_probability: number;
  condition: string;
  condition_code: string;
  wind_speed: number;
  uv_index: number;
}

export interface ForecastDay {
  date: string;
  day_name: string;
  temp_min: number;
  temp_max: number;
  rain_probability: number;
  rainfall_mm: number;
  condition: string;
  condition_code: string;
  summary: string;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  daylight_hours: string;
  golden_hour: string;
}

export interface CardScoreBreakdown {
  base_priority: number;
  profile_relevance: number;
  weather_relevance: number;
  time_relevance: number;
  severe_alert_boost: number;
}

export interface PersonalizedCard {
  id: string;
  type: string;
  title: string;
  category: string;
  priority: number;
  final_score: number;
  explanation: string;
  score_breakdown: CardScoreBreakdown;
  data: Record<string, any>;
}

export interface PersonalizedHomeResponse {
  location: LocationDetails;
  current_weather: CurrentWeather;
  warnings: WeatherWarning[];
  has_active_critical_warning: boolean;
  active_persona: string;
  cards: PersonalizedCard[];
  meta: {
    provider: string;
    is_demo_data: boolean;
    timestamp: string;
    cached: boolean;
  };
}

export interface UserProfile {
  user_id: string;
  name: string;
  home_city: string;
  home_district: string;
  home_state: string;
  latitude: number;
  longitude: number;
  interests: Record<PersonaKey, boolean>;
  active_demo_persona?: string | null;
  units: string;
  location_enabled: boolean;
}

export interface SavedDestination {
  id: number;
  name: string;
  district?: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  trip_date?: string;
  category: string;
  current_weather?: CurrentWeather;
  warning?: WeatherWarning;
  packing_suggestions: string[];
}

export interface MausamEvent {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  location_name: string;
  latitude: number;
  longitude: number;
  is_outdoor: string;
  outdoor_comfort_score: number;
  comfort_verdict: string;
  advisory: string;
  forecast_temp: number;
  rain_risk: string;
}

export interface AlertsResponse {
  location_name: string;
  active_count: number;
  critical_count: number;
  warning_count: number;
  watch_count: number;
  advisory_count: number;
  alerts: WeatherWarning[];
  official_source: string;
  bulletin_issued: string;
}
