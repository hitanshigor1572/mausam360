# 🌤️ Mausam: Personalized Weather Homepage Engine
### Smart India Hackathon 2026 • Problem Statement SIH26076
**Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)  
**Title:** *"Development of personalized homepage for 'Mausam' mobile application"*

---

## 🎯 1. Core Innovation & Philosophy

Traditional weather applications present a static, one-size-fits-all dashboard that burdens citizens with irrelevant metrics. 

**Mausam solves this not by building separate fragmented apps for different users, but by building ONE unified weather platform powered by a dynamic personalization engine.**

```
                     SAME WEATHER DATA (Official IMD Observations)
                                          +
                                USER PROFILE (Active Personas)
                                          +
                                 TEMPORAL & METEOROLOGICAL CONTEXT
                                          ↓
                              PERSONALIZATION ENGINE
                  (Multi-Dimensional Scoring + Severe Alert Override)
                                          ↓
                            DIFFERENT HOMEPAGE FOR EVERY CITIZEN
```

---

## 🏆 2. Supported Personas & Dynamic Card Transformations

Mausam supports **8 distinct user personas** that dynamically rearrange and adapt their weather feed:

| Persona | Primary Weather Drivers | Sample Personalized Insight |
| :--- | :--- | :--- |
| **🏃 Outdoor Fitness** | Running score (0-100), wind, sunrise/sunset, UV index, rain chance | **Optimal running window:** 6:00 AM – 8:00 AM. Score 78/100 (Hydrate well). |
| **❤️ Health-Conscious** | CPCB AQI, particulate matter, UV radiation, humidity, respiratory advisory | **Air Quality:** Moderate (AQI 112). Sensitive groups limit midday exertion. |
| **🌾 Agriculture / Gardener**| 48h rainfall forecast, soil moisture %, spray window, frost risk, irrigation guidance | **Irrigation NOT required:** Adequate soil moisture and 48h rain forecast. |
| **✈️ Traveller** | Saved travel destinations, multi-city forecasts, smart luggage checklist | **Smart Packing:** Rain > 40% (Umbrella), Temp < 15°C (Jacket), UV > 6 (Sunscreen). |
| **🚗 Daily Commuter** | Rush hour windows (07:30–09:30 AM), road visibility, wind gusts, rain hazard | **Commute Caution:** Wet roadways and reduced braking distance anticipated. |
| **👨‍👩‍👧 Parents & Families** | Morning school bus window (07:30 AM), afternoon return UV, rain gear advisory | **School Commute:** 7:30 AM rain chance 40%. Carry light rain protection. |
| **🏖️ Beach & Marine** | Significant wave height (meters), astronomical tides, sea state, coastal alerts | **Nearshore Swell:** 1.4 m. High tide at 16:30. Safe for designated beach zones. |
| **🎉 Outdoor Event Planner** | Event comfort score (0-100), thermal comfort index, open-air contingency | **Suitability: 82/100.** Good stability for open-air stage setup. |

---

## 🚨 3. Severe Weather Warning Priority Rule (Section 9 Requirement)

Severe weather warnings must **strictly override** normal personalization. If a Red or Orange severe warning (e.g., Thunderstorm Squall, Cyclone, Extreme Heatwave) is active:

1. **Severe Weather Alert is forced to Slot #1** with a $+3000$ priority boost.
2. The user is presented with immediate **Actionable Safety Advisories** (e.g., *"Postpone non-essential outdoor travel. Do not seek shelter under isolated trees"*).
3. Normal personal interests appear below the active safety bulletin.
4. **Warnings are NEVER buried because of personalization.**

---

## 🧠 4. Dynamic Personalization Engine & Scoring Formula

The core scoring engine calculates a continuous mathematical relevance score for each candidate card:

$$\text{FinalScore} = \text{BasePriority} + (\text{ProfileRelevance} \times 40) + (\text{WeatherRelevance} \times 35) + (\text{TimeRelevance} \times 25) + \text{SevereAlertBonus}$$

### Transparent Explainability ("Why am I seeing this?")
Every card features an interactive badge allowing citizens and judges to view the exact factors:
- **Base Category Priority:** Standard baseline rank.
- **Profile Relevance:** Calculated against user's selected interests ($0.0 - 1.0$).
- **Weather Relevance:** Real-time meteorological trigger (e.g., rain threat, heat, UV peak).
- **Time Relevance:** Match against rush hour windows, morning fitness hours, or solar transit.
- **Severe Alert Boost:** Forced override ($+3000$) for emergency bulletins.

---

## 🏛️ 5. System Architecture

```
Browser / Mobile Client
        ↓
Geolocation API (navigator.geolocation) ──[Permission Denied Fallback]──> Manual City Search
        ↓
Latitude + Longitude Coordinates (No precise street addresses stored)
        ↓
React 18 + TypeScript + Vite Frontend (Government-grade MoES / IMD Design)
        ↓
FastAPI Backend (Protected Layer — NEVER exposes credentials to frontend)
        ↓
Weather Service & Cache Layer (TTL memory & SQLAlchemy database caching)
        ↓
Provider Abstraction (WeatherProvider ABC)
   ├── IMDWeatherProvider (Official IMD API Integration Layer)
   └── MockWeatherProvider (High-fidelity Indian regional meteorological dataset)
        ↓
Normalized Weather Schema (NormalizedWeatherData)
        ↓
Personalization & Recommendation Engine
        ↓
Dynamic Ranked JSON Stream
```

---

## ⚡ 6. Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS with Government-grade MoES palette (Deep Navy `#0A2540`, Sky `#0284C7`, Saffron `#EA580C`, Emerald `#059669`)
- **Icons:** Lucide React
- **Charts:** Recharts (Diurnal 24h AreaChart with gradient fill)
- **Design Philosophy:** Mobile-first, WCAG AA contrast, clean government portal hierarchy.

### Backend
- **Framework:** Python 3.11+ / FastAPI
- **Data Validation:** Pydantic V2
- **HTTP Client:** HTTPX (async client with timeouts and headers)
- **Database & ORM:** SQLAlchemy 2.0 supporting PostgreSQL (`postgresql+psycopg2`) with an automated seamless fallback to SQLite (`sqlite:///./mausam.db`) for zero-setup demo reliability.
- **Testing:** Pytest & pytest-asyncio (100% passing test suite)

---

## 🚀 7. Quick Setup & Execution Guide

### Prerequisites
- Node.js 18+ (tested on Node v22)
- Python 3.10+ (tested on Python 3.13)

### Step 1: Start the FastAPI Backend
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
*The backend automatically initializes tables and runs at `http://localhost:8000`.*  
*Interactive Swagger documentation: `http://localhost:8000/docs`*

### Step 2: Start the React Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```
*The application opens at `http://localhost:5173`.*

### Step 3: Or Run via Docker Compose (1-Command Full Stack)
```bash
# Run both Backend and Frontend containers simultaneously
docker-compose up --build
```
*Frontend will be live at `http://localhost` and Backend at `http://localhost:8000`.*

---

## ☁️ 8. Cloud Deployment Guide

### Deploy Backend (Render / Railway)
1. Set Build Command: `pip install -r backend/requirements.txt`
2. Set Start Command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
3. Set Environment Variables:
   - `WEATHER_PROVIDER=live` (Real-time global weather, zero keys required)
   - `ENV=production`
   - `DATABASE_URL=sqlite:///./mausam.db` (or your PostgreSQL connection string)

### Deploy Frontend (Vercel / Netlify)
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable:
   - `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`

## 🧪 8. Automated Tests

Run the test suite covering personalization scoring, severe weather override, and FastAPI endpoints:
```bash
python -m pytest backend/tests -v
```
**Results:** All unit and integration tests pass successfully with zero failures.

---

## 🏅 9. SIH Judge Live Demonstration Walkthrough

When presenting to Smart India Hackathon judges, use the sticky **SIH Judge Demo Toolbar** at the top of the screen:

1. **Instant Persona Transformation (Core Innovation):**
   - Click **🏃 Fitness**: Observe the *Outdoor Running Score (78/100)* and *UV Index* cards rise to the top.
   - Click **🌾 Agriculture**: Observe *Agromet Advisory & Irrigation Guidance* and *Soil Moisture* become #1.
   - Click **✈️ Traveller**: Observe *Travel Weather & Smart Packing Suggestions* become #1.
   - Click **🚗 Commuter**: Observe *Morning/Evening Rush Hour Outlook* become #1.
   - *Notice: The cards rearrange dynamically in real time without reloading the application!*

2. **Severe Weather Priority Override (Section 9 Requirement):**
   - While in any persona (e.g. Fitness or Agriculture), click **🚨 Simulate Thunderstorm**.
   - Notice that the **Official IMD Severe Thunderstorm Warning** immediately takes Priority Slot #1 with red animated alert styling and safety directives, while fitness cards are deferred below it.
   - Click it again to clear the warning and restore standard persona ranking.

3. **Algorithm Explainability ("Why am I seeing this?"):**
   - Click the **Why this card?** badge on any weather card.
   - Show the judges the transparent mathematical formula: Base Priority + User Profile (40 pts) + Weather Condition (35 pts) + Time Window (25 pts).

4. **Location Privacy & Resilience:**
   - Click the location pill (📍 Bhuj, Gujarat) in the header.
   - Test "Use My Current Location" (browser GPS) or search for any Indian station (Mumbai, New Delhi, Shimla, Ahmedabad).
   - Demonstrate that denying location never crashes the app and provides a clean manual fallback.

5. **Travel Smart Packing:**
   - Open the **Travel** tab.
   - Add a new destination (e.g., Shimla or Mumbai). Observe the rule-based luggage checklist (e.g., umbrella if rain > 40%, warm jacket if temp < 15°C).

6. **Interactive Forecast & Alerts:**
   - Open the **Forecast** tab to view the Recharts 24-hour diurnal temperature and rain trend chart.
   - Open the **Alerts** tab to view the official IMD NWFC bulletin center with severity filtering.

---

## 🔒 10. Official IMD API Integration & Security

### Security Rules
- **No API secrets in frontend:** Frontend calls only `/api/*`. External IMD API keys are stored in backend environment variables.
- **Provider Adapter Architecture:**
  - `WeatherProvider` (Abstract Interface)
  - `IMDWeatherProvider` (Official IMD API implementation)
  - `MockWeatherProvider` (Offline / sandbox mode for hackathon judging)

### Configuring Official IMD Access
To connect live IMD production data, update `.env` or set environment variables:
```env
WEATHER_PROVIDER=imd
IMD_API_BASE_URL=https://api.imd.gov.in/v1
IMD_API_KEY=your_official_moes_imd_api_key_here
```
If credentials are not yet whitelisted or network is offline, the provider automatically falls back to high-fidelity mock data and flags the status badge in the header as **"🟡 Demo Mode"**.

---

## 📋 11. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and provider mode status |
| `POST` | `/api/location/resolve` | Resolves latitude and longitude to nearest Indian district |
| `GET` | `/api/location/search` | Search Indian cities and meteorological stations |
| `GET` | `/api/home/personalized` | **Main innovation endpoint:** Normalized weather + dynamic card ranking |
| `POST` | `/api/weather/refresh` | Invalidate cache and fetch fresh station observation |
| `GET` | `/api/weather/forecast` | 7-day extended outlook |
| `GET` | `/api/weather/hourly` | 24-hour diurnal forecast trend |
| `GET` | `/api/weather/warnings` | Active severe weather bulletins |
| `GET` | `/api/profile` | Retrieve citizen profile and persona interest flags |
| `PUT` | `/api/profile/interests` | Update persona multi-selection |
| `POST` | `/api/demo/set-persona` | SIH judge 1-click persona switch |
| `POST` | `/api/demo/toggle-severe-warning` | Toggle simulated severe thunderstorm warning |
| `GET` | `/api/destinations` | List saved travel destinations with weather and smart packing |
| `POST` | `/api/destinations` | Save new travel destination |
| `GET` | `/api/events` | List outdoor events with Outdoor Comfort Scores |
| `POST` | `/api/events` | Calculate weather suitability for a new open-air event |
| `GET` | `/api/alerts` | IMD NWFC severe weather bulletin center |

---

## 📜 12. Ministry of Earth Sciences (MoES) Compliance

All app-generated activity ratings, irrigation advisories, and outdoor event scores are explicitly labeled with transparent disclaimers:
- *"App-generated activity score based on surface meteorological parameters."*
- *"Agromet Advisory based on surface parameters and IMD forecast models."*
- Health advisories are informative and non-diagnostic.
