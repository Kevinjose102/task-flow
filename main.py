from fastapi import FastAPI

from routes.tasks import router as task_router
from routes.auth import router as auth_router

from database import Base, engine
from models import TaskTable, UserTable

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(task_router)
app.include_router(auth_router)