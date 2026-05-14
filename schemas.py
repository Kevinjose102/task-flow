from pydantic import BaseModel

# request model format
class Task(BaseModel):
    title: str
    status: str
    project_id: int

class UpdateStatus(BaseModel):
    status: str

class User(BaseModel):
    username: str
    password: str

class Project(BaseModel):
    name: str