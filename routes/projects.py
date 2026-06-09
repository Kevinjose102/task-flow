from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth_utils import get_current_user
from models import ProjectTable, UserTable, TaskTable
from schemas import Project

from redis_client import redis_client
import json

from core.metrics import (
    projects_created_total,
    projects_deleted_total
)

router = APIRouter()

@router.post("/projects")
def create_project(
    project: Project,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    new_project = ProjectTable(
        name=project.name,
        owner_id=db_user.id
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    cache_key = f"projects:{current_user}"

    print("DELETING:", cache_key)

    deleted = redis_client.delete(
        cache_key
    )

    print("DELETED COUNT:", deleted)

    projects_created_total.inc()

    return new_project

@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    cache_key = f"projects:{current_user}"

    print(
        "READING:",
        cache_key
    )

    cached = redis_client.get(cache_key)

    if cached:
        print("CACHE HIT")
        return json.loads(cached)
    else:
        print("CACHE MISS")



    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    projects =  db.query(ProjectTable).filter(
        ProjectTable.owner_id == db_user.id
    ).all()

    response = []

    for project in projects:
        response.append({
            "id": project.id,
            "name": project.name,
            "owner_id": project.owner_id
        })
    redis_client.setex(cache_key, 600, json.dumps(response))

    return response

@router.get("/projects/{id}")
def get_project(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    project = db.query(ProjectTable).filter(
        ProjectTable.id == id,
        ProjectTable.owner_id == db_user.id
    ).first()

    if project:
        return project

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )

@router.delete("/projects/{id}")
def delete_project(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    project = db.query(ProjectTable).filter(
        ProjectTable.id == id,
        ProjectTable.owner_id == db_user.id
    ).first()

    if project:
        db.query(TaskTable).filter(
            TaskTable.project_id == id
        ).delete()
        db.delete(project)
        db.commit()
        redis_client.delete(
            f"projects:{current_user}"
        )
        projects_deleted_total.inc()
        return {"message": "Project deleted"}

    
    
    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )

