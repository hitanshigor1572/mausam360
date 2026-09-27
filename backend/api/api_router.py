from fastapi import APIRouter
from backend.api.routes.location import router as location_router
from backend.api.routes.weather import router as weather_router
from backend.api.routes.profile import router as profile_router
from backend.api.routes.home import router as home_router
from backend.api.routes.alerts import router as alerts_router
from backend.api.routes.destinations import router as destinations_router
from backend.api.routes.events import router as events_router
from backend.api.routes.demo import router as demo_router

api_router = APIRouter()

api_router.include_router(location_router)
api_router.include_router(weather_router)
api_router.include_router(profile_router)
api_router.include_router(home_router)
api_router.include_router(alerts_router)
api_router.include_router(destinations_router)
api_router.include_router(events_router)
api_router.include_router(demo_router)
