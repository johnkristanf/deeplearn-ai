from pydantic import BaseModel
from typing import List, Optional
from ..modules.schemas import Module

class CourseGenerateRequest(BaseModel):
    topic: str

class CourseResponse(BaseModel):
    topic: str
    modules: List[Module]

class CourseSaveRequest(BaseModel):
    user_id: Optional[str] = None
    course: CourseResponse
