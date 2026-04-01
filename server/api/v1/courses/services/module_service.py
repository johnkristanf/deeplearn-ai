from core.openai_service import OpenAIService
from typing import List
from pydantic import BaseModel

class ModulesResponse(BaseModel):
    modules: List[str]

class ModuleService:
    @staticmethod
    async def generate_modules(topic: str) -> List[str]:
        system_prompt = OpenAIService.load_prompt("modules.md")
        user_prompt = f"Topic: {topic}"
        
        result = await OpenAIService.get_completion(user_prompt, system_prompt=system_prompt, response_model=ModulesResponse)
        
        return result.modules
