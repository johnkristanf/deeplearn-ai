from core.openai_service import OpenAIService
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas import LessonContent, Lesson as LessonSchema
from ..models import Lesson as LessonModel

class LessonService:
    @staticmethod
    async def generate_lesson_content(topic: str, module_title: str) -> LessonContent:
        system_prompt = OpenAIService.load_prompt("lessons.md")
        user_prompt = f"Topic: {topic}\nModule Title: {module_title}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=LessonContent)
        
        return result

    @staticmethod
    async def create_lesson(db: AsyncSession, module_id: int, lesson_data: LessonSchema) -> LessonModel:
        lesson_content = lesson_data.content
        db_lesson = LessonModel(
            module_id=module_id,
            title=lesson_data.title,
            hook=lesson_content.hook if lesson_content else "",
            objectives=lesson_content.objectives if lesson_content else [],
            lecture=lesson_content.lecture if lesson_content else "",
            analogy=lesson_content.analogy if lesson_content else "",
            real_world_example=lesson_content.real_world_example if lesson_content else "",
            summary=lesson_content.summary if lesson_content else ""
        )
        db.add(db_lesson)
        return db_lesson
