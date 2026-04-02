import asyncio
from ..app import app
from core.database import database
from api.v1.courses.models import Course as CourseModel
from api.v1.modules.services.module_service import ModuleService
from api.v1.lessons.services.lesson_service import LessonService
from api.v1.modules.schemas import Module as ModuleSchema
from api.v1.lessons.schemas import Lesson as LessonSchema
from sqlalchemy import update
import logging

logger = logging.getLogger(__name__)

@app.task(name="celery_app.tasks.course_tasks.generate_course_task")
def generate_course_task(course_id: int, course_title: str):
    """
    Celery task to generate course content (modules and lessons) and save to DB.
    """
    return asyncio.run(_generate_course_async(course_id, course_title))

async def _generate_course_async(course_id: int, course_title: str):
    # Ensure database is connected. 
    # In a production worker, this might be handled via celery signals (worker_ready).
    database.connect()
    
    try:
        async for db in database.get_session():
            try:
                # 1. Generate Modules
                module_titles = await ModuleService.generate_modules(course_title)
                
                for m_title in module_titles:
                    # 2. Generate Lessons
                    lesson_content = await LessonService.generate_lesson_content(course_title, m_title)
                    
                    logger.info(f"LESSONS CONTENT: {lesson_content}")

                    # 3. Create Module and Lesson records
                    db_module = await ModuleService.create_module(
                        db, 
                        course_id, 
                        ModuleSchema(title=m_title)
                    )
                    
                    await LessonService.create_lesson(
                        db, 
                        db_module.id, 
                        LessonSchema(title=lesson_content.title, content=lesson_content)
                    )
                    
                # 4. Update Course status
                await db.execute(
                    update(CourseModel)
                    .where(CourseModel.id == course_id)
                    .values(is_active=1)
                )
                await db.commit()
                logger.info(f"Course {course_id} generation completed.")
                
            except Exception as e:
                logger.error(f"Error in generate_course_task for course {course_id}: {e}", exc_info=True)
                await db.execute(
                    update(CourseModel)
                    .where(CourseModel.id == course_id)
                    .values(is_active=0)
                )
                await db.commit()
    finally:
        await database.close()
