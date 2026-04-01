from core.openai_service import OpenAIService
from ..schemas import LessonContent

class LessonService:
    @staticmethod
    async def generate_lesson_content(topic: str, module_title: str) -> LessonContent:
        system_prompt = OpenAIService.load_prompt("lessons.md")
        user_prompt = f"Topic: {topic}\nModule Title: {module_title}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=LessonContent)
        
        return result
