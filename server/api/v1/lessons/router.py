from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import database
from .schemas import SubmitAnswerRequest, LessonQuestion
from .services.lesson_service import LessonService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/questions/{question_id}/grade", response_model=LessonQuestion)
async def grade_question(
    question_id: int,
    request: SubmitAnswerRequest,
    db: AsyncSession = Depends(database.get_session)
):
    try:
        updated_question = await LessonService.grade_answer(db, question_id, request.answer)
        return updated_question
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.error(f"Error grading question {question_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
