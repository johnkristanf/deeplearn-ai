from ...modules.services.module_service import ModuleService
from ...lessons.services.lesson_service import LessonService
from ..schemas import CourseResponse, CourseSaveRequest
from ...modules.schemas import Module
from ...lessons.schemas import Lesson
from sqlalchemy.ext.asyncio import AsyncSession
from ...courses.models import Course as CourseModel
from ...modules.models import Module as ModuleModel
from ...lessons.models import Lesson as LessonModel

class CourseService:
    async def generate_course(self, topic: str) -> CourseResponse:

        # 1. Generate Modules
        module_titles = await ModuleService.generate_modules(topic)
        
        print(f"MODULE TITLES: {module_titles}")
        modules = []
        for m_title in module_titles:
            # 2. Generate Lessons for each module
            # For now, we generate 1 lesson per module as a baseline
            lesson_content = await LessonService.generate_lesson_content(topic, m_title)
            
            print(f"LESSON CONTENT: {lesson_content}")
            lesson = Lesson(title=m_title, content=lesson_content)
            module = Module(title=m_title, lessons=[lesson])
            modules.append(module)
            
        return CourseResponse(topic=topic, modules=modules)

    async def save_course(self, db: AsyncSession, request: CourseSaveRequest) -> CourseModel:
        try:
            course_data = request.course
            db_course = CourseModel(
                topic=course_data.topic,
                user_id="1" # Test user_id
            )
            db.add(db_course)
            await db.flush()
            
            for m in course_data.modules:
                db_module = await ModuleService.create_module(db, db_course.id, m)
                
                for l in m.lessons:
                    await LessonService.create_lesson(db, db_module.id, l)
            
            await db.commit()
            await db.refresh(db_course)
            return db_course
        except Exception as e:
            await db.rollback()
            raise e
