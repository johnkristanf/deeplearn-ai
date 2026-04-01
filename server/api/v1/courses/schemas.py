from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from ..modules.schemas import Module

class CourseGenerateRequest(BaseModel):
    topic: str

class CourseResponse(BaseModel):
    id: Optional[int] = None
    topic: str
    modules: List[Module] = []

    model_config = ConfigDict(from_attributes=True)

class CourseSaveRequest(BaseModel):
    user_id: Optional[str] = None
    course: CourseResponse
