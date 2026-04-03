from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, index=True)
    user_id = Column(String, index=True)
    topic = Column(String, index=True)
    is_active = Column(Integer, default=1) # 0 for pending/failed, 1 for active
    created_at = Column(DateTime, default=datetime.utcnow)
    
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
