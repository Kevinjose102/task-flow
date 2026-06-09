from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth_utils import get_current_user
from database import get_db
from models import TaskTable
from schemas import Task, UpdateStatus
from models import UserTable, ProjectTable
from fastapi import HTTPException
from redis_client import redis_client
import json
from core.metrics import (
    tasks_created_total,
    tasks_completed_total,
    tasks_deleted_total
)
import time

start = time.time()

router = APIRouter()

@router.get("/")
def home():
    return {"message": "API is running"}

@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    cache_key = f"tasks:{current_user}"

    cached = redis_client.get(cache_key)

    if cached:
        print(
            "CACHE HIT",
            time.time() - start
        )
        return json.loads(cached)
    
    print(
        "CACHE MISS",
        time.time() - start
    )

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    tasks = db.query(TaskTable).filter(
        TaskTable.owner_id == db_user.id
    ).all()

    response = []

    for task in tasks:
        response.append({
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "owner_id": task.owner_id,
            "project_id": task.project_id
        })
    redis_client.setex(cache_key, 600, json.dumps(response))
    return response

@router.post("/tasks")
def add_task(
    task: Task,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()
    project = db.query(ProjectTable).filter(
        ProjectTable.id == task.project_id,
        ProjectTable.owner_id == db_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )
    new_task = TaskTable(
        title=task.title,
        status=task.status,
        owner_id=db_user.id,
        project_id=task.project_id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    redis_client.delete(
        f"tasks:{current_user}"
    )

    redis_client.delete(
        f"project_tasks:{current_user}:{task.project_id}"
    )
    tasks_created_total.inc()
    return new_task

@router.get("/tasks/{id}")
def get_task_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    task = db.query(TaskTable).filter(
        TaskTable.id == id,
        TaskTable.owner_id == db_user.id
    ).first()

    if task:
        return task

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )

@router.put("/tasks/{id}")
def update_status(
    id: int,
    updated_status: UpdateStatus,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):  
    
    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    task = db.query(TaskTable).filter(
        TaskTable.id == id,
        TaskTable.owner_id == db_user.id
        ).first()

    if task:
        if task.status != "completed" and updated_status.status == "completed":
            tasks_completed_total.inc()
        task.status = updated_status.status

        db.commit()
        db.refresh(task)

        redis_client.delete(
            f"tasks:{current_user}"
        )

        redis_client.delete(
            f"task:{current_user}:{id}"
        )
        
        return task

    raise HTTPException(
        status_code=404,
        detail="Task Not Found"
    )


@router.delete("/tasks/{id}")
def delete_task(id: int,
                db: Session = Depends(get_db),
                current_user: str = Depends(get_current_user)):
    
    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    task = db.query(TaskTable).filter(
        TaskTable.id == id,
        TaskTable.owner_id == db_user.id
        ).first()

    if task:
        db.delete(task)
        db.commit()
        
        redis_client.delete(
            f"tasks:{current_user}"
        )

        redis_client.delete(
            f"task:{current_user}:{id}"
        )
        tasks_deleted_total.inc()
        return {"message": "Task Deleted"}

    raise HTTPException(
        status_code=404,
        detail="Task Not Found"
    )

@router.get("/projects/{project_id}/tasks")
def get_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    project = db.query(ProjectTable).filter(
        ProjectTable.id == project_id,
        ProjectTable.owner_id == db_user.id
    ).first()

    if project:
        tasks = db.query(TaskTable).filter(
            TaskTable.project_id == project_id,
        ).all()
        return tasks
    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )