from pydantic import BaseModel

# request model format
class Task(BaseModel):
    id: int
    title: str
    status: str

class UpdateStatus(BaseModel):
    status: str

class User(BaseModel):
    username: str
    password: str