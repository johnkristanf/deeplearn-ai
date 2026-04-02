from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import database
from typing import List
from .schemas import CourseGenerateRequest, CourseSaveRequest, CourseResponse, CourseInResponse
from .services.course_service import CourseService
from celery_app.tasks.course_tasks import generate_course_task
from .models import Course as CourseModel

import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=List[CourseResponse])
async def get_courses(
    db: AsyncSession = Depends(database.get_session),
    course_service: CourseService = Depends(CourseService)
):
    try:
        courses = await course_service.get_courses(db)
        return courses
    except Exception as e:
        logger.error(f"Error fetching courses: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/generate", response_model=CourseInResponse)
async def generate_course(
    request: CourseGenerateRequest,
    db: AsyncSession = Depends(database.get_session),
    course_service: CourseService = Depends(CourseService)
):
    try:
        user_id = "1" # Test only
        is_active = 0 # The created course will be inactive by default, until the course generation background task finishes
        
        # 1. Generate professional course title
        course_title = await course_service.generate_course_title(request.topic)
        
        # 2. Create course database record using the professional title
        db_course = await course_service.create_course(db, course_title, user_id, is_active)
        
        # 3. Offload course generation to Celery worker using the professional title
        generate_course_task.delay(db_course.id, course_title)

        return db_course
    except Exception as e:
        logger.error(f"Error triggering course generation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/save")
async def save_course(
    request: CourseSaveRequest,
    db: AsyncSession = Depends(database.get_session),
    course_service: CourseService = Depends(CourseService)
):
    try:
        await course_service.save_course(db, request)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error saving course: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
