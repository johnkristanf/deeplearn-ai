from pydantic import BaseModel, model_validator
from typing import List, Optional

class LessonContent(BaseModel):
    hook: str
    objectives: List[str]
    lecture: str
    analogy: str
    real_world_example: str
    summary: str

    class Config:
        from_attributes = True

class Lesson(BaseModel):
    id: Optional[int] = None
    title: str
    content: Optional[LessonContent] = None

    class Config:
        from_attributes = True

    @model_validator(mode='before')
    @classmethod
    def map_content(cls, data):
        if hasattr(data, 'hook') and not getattr(data, 'content', None):
            # If it's an ORM model with flat fields, wrap them in a content dict
            content_data = {
                "hook": getattr(data, "hook", ""),
                "objectives": getattr(data, "objectives", []),
                "lecture": getattr(data, "lecture", ""),
                "analogy": getattr(data, "analogy", ""),
                "real_world_example": getattr(data, "real_world_example", ""),
                "summary": getattr(data, "summary", ""),
            }
            # Return a dict that Pydantic can use to initialize the model
            return {
                "id": getattr(data, "id", None),
                "title": getattr(data, "title", ""),
                "content": content_data
            }
        return data
