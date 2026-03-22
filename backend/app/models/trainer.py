                               
                                                                   

from sqlalchemy import Column, Integer, String, ForeignKey, Text, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    phone = Column(String(20), nullable=True)
    specialization = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    experience_years = Column(Integer, default=0)
    hourly_rate = Column(Numeric(10, 2), nullable=True)
    certifications = Column(Text, nullable=True)                        
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

                   
    user = relationship("User", back_populates="trainer_profile")
    members = relationship("Member", back_populates="trainer")
