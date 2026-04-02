from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from ..modules.schemas import Module

class CourseGenerateRequest(BaseModel):
    topic: str

class CourseTitleResponse(BaseModel):
    title: str

class CourseResponse(BaseModel):
    id: Optional[int] = None
    topic: str
    is_active: bool = False
    modules: List[Module] = []

    model_config = ConfigDict(from_attributes=True)

class CourseInResponse(BaseModel):
    id: int
    topic: str
    is_active: int

    model_config = ConfigDict(from_attributes=True)

class CourseSaveRequest(BaseModel):
    user_id: Optional[str] = None
    course: CourseResponse
