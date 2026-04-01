from .module_service import ModuleService
from .lesson_service import LessonService
from ..schemas import CourseGenerateRequest, CourseResponse, Module, Lesson

class CourseService:
    async def generate_course(self, topic: str) -> CourseResponse:

        # 1. Generate Modules
        module_titles = await ModuleService.generate_modules(topic)
        
        modules = []
        for m_title in module_titles:
            # 2. Generate Lessons for each module
            # For now, we generate 1 lesson per module as a baseline
            lesson_content = await LessonService.generate_lesson_content(topic, m_title)
            
            lesson = Lesson(title=f"Lesson: {m_title}", content=lesson_content)
            module = Module(title=m_title, lessons=[lesson])
            modules.append(module)
            
        return CourseResponse(topic=topic, modules=modules)
