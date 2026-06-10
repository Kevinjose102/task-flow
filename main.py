from fastapi import FastAPI

from routes.tasks import router as task_router
from routes.auth import router as auth_router
from routes.projects import router as project_router

from database import Base, engine
from models import TaskTable, UserTable

from routes.metrics import router as metrics_router
from core.limiter import limiter

from fastapi.middleware.cors import CORSMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "https://frontend-production-9a96.up.railway.app"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)

Base.metadata.create_all(bind=engine)
print(Base.metadata.tables.keys())
app.include_router(task_router)
app.include_router(auth_router)
app.include_router(project_router)
app.include_router(metrics_router)