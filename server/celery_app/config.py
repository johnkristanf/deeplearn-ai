from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

class CeleryConfig:
    broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    task_serializer = "json"
    result_serializer = "json"
    accept_content = ["json"]
    timezone = "UTC"
    enable_utc = True
    include=['celery_app.tasks.course_tasks']
    task_track_started = True
    task_time_limit = 30 * 60  # 30 minutes
