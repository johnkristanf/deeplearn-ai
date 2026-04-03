from pydantic import BaseModel
from typing import List, Optional
from ..lessons.schemas import Lesson

class Module(BaseModel):
    id: Optional[int] = None
    tag: Optional[str] = None
    title: str
    lessons: List[Lesson] = []

    class Config:
        from_attributes = True

class ModuleWithLessons(BaseModel):
    """Schema returned by the LLM: a module title with its recommended lesson titles."""
    title: str
    lesson_titles: List[str]

class ModulesResponse(BaseModel):
    modules: List[ModuleWithLessons]
