from pydantic import BaseModel
from typing import List, Optional

class LessonContent(BaseModel):
    hook: str
    objectives: List[str]
    lecture: str
    analogy: str
    real_world_example: str
    summary: str

class Lesson(BaseModel):
    title: str
    content: Optional[LessonContent] = None
