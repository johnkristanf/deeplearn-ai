import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

Base = declarative_base()

class Database:
    def __init__(self, db_url: str):
        self._engine: AsyncEngine | None = None
        self._sessionmaker: sessionmaker | None = None
        self.db_url = db_url

    def connect(self):
        # Provide a fallback just to prevent uvicorn crash on empty URL if it happens
        self._engine = create_async_engine(self.db_url or "sqlite+aiosqlite:///:memory:", echo=False)
        self._sessionmaker = sessionmaker(
            self._engine, class_=AsyncSession, expire_on_commit=False
        )

    async def close(self):
        if self._engine is None:
            raise Exception("Database is not initialized")
        await self._engine.dispose()

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        if self._sessionmaker is None:
            raise Exception("Database is not initialized")
        async with self._sessionmaker() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()

database = Database(DATABASE_URL)
