import datetime
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.orm import relationship
from backend.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(100), default="Citizen")
    home_city = Column(String(100), default="Bhuj")
    home_district = Column(String(100), default="Kutch")
    home_state = Column(String(100), default="Gujarat")
    latitude = Column(Float, default=23.2420)
    longitude = Column(Float, default=69.6669)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    preference = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    destinations = relationship("SavedDestination", back_populates="user", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="user", cascade="all, delete-orphan")
