from celery import Celery
from .config import CeleryConfig

app = Celery("deeplearn_tasks")
app.config_from_object(CeleryConfig)

if __name__ == "__main__":
    app.start()
