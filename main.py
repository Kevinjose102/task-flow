from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Task(BaseModel):
    id: int
    title: str
    status: str

class UpdateStatus(BaseModel):
    status: str

tasks = []

DATABASE_URL = "postgresql://postgres:Kevinjose@10885@db.mtsuxewtfmbrdggbrogo.supabase.co:5432/postgres"

@app.get("/")
def home():
    return { "messgae" : "hello" }

# get all tasks
@app.get("/tasks")
def get_tasks():
    return tasks

# add a new task
@app.post("/tasks")
def add_task(task: Task):
    tasks.append(task)
    return task

# get task using id
@app.get("/task/{id}")
def get_task_id(id: int):
    for x in tasks:
        if x.id == id:
            return x

# updating task status using id
@app.put("/tasks/{id}")
def update_status(id: int, updated_status: UpdateStatus):
    for x in tasks:
        if x.id == id:
            x.status = updated_status.status
            return x
        
# deleting a task using id
@app.delete("/tasks/{id}")
def delete_task(id: int):
    flag = 0
    for x in tasks:
        if x.id == id:
            tasks.remove(x)
            flag = 1    
            return { "message" : "Task deleted" }
    if flag == 0:
        return { "message" : "Task not found" }