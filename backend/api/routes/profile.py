from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.core.database import get_db
from backend.models.user import User
from backend.models.preferences import UserPreference
from backend.schemas.profile import (
    ProfileCreateOrUpdate,
    UserProfileResponse,
    InterestsUpdate
)

router = APIRouter(prefix="/profile", tags=["Profile"])

DEFAULT_USER_ID = "citizen_default"

def _get_or_create_user(db: Session, user_id: str = DEFAULT_USER_ID) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            name="Citizen",
            home_city="Bhuj",
            home_district="Kutch",
            home_state="Gujarat",
            latitude=23.2420,
            longitude=69.6669
        )
        pref = UserPreference(
            user_id=user_id,
            health=False,
            fitness=True,
            travel=False,
            family=False,
            agriculture=False,
            commuter=False,
            beach=False,
            event_planner=False
        )
        db.add(user)
        db.add(pref)
        db.commit()
        db.refresh(user)
    elif not user.preference:
        pref = UserPreference(
            user_id=user_id,
            health=False,
            fitness=True,
            travel=False,
            family=False,
            agriculture=False,
            commuter=False,
            beach=False,
            event_planner=False
        )
        db.add(pref)
        db.commit()
        db.refresh(user)
    return user

@router.get("", response_model=UserProfileResponse)
def get_profile(user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    user = _get_or_create_user(db, user_id)
    pref = user.preference
    return UserProfileResponse(
        user_id=user.id,
        name=user.name,
        home_city=user.home_city,
        home_district=user.home_district,
        home_state=user.home_state,
        latitude=user.latitude,
        longitude=user.longitude,
        interests={
            "fitness": pref.fitness,
            "health": pref.health,
            "travel": pref.travel,
            "family": pref.family,
            "agriculture": pref.agriculture,
            "commuter": pref.commuter,
            "beach": pref.beach,
            "event_planner": pref.event_planner
        },
        active_demo_persona=pref.active_demo_persona,
        units=pref.units,
        location_enabled=pref.location_enabled
    )

@router.post("", response_model=UserProfileResponse)
def save_profile(payload: ProfileCreateOrUpdate, db: Session = Depends(get_db)):
    uid = payload.user_id or DEFAULT_USER_ID
    user = _get_or_create_user(db, uid)
    
    if payload.name:
        user.name = payload.name
    if payload.home_city:
        user.home_city = payload.home_city
    if payload.home_district:
        user.home_district = payload.home_district
    if payload.home_state:
        user.home_state = payload.home_state
    if payload.latitude is not None:
        user.latitude = payload.latitude
    if payload.longitude is not None:
        user.longitude = payload.longitude

    if payload.interests:
        p = user.preference
        for key in ["fitness", "health", "travel", "family", "agriculture", "commuter", "beach", "event_planner"]:
            val = getattr(payload.interests, key)
            if val is not None:
                setattr(p, key, val)

    if payload.units:
        user.preference.units = payload.units
    if payload.location_enabled is not None:
        user.preference.location_enabled = payload.location_enabled

    db.commit()
    db.refresh(user)
    return get_profile(uid, db)

@router.put("/interests", response_model=UserProfileResponse)
def update_interests(payload: InterestsUpdate, user_id: str = DEFAULT_USER_ID, db: Session = Depends(get_db)):
    user = _get_or_create_user(db, user_id)
    p = user.preference
    for key in ["fitness", "health", "travel", "family", "agriculture", "commuter", "beach", "event_planner"]:
        val = getattr(payload, key)
        if val is not None:
            setattr(p, key, val)
    # Clear active demo override if user explicitly updates interests
    p.active_demo_persona = None
    db.commit()
    return get_profile(user_id, db)
