import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True)

    title = Column(String(150), nullable=False)        # e.g., "College Fest", "Outdoor Wedding"
    event_date = Column(String(50), nullable=False)    # e.g., "2026-10-18"
    event_time = Column(String(50), nullable=False)    # e.g., "18:00"
    location_name = Column(String(100), nullable=False)# e.g., "Ahmedabad"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_outdoor = Column(String(10), default="yes")      # yes or no
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="events")
