from fastapi import FastAPI

from routes.tasks import router as task_router
from routes.auth import router as auth_router
from routes.projects import router as project_router
from database import Base, engine
from models import TaskTable, UserTable

app = FastAPI()

Base.metadata.create_all(bind=engine)
print(Base.metadata.tables.keys())
app.include_router(task_router)
app.include_router(auth_router)
app.include_router(project_router)