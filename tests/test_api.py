from fastapi.testclient import TestClient
from importlib import import_module

from tests.helpers import (
    create_user,
    login,
    create_task,
    create_project
)
app = import_module("main").app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "API is running"
    }

def test_get_tasks():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]
    create_task(
        client,
        token,
        project_id
    )

    response = client.get(
        "/tasks",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert len(
        response.json()
    ) > 0

def test_get_task():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    task = create_task(
        client,
        token,
        project_id
    )

    task_id = task.json()["id"]

    response = client.get(
        f"/tasks/{task_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert (
        response.json()["id"]
        == task_id
    )

def test_add_task():
    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    task = create_task(
        client,
        token,
        project_id
    )

    assert task.status_code == 200

    body = task.json()

    assert "id" in body

    assert body["title"] == "test_task"

    assert body["status"] == "pending"

    assert (
        body["project_id"] == project_id
    )

def test_update_task():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    task = create_task(
        client,
        token,
        project_id
    )

    task_id = task.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        },
        json={
            "status": "updated_status"
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert (
        body["status"]
        == "updated_status"
    )

    assert (
        body["id"]
        == task_id
    )

def test_delete_task():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    task = create_task(
        client,
        token,
        project_id
    )

    task_id = task.json()["id"]

    response = client.delete(
        f"/tasks/{task_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert response.json() == {
        "message":
        "Task Deleted"
    }

    response = client.get(
        f"/tasks/{task_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 404

def test_get_project_tasks():
    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    create_task(
        client,
        token,
        project_id
    )

    create_task(
        client,
        token,
        project_id
    )

    response = client.get(
        f"/projects/{project_id}/tasks",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    body = response.json()

    assert len(
        body
    ) >= 2

    assert (
        body[0]["project_id"]
        == project_id
    )

    assert (
        body[1]["project_id"]
        == project_id
    )

def test_create_project():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    assert project.status_code == 200

    body = project.json()

    assert "id" in body

    assert (
        body["name"]
        == "test_project"
    )

def test_get_projects():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    create_project(
        client,
        token
    )

    response = client.get(
        "/projects",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert len(
        response.json()
    ) > 0

def test_get_project():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    response = client.get(
        f"/projects/{project_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert (
        response.json()["id"]
        == project_id
    )

def test_delete_project():

    response, username, password = create_user(
        client
    )

    token = login(
        client,
        username,
        password
    )

    project = create_project(
        client,
        token
    )

    project_id = project.json()["id"]

    create_task(
        client,
        token,
        project_id
    )

    response = client.delete(
        f"/projects/{project_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    assert response.json() == {
        "message":
        "Project deleted"
    }

    response = client.get(
        f"/projects/{project_id}",
        headers={
            "Authorization":
            f"Bearer {token}"
        }
    )

    assert response.status_code == 404