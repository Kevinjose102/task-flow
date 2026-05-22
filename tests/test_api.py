from fastapi.testclient import TestClient
from importlib import import_module

from tests.helpers import (
    create_user,
    login,
    create_task
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

    create_task(
        client,
        token
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

    response, username = create_user(client)

    token = login(client)

    task = create_task(
        client,
        token
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

    task = create_task(
        client,
        token
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
