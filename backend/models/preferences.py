import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.core.database import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    # 8 Personas supported as per problem statement
    health = Column(Boolean, default=False)
    fitness = Column(Boolean, default=True)  # Default on for initial dynamic view
    travel = Column(Boolean, default=False)
    family = Column(Boolean, default=False)
    agriculture = Column(Boolean, default=False)
    commuter = Column(Boolean, default=False)
    beach = Column(Boolean, default=False)
    event_planner = Column(Boolean, default=False)

    # Active single persona override for SIH judge demo switching
    active_demo_persona = Column(String(50), nullable=True)

    # Unit & Privacy Preferences
    units = Column(String(10), default="metric")  # metric (°C, km/h) or imperial (°F, mph)
    location_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)

    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="preference")
