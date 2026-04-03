import re
from ...modules.services.module_service import ModuleService
from ...lessons.services.lesson_service import LessonService
from ..schemas import CourseResponse, CourseSaveRequest, CourseTitleResponse
from core.openai_service import OpenAIService
from ...modules.schemas import Module
from ...lessons.schemas import Lesson
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ...courses.models import Course as CourseModel
from ...modules.models import Module as ModuleModel
from ...lessons.models import Lesson as LessonModel
from ...lessons.question_models import LessonQuestion as LessonQuestionModel  # registers mapper
from typing import List

class CourseService:
    async def get_courses(self, db: AsyncSession) -> List[CourseModel]:
        stmt = select(CourseModel).options(
            selectinload(CourseModel.modules).selectinload(ModuleModel.lessons).selectinload(LessonModel.questions)
        ).order_by(CourseModel.created_at.desc())
        
        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def generate_course_title(topic: str) -> str:
        system_prompt = OpenAIService.load_prompt("course_title.md")
        user_prompt = f"Topic: {topic}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=CourseTitleResponse)
        
        return result.title
        
    async def generate_course(self, topic: str) -> CourseResponse:
        # 1. Generate professional title
        professional_title = await self.generate_course_title(topic)

        # 2. Generate Modules
        module_titles = await ModuleService.generate_modules(professional_title)
        
        modules = []
        for m_title in module_titles:
            # 3. Generate Lessons for each module
            # For now, we generate 1 lesson per module as a baseline
            lesson_content = await LessonService.generate_lesson_content(professional_title, m_title)
            
            lesson = Lesson(title=m_title, content=lesson_content)
            module = Module(title=m_title, lessons=[lesson])
            modules.append(module)
            
        return CourseResponse(topic=professional_title, modules=modules)

    async def save_course(self, db: AsyncSession, request: CourseSaveRequest) -> CourseModel:
        try:
            course_data = request.course
            db_course = CourseModel(
                topic=course_data.topic,
                tag=re.sub(r'[^a-z0-9]+', '-', course_data.topic.lower()).strip('-'),
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

    async def create_course(self, db: AsyncSession, course_title: str, user_id: str, is_active: int) -> CourseModel:
        db_course = CourseModel(
            topic=course_title,
            tag=re.sub(r'[^a-z0-9]+', '-', course_title.lower()).strip('-'),
            user_id=user_id,
            is_active=is_active
        )
        db.add(db_course)
        await db.commit()
        await db.refresh(db_course)
        return db_course
