from core.config import client, Config
import os
import json

class OpenAIService:
    @staticmethod
    def _make_schema_strict(schema: dict) -> dict:
        if schema.get("type") == "object" or "properties" in schema:
            schema["additionalProperties"] = False
            if "properties" in schema:
                schema["required"] = list(schema["properties"].keys())
                for prop in schema["properties"].values():
                    OpenAIService._make_schema_strict(prop)
        elif schema.get("type") == "array" and "items" in schema:
            OpenAIService._make_schema_strict(schema["items"])
        
        if "$defs" in schema:
            for def_schema in schema["$defs"].values():
                OpenAIService._make_schema_strict(def_schema)
        
        return schema

    @staticmethod
    async def get_completion(prompt: str, system_prompt: str = "You are a helpful assistant.", response_model=None):
        try:
            kwargs = {
                "model": Config.OPENAI_MODEL,
                "instructions": system_prompt,
                "input": prompt
            }
            if response_model:
                schema = response_model.model_json_schema()
                strict_schema = OpenAIService._make_schema_strict(schema)
                
                kwargs["text"] = {
                    "format": {
                        "type": "json_schema",
                        "name": response_model.__name__,
                        "strict": True,
                        "schema": strict_schema
                    }
                }
            
            response = client.responses.create(**kwargs)
            
            if response_model:
                return response_model.model_validate_json(response.output_text)
            
            print(f"RESPONSE: {response}")
            return response.output_text
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            raise e

    @staticmethod
    def load_prompt(filename: str):
        prompt_path = os.path.join(os.getcwd(), "prompts", filename)
        with open(prompt_path, "r") as f:
            return f.read()
