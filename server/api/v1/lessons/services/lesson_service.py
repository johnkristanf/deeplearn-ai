import re
from core.openai_service import OpenAIService
from sqlalchemy.ext.asyncio import AsyncSession
from ..schemas import LessonContent, Lesson as LessonSchema
from ..models import Lesson as LessonModel

class LessonService:
    @staticmethod
    async def generate_lesson_content(course_title: str, module_title: str) -> LessonContent:
        system_prompt = OpenAIService.load_prompt("lessons.md")
        user_prompt = f"Course Title: {course_title}\nModule Title: {module_title}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=LessonContent)
        
        return result

    @staticmethod
    def _clean_content(text: str) -> str:
        if not text:
            return ""
        # 1. Handle both escaped newlines and potential misinterpretations like /n
        text = text.replace("\\n", "\n").replace("/n", "\n")
        
        # 2. Enforce "triple empty lines" around horizontal rules (---)
        # This replaces one or more newlines surrounding '---' with exactly 4 newlines
        # resulting in 3 visible empty lines in most renderers.
        text = re.sub(r'\s*\n---\n\s*', '\n\n\n\n---\n\n\n\n', text)
        
        return text

    @staticmethod
    async def create_lesson(db: AsyncSession, module_id: int, lesson_data: LessonSchema) -> LessonModel:
        lesson_content = lesson_data.content
        db_lesson = LessonModel(
            module_id=module_id,
            title=lesson_data.title,
            hook=LessonService._clean_content(lesson_content.hook) if lesson_content else "",
            objectives=lesson_content.objectives if lesson_content else [],
            lecture=LessonService._clean_content(lesson_content.lecture) if lesson_content else "",
            analogy=LessonService._clean_content(lesson_content.analogy) if lesson_content else "",
            real_world_example=LessonService._clean_content(lesson_content.real_world_example) if lesson_content else "",
            summary=LessonService._clean_content(lesson_content.summary) if lesson_content else ""
        )
        db.add(db_lesson)
        return db_lesson
