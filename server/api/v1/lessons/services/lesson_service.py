import re
from core.openai_service import OpenAIService
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..schemas import LessonContent, LessonQuestionsResponse, Lesson as LessonSchema
from ..models import Lesson as LessonModel
from ..question_models import LessonQuestion as LessonQuestionModel

class LessonService:
    @staticmethod
    async def generate_lesson_content(course_title: str, module_title: str, lesson_title: str) -> LessonContent:
        system_prompt = OpenAIService.load_prompt("lessons.md")
        user_prompt = (
            f"Course Title: {course_title}\n"
            f"Module Title: {module_title}\n"
            f"Lesson Title: {lesson_title}"
        )
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=LessonContent)
        
        return result

    @staticmethod
    async def generate_questions(course_title: str, module_title: str, lesson_title: str) -> List[str]:
        system_prompt = OpenAIService.load_prompt("lesson_questions.md")
        user_prompt = (
            f"Course Title: {course_title}\n"
            f"Module Title: {module_title}\n"
            f"Lesson Title: {lesson_title}"
        )

        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=LessonQuestionsResponse)

        return result.questions

    @staticmethod
    def _clean_content(text: str) -> str:
        if not text:
            return ""
        # 1. Handle both escaped newlines and potential misinterpretations like /n
        text = text.replace("\\n", "\n").replace("/n", "\n")
        
        # 2. Enforce "triple empty lines" around horizontal rules (---)
        text = re.sub(r'\s*\n---\n\s*', '\n\n\n\n---\n\n\n\n', text)
        
        return text

    @staticmethod
    async def create_lesson(db: AsyncSession, module_id: int, lesson_data: LessonSchema) -> LessonModel:
        lesson_content = lesson_data.content
        db_lesson = LessonModel(
            module_id=module_id,
            title=lesson_data.title,
            tag=re.sub(r'[^a-z0-9]+', '-', lesson_data.title.lower()).strip('-'),
            hook=LessonService._clean_content(lesson_content.hook) if lesson_content else "",
            objectives=lesson_content.objectives if lesson_content else [],
            lecture=LessonService._clean_content(lesson_content.lecture) if lesson_content else "",
            analogy=LessonService._clean_content(lesson_content.analogy) if lesson_content else "",
            real_world_example=LessonService._clean_content(lesson_content.real_world_example) if lesson_content else "",
            summary=LessonService._clean_content(lesson_content.summary) if lesson_content else ""
        )
        db.add(db_lesson)
        await db.flush()  # flush to get db_lesson.id for questions FK
        return db_lesson

    @staticmethod
    async def create_questions(db: AsyncSession, lesson_id: int, questions: List[str]) -> None:
        for i, question_text in enumerate(questions):
            db_question = LessonQuestionModel(
                lesson_id=lesson_id,
                question=question_text,
                order=i + 1,
            )
            db.add(db_question)

    @staticmethod
    async def grade_answer(db: AsyncSession, question_id: int, answer: str) -> LessonQuestionModel:
        # 1. Fetch exact question
        from sqlalchemy import select
        stmt = select(LessonQuestionModel).where(LessonQuestionModel.id == question_id)
        result = await db.execute(stmt)
        db_question = result.scalar_one_or_none()

        if not db_question:
            raise ValueError(f"Question with id {question_id} not found")

        # 2. Grade answer via LLM
        from ..schemas import GradeResponse
        system_prompt = OpenAIService.load_prompt("grade_answer.md")
        user_prompt = f"Question: {db_question.question}\nAnswer: {answer}"

        grade_result = await OpenAIService.get_completion(
            user_prompt, system_prompt=system_prompt, response_model=GradeResponse
        )

        # 3. Update DB
        db_question.answer = answer
        db_question.score = grade_result.score
        
        db.add(db_question)
        await db.commit()
        await db.refresh(db_question)

        return db_question
