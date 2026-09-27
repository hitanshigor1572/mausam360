import math
from typing import List, Optional
import httpx
import logging
from backend.schemas.location import LocationDetails, LocationSearchResult

logger = logging.getLogger("mausam.geolocation")

# Offline fallback dataset of major Indian cities in case device is completely offline
OFFLINE_INDIAN_LOCATIONS = [
    {"name": "Bhuj", "district": "Kutch", "state": "Gujarat", "lat": 23.2420, "lon": 69.6669, "coastal": True},
    {"name": "Ahmedabad", "district": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714, "coastal": False},
    {"name": "Surat", "district": "Surat", "state": "Gujarat", "lat": 21.1702, "lon": 72.8311, "coastal": True},
    {"name": "Vadodara", "district": "Vadodara", "state": "Gujarat", "lat": 22.3072, "lon": 73.1812, "coastal": False},
    {"name": "Rajkot", "district": "Rajkot", "state": "Gujarat", "lat": 22.3039, "lon": 70.8022, "coastal": False},
    {"name": "Mumbai", "district": "Mumbai City", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777, "coastal": True},
    {"name": "Pune", "district": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567, "coastal": False},
    {"name": "New Delhi", "district": "Central Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090, "coastal": False},
    {"name": "Bengaluru", "district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946, "coastal": False},
    {"name": "Chennai", "district": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "coastal": True},
    {"name": "Kolkata", "district": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639, "coastal": True},
    {"name": "Hyderabad", "district": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867, "coastal": False},
    {"name": "Jaipur", "district": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873, "coastal": False},
    {"name": "Shimla", "district": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lon": 77.1734, "coastal": False},
]

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance in kilometers between two points."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class GeolocationService:
    @staticmethod
    async def resolve_coordinates(latitude: float, longitude: float) -> LocationDetails:
        """
        Resolves real-time browser latitude and longitude to actual city, district, and state.
        Uses live reverse-geocoding without artificial snapping.
        """
        # 1. Try BigDataCloud reverse geocode (very fast, precise Indian administrative divisions)
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                url = f"https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={latitude}&longitude={longitude}&localityLanguage=en"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json()
                    city = (
                        data.get("city") or 
                        data.get("locality") or 
                        data.get("principalSubdivision") or 
                        "Current Location"
                    )
                    district = data.get("locality") or city
                    state = data.get("principalSubdivision") or "India"
                    country = data.get("countryName") or "India"
                    
                    if city and state:
                        logger.info(f"Resolved GPS ({latitude}, {longitude}) to real city: {city}, {state}")
                        return LocationDetails(
                            name=city,
                            district=district,
                            state=state,
                            country=country,
                            latitude=round(latitude, 4),
                            longitude=round(longitude, 4),
                            is_coastal=("gujarat" in state.lower() or "maharashtra" in state.lower() or "kerala" in state.lower() or "tamil nadu" in state.lower())
                        )
        except Exception as e:
            logger.warning(f"BigDataCloud reverse geocode warning: {e}")

        # 2. Try OpenStreetMap Nominatim
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                headers = {"User-Agent": "Mausam-Personalized-App/2.0"}
                url = f"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}"
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    addr = data.get("address", {})
                    city = (
                        addr.get("city") or 
                        addr.get("town") or 
                        addr.get("state_district") or 
                        addr.get("suburb") or 
                        addr.get("village") or 
                        "Current Area"
                    )
                    district = addr.get("state_district") or addr.get("county") or city
                    state = addr.get("state") or "India"
                    return LocationDetails(
                        name=city,
                        district=district,
                        state=state,
                        country=addr.get("country", "India"),
                        latitude=round(latitude, 4),
                        longitude=round(longitude, 4),
                        is_coastal=False
                    )
        except Exception as e:
            logger.warning(f"Nominatim reverse geocode warning: {e}")

        # 3. Offline nearest neighbor fallback
        best = OFFLINE_INDIAN_LOCATIONS[0]
        min_d = float("inf")
        for item in OFFLINE_INDIAN_LOCATIONS:
            d = haversine_distance(latitude, longitude, item["lat"], item["lon"])
            if d < min_d:
                min_d = d
                best = item

        return LocationDetails(
            name=best["name"],
            district=best["district"],
            state=best["state"],
            country="India",
            latitude=round(latitude, 4),
            longitude=round(longitude, 4),
            is_coastal=best.get("coastal", False)
        )

    @staticmethod
    async def search_locations(query: str, limit: int = 10) -> List[LocationSearchResult]:
        """Search ANY city/district in India or worldwide via live geocoder with offline fallback."""
        q = query.strip()
        if not q:
            return [
                LocationSearchResult(
                    name=loc["name"],
                    district=loc["district"],
                    state=loc["state"],
                    latitude=loc["lat"],
                    longitude=loc["lon"],
                    is_coastal=loc.get("coastal", False)
                ) for loc in OFFLINE_INDIAN_LOCATIONS[:6]
            ]

        # 1. Live Nominatim Search
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                headers = {"User-Agent": "Mausam-Personalized-App/2.0"}
                url = f"https://nominatim.openstreetmap.org/search?format=json&q={httpx.URL(q)}&countrycodes=in&limit={limit}&addressdetails=1"
                resp = await client.get(url, headers=headers)
                if resp.status_code == 200:
                    items = resp.json()
                    results = []
                    for item in items:
                        addr = item.get("address", {})
                        c_name = (
                            addr.get("city") or 
                            addr.get("town") or 
                            addr.get("village") or 
                            item.get("display_name", "").split(",")[0]
                        )
                        dist = addr.get("state_district") or addr.get("county") or c_name
                        st = addr.get("state") or "India"
                        results.append(
                            LocationSearchResult(
                                name=c_name,
                                district=dist,
                                state=st,
                                latitude=float(item["lat"]),
                                longitude=float(item["lon"]),
                                is_coastal=False
                            )
                        )
                    if results:
                        return results
        except Exception as e:
            logger.warning(f"Live location search error ({e}). Using offline list.")

        # 2. Offline search filter
        q_lower = q.lower()
        offline_matches = []
        for loc in OFFLINE_INDIAN_LOCATIONS:
            if q_lower in loc["name"].lower() or q_lower in loc["district"].lower() or q_lower in loc["state"].lower():
                offline_matches.append(
                    LocationSearchResult(
                        name=loc["name"],
                        district=loc["district"],
                        state=loc["state"],
                        latitude=loc["lat"],
                        longitude=loc["lon"],
                        is_coastal=loc.get("coastal", False)
                    )
                )
        return offline_matches

    @staticmethod
    def get_default_location() -> LocationDetails:
        """Returns official default station (Bhuj, Gujarat)."""
        return LocationDetails(
            name="Bhuj",
            district="Kutch",
            state="Gujarat",
            country="India",
            latitude=23.2420,
            longitude=69.6669,
            station_code="42634",
            is_coastal=True
        )
