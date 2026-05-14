from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth_utils import get_current_user
from models import ProjectTable, UserTable, TaskTable
from schemas import Project

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

    return new_project

@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    db_user = db.query(UserTable).filter(
        UserTable.username == current_user
    ).first()

    return db.query(ProjectTable).filter(
        ProjectTable.owner_id == db_user.id
    ).all()

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

        return {"message": "Project deleted"}

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )

