import re

from core.openai_service import OpenAIService
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..schemas import ModulesResponse, ModuleWithLessons, Module as ModuleSchema
from ..models import Module as ModuleModel

class ModuleService:
    @staticmethod
    async def generate_modules(course_title: str) -> List[ModuleWithLessons]:
        system_prompt = OpenAIService.load_prompt("modules.md")
        user_prompt = f"Course Title: {course_title}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=ModulesResponse)
        
        return result.modules

    @staticmethod
    async def create_module(db: AsyncSession, course_id: int, module_data: ModuleSchema) -> ModuleModel:
        db_module = ModuleModel(
            course_id=course_id,
            title=module_data.title,
            tag=re.sub(r'[^a-z0-9]+', '-', module_data.title.lower()).strip('-')
        )
        db.add(db_module)
        await db.flush()
            
        return db_module
