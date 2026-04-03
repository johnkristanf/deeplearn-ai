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
                # 1. Generate all modules with their recommended lesson titles in a single LLM call.
                modules_with_lessons = await ModuleService.generate_modules(course_title)
                logger.info(f"Generated {len(modules_with_lessons)} modules for course '{course_title}'")

                for module_plan in modules_with_lessons:
                    # 2. Persist the module first to get its DB id.
                    db_module = await ModuleService.create_module(
                        db,
                        course_id,
                        ModuleSchema(title=module_plan.title)
                    )

                    # 3. Generate full lesson content AND questions for every lesson title concurrently.
                    lesson_results = await asyncio.gather(
                        *[
                            _generate_lesson_with_questions(course_title, module_plan.title, lesson_title)
                            for lesson_title in module_plan.lesson_titles
                        ]
                    )

                    logger.info(
                        f"Generated {len(lesson_results)} lessons (with questions) for module '{module_plan.title}'"
                    )

                    # 4. Persist lessons and their questions in order, linked to the parent module.
                    for lesson_content, questions in lesson_results:
                        db_lesson = await LessonService.create_lesson(
                            db,
                            db_module.id,
                            LessonSchema(title=lesson_content.title, content=lesson_content)
                        )
                        logger.info(f"Created lesson '{lesson_content.title}' with ID {db_lesson.id}")
                        
                        await LessonService.create_questions(db, db_lesson.id, questions)
                        logger.info(f"Created {len(questions)} questions for lesson '{lesson_content.title}'")

                # 5. Mark course as active now that all content is saved.
                await db.execute(
                    update(CourseModel)
                    .where(CourseModel.id == course_id)
                    .values(is_active=1)
                )
                await db.commit()
                logger.info(f"Course {course_id} generation completed successfully.")

            except Exception as e:
                logger.error(
                    f"Error in generate_course_task for course {course_id}: {e}", exc_info=True
                )
                await db.execute(
                    update(CourseModel)
                    .where(CourseModel.id == course_id)
                    .values(is_active=0)
                )
                await db.commit()
    finally:
        await database.close()


async def _generate_lesson_with_questions(
    course_title: str, module_title: str, lesson_title: str
) -> tuple:
    """
    Concurrently generates lesson content and its 5 reinforcement questions.
    Returns (LessonContent, List[str]) tuple.
    """
    lesson_content, questions = await asyncio.gather(
        LessonService.generate_lesson_content(course_title, module_title, lesson_title),
        LessonService.generate_questions(course_title, module_title, lesson_title),
    )
    return lesson_content, questions
