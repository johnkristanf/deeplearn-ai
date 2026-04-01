import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Initialize OpenAI client
client = OpenAI(api_key=Config.OPENAI_API_KEY)
