from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from core.database import Base

class LessonQuestion(Base):
    __tablename__ = "lesson_questions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)
    order = Column(Integer, nullable=False)

    lesson = relationship("Lesson", back_populates="questions")
