from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from core.database import Base

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"))
    title = Column(String)
    hook = Column(Text)
    objectives = Column(JSONB)
    lecture = Column(Text)
    analogy = Column(Text)
    real_world_example = Column(Text)
    summary = Column(Text)
    
    module = relationship("Module", back_populates="lessons")
    questions = relationship("LessonQuestion", back_populates="lesson", cascade="all, delete-orphan", order_by="LessonQuestion.order")
