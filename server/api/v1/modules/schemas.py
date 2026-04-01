from pydantic import BaseModel
from typing import List
from ..lessons.schemas import Lesson

class Module(BaseModel):
    title: str
    lessons: List[Lesson] = []

class ModulesResponse(BaseModel):
    modules: List[str]
