from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy import ForeignKey

# databbase SQLAlechmy model
class TaskTable(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    status = Column(String)
    owner_id = Column(
        Integer, 
        ForeignKey("users.id")
    )
    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )

class UserTable(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)

class ProjectTable(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )