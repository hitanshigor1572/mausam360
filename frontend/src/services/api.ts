import {
  LocationDetails,
  LocationSearchResult,
  PersonalizedHomeResponse,
  ForecastDay,
  ForecastHour,
  AlertsResponse,
  UserProfile,
  SavedDestination,
  MausamEvent,
  PersonaKey
} from '../types';

function getBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw) {
    return import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';
  }
  let cleaned = raw.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://') && !cleaned.startsWith('/')) {
    cleaned = `https://${cleaned}`;
  }
  if (!cleaned.endsWith('/api') && !cleaned.includes('/api/')) {
    cleaned = `${cleaned.replace(/\/+$/, '')}/api`;
  }
  return cleaned;
}

const API_BASE_URL = getBaseUrl();

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const json = JSON.parse(errorText);
        errorMsg = json.detail || json.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API request failed [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Location
  resolveLocation: (latitude: number, longitude: number): Promise<LocationDetails> => {
    return request<LocationDetails>('/location/resolve', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude })
    });
  },

  searchLocations: (q: string): Promise<LocationSearchResult[]> => {
    return request<LocationSearchResult[]>(`/location/search?q=${encodeURIComponent(q)}`);
  },

  getDefaultLocation: (): Promise<LocationDetails> => {
    return request<LocationDetails>('/location/default');
  },

  // Personalized Home
  getPersonalizedHome: (
    lat?: number,
    lon?: number,
    persona?: string,
    userId: string = 'citizen_default'
  ): Promise<PersonalizedHomeResponse> => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    if (persona) params.append('persona', persona);
    params.append('user_id', userId);
    return request<PersonalizedHomeResponse>(`/home/personalized?${params.toString()}`);
  },

  refreshWeather: (lat?: number, lon?: number): Promise<{ status: string; timestamp: string }> => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    return request(`/weather/refresh?${params.toString()}`, { method: 'POST' });
  },

  // Forecast & Alerts
  getForecast: (lat?: number, lon?: number): Promise<ForecastDay[]> => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    return request<ForecastDay[]>(`/weather/forecast?${params.toString()}`);
  },

  getHourlyForecast: (lat?: number, lon?: number): Promise<ForecastHour[]> => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    return request<ForecastHour[]>(`/weather/hourly?${params.toString()}`);
  },

  getAlerts: (lat?: number, lon?: number): Promise<AlertsResponse> => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    return request<AlertsResponse>(`/alerts?${params.toString()}`);
  },

  // Profile & Interests
  getProfile: (userId: string = 'citizen_default'): Promise<UserProfile> => {
    return request<UserProfile>(`/profile?user_id=${userId}`);
  },

  saveProfile: (payload: Partial<UserProfile>): Promise<UserProfile> => {
    return request<UserProfile>('/profile', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateInterests: (interests: Record<PersonaKey, boolean>, userId: string = 'citizen_default'): Promise<UserProfile> => {
    return request<UserProfile>(`/profile/interests?user_id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(interests)
    });
  },

  // Demo Switcher Endpoints
  setDemoPersona: (persona: string, userId: string = 'citizen_default') => {
    return request<{ status: string; active_persona: string; message: string }>('/demo/set-persona', {
      method: 'POST',
      body: JSON.stringify({ persona })
    });
  },

  toggleSevereWarning: () => {
    return request<{ severe_warning_active: boolean; message: string }>('/demo/toggle-severe-warning', {
      method: 'POST'
    });
  },

  getDemoStatus: () => {
    return request<any>('/demo/status');
  },

  // Saved Destinations
  getDestinations: (userId: string = 'citizen_default'): Promise<SavedDestination[]> => {
    return request<SavedDestination[]>(`/destinations?user_id=${userId}`);
  },

  addDestination: (payload: { name: string; latitude: number; longitude: number; state?: string; trip_date?: string; category?: string }, userId: string = 'citizen_default'): Promise<SavedDestination> => {
    return request<SavedDestination>(`/destinations?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteDestination: (id: number, userId: string = 'citizen_default') => {
    return request(`/destinations/${id}?user_id=${userId}`, { method: 'DELETE' });
  },

  // Events
  getEvents: (userId: string = 'citizen_default'): Promise<MausamEvent[]> => {
    return request<MausamEvent[]>(`/events?user_id=${userId}`);
  },

  addEvent: (payload: { title: string; event_date: string; event_time: string; location_name: string; latitude: number; longitude: number }, userId: string = 'citizen_default'): Promise<MausamEvent> => {
    return request<MausamEvent>(`/events?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteEvent: (id: number, userId: string = 'citizen_default') => {
    return request(`/events/${id}?user_id=${userId}`, { method: 'DELETE' });
  }
};
