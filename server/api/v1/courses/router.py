from fastapi import APIRouter, HTTPException, Depends
from .schemas import CourseGenerateRequest
from .services.course_service import CourseService

router = APIRouter()

@router.post("/generate")
async def generate_course(
    request: CourseGenerateRequest,
    course_service: CourseService = Depends(CourseService)
):
    try:
        result = await course_service.generate_course(request.topic)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
