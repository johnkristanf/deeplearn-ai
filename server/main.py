from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.api import api_router
from contextlib import asynccontextmanager
from core.database import database

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to Database...")
    database.connect()
    yield
    print("Disconnecting from Database...")
    await database.close()

app = FastAPI(title="DeepLearn AI API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "DeepLearn AI API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
