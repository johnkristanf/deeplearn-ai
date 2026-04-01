from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    topic = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
