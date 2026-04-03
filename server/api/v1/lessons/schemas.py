from pydantic import BaseModel, model_validator
from typing import List, Optional

class LessonContent(BaseModel):
    title: str
    hook: str
    objectives: List[str]
    lecture: str
    analogy: str
    real_world_example: str
    summary: str

    class Config:
        from_attributes = True

class LessonQuestionsResponse(BaseModel):
    """Schema returned by the LLM for lesson reinforcement questions."""
    questions: List[str]

class LessonQuestion(BaseModel):
    id: Optional[int] = None
    question: str
    answer: Optional[str] = None
    score: Optional[int] = None
    order: int

    class Config:
        from_attributes = True

class SubmitAnswerRequest(BaseModel):
    answer: str

class GradeResponse(BaseModel):
    """Schema returned by the LLM for grading a user's answer."""
    score: int

class Lesson(BaseModel):
    id: Optional[int] = None
    tag: Optional[str] = None
    title: str
    content: Optional[LessonContent] = None
    questions: List[LessonQuestion] = []

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def map_content(cls, data):
        if hasattr(data, 'hook') and not getattr(data, 'content', None):
            # If it's an ORM model with flat fields, wrap them in a content dict
            content_data = {
                "title": getattr(data, "title", ""),
                "hook": getattr(data, "hook", ""),
                "objectives": getattr(data, "objectives", []),
                "lecture": getattr(data, "lecture", ""),
                "analogy": getattr(data, "analogy", ""),
                "real_world_example": getattr(data, "real_world_example", ""),
                "summary": getattr(data, "summary", ""),
            }
            return {
                "id": getattr(data, "id", None),
                "tag": getattr(data, "tag", None),
                "title": getattr(data, "title", ""),
                "content": content_data,
                "questions": getattr(data, "questions", []),
            }
        return data
