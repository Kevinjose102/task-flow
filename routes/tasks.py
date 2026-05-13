from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from auth_utils import get_current_user
from database import get_db
from models import TaskTable
from schemas import Task, UpdateStatus
from models import UserTable

router = APIRouter()

@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    return db.query(TaskTable).filter(
        TaskTable.owner_id == db_user.id
    ).all()

@router.post("/tasks")
def add_task(
    task: Task,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    existing_task = db.query(TaskTable).filter(
        TaskTable.id == task.id
    ).first()

    if not existing_task:

        new_task = TaskTable(
            id=task.id,
            title=task.title,
            status=task.status,
            owner_id=db_user.id
        )

        db.add(new_task)
        db.commit()
        db.refresh(new_task)

        return new_task

    return {"message": "task id already in use"}

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

    return {"message": "Task not found"}

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
        task.status = updated_status.status

        db.commit()
        db.refresh(task)

        return task

    return {"message": "Task Not Found"}


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

        return {"message": "Task Deleted"}

    return {"message": "Task Not Found"}