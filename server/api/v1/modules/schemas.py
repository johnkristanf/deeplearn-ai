from pydantic import BaseModel
from typing import List, Optional
from ..lessons.schemas import Lesson

class Module(BaseModel):
    id: Optional[int] = None
    title: str
    lessons: List[Lesson] = []

    class Config:
        from_attributes = True

class ModulesResponse(BaseModel):
    modules: List[str]
