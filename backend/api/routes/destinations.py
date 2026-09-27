from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.core.database import get_db
from backend.models.destination import SavedDestination
from backend.schemas.events import DestinationCreate, DestinationResponse
from backend.schemas.location import LocationDetails
from backend.services.weather_service import weather_service
from backend.services.recommendation_engine import RecommendationEngine
from backend.api.routes.profile import DEFAULT_USER_ID, _get_or_create_user

router = APIRouter(prefix="/destinations", tags=["Saved Destinations"])

@router.get("", response_model=List[DestinationResponse])
async def list_destinations(user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    _get_or_create_user(db, user_id)
    destinations = db.query(SavedDestination).filter(SavedDestination.user_id == user_id).all()
    
    # Pre-populate default popular destinations if user has none
    if not destinations:
        sample_dests = [
            SavedDestination(user_id=user_id, name="Mumbai", district="Mumbai City", state="Maharashtra", country="India", latitude=19.0760, longitude=72.8777, category="Business"),
            SavedDestination(user_id=user_id, name="Shimla", district="Shimla", state="Himachal Pradesh", country="India", latitude=31.1048, longitude=77.1734, category="Holiday")
        ]
        db.add_all(sample_dests)
        db.commit()
        destinations = db.query(SavedDestination).filter(SavedDestination.user_id == user_id).all()

    response = []
    for d in destinations:
        loc = LocationDetails(
            name=d.name,
            district=d.district or d.name,
            state=d.state or "India",
            country=d.country,
            latitude=d.latitude,
            longitude=d.longitude,
            is_coastal=(d.name.lower() in ["mumbai", "chennai", "kochi", "goa", "dwarka"])
        )
        try:
            w = await weather_service.get_weather(loc)
            cur = w.current
            warn = w.warnings[0] if w.warnings else None
            packing = RecommendationEngine.generate_packing_suggestions(cur.temperature, cur.rain_probability, cur.uv_index)
        except Exception:
            cur = None
            warn = None
            packing = ["Standard travel apparel"]

        response.append(
            DestinationResponse(
                id=d.id,
                name=d.name,
                district=d.district,
                state=d.state,
                country=d.country,
                latitude=d.latitude,
                longitude=d.longitude,
                trip_date=d.trip_date,
                category=d.category,
                current_weather=cur,
                warning=warn,
                packing_suggestions=packing
            )
        )
    return response

@router.post("", response_model=DestinationResponse)
async def add_destination(payload: DestinationCreate, user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    _get_or_create_user(db, user_id)
    new_dest = SavedDestination(
        user_id=user_id,
        name=payload.name,
        district=payload.district or payload.name,
        state=payload.state or "India",
        country=payload.country or "India",
        latitude=payload.latitude,
        longitude=payload.longitude,
        trip_date=payload.trip_date,
        category=payload.category or "Leisure"
    )
    db.add(new_dest)
    db.commit()
    db.refresh(new_dest)

    loc = LocationDetails(
        name=new_dest.name,
        district=new_dest.district,
        state=new_dest.state,
        country=new_dest.country,
        latitude=new_dest.latitude,
        longitude=new_dest.longitude,
        is_coastal=False
    )
    w = await weather_service.get_weather(loc)
    packing = RecommendationEngine.generate_packing_suggestions(w.current.temperature, w.current.rain_probability, w.current.uv_index)

    return DestinationResponse(
        id=new_dest.id,
        name=new_dest.name,
        district=new_dest.district,
        state=new_dest.state,
        country=new_dest.country,
        latitude=new_dest.latitude,
        longitude=new_dest.longitude,
        trip_date=new_dest.trip_date,
        category=new_dest.category,
        current_weather=w.current,
        warning=w.warnings[0] if w.warnings else None,
        packing_suggestions=packing
    )

@router.delete("/{dest_id}")
def delete_destination(dest_id: int, user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    dest = db.query(SavedDestination).filter(SavedDestination.id == dest_id, SavedDestination.user_id == user_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    db.delete(dest)
    db.commit()
    return {"status": "deleted", "id": dest_id}
