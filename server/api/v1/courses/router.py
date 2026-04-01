from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import database
from .schemas import CourseGenerateRequest, CourseSaveRequest
from .services.course_service import CourseService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate")
async def generate_course(
    request: CourseGenerateRequest,
    course_service: CourseService = Depends(CourseService)
):
    print(f"REQUEST DATA: {request}")
    try:
        result = await course_service.generate_course(request.topic)
        return result
    except Exception as e:
        logger.error(f"Error generating course: {e}", exc_info=True)
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
