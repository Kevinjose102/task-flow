from fastapi.testclient import TestClient
import uuid


def create_user(client):

    username = f"user_{uuid.uuid4().hex[:8]}"
    password = "password"

    response = client.post(
        "/signup",
        json={
            "username": username,
            "password": password
        }
    )

    return response, username, password


def login(
    client: TestClient,
    username: str,
    password: str
):

    response = client.post(
        "/login",
        data={
            "username": username,
            "password": password
        }
    )

    assert response.status_code == 200

    token = response.json()["access_token"]

    return token


def create_task(
    client,
    token,
    project_id
):

    response = client.post(
        "/tasks",
        headers={
            "Authorization":
            f"Bearer {token}"
        },
        json={
            "title": "test_task",
            "status": "pending",
            "project_id": project_id
        }
    )

    return response


def create_project(
    client,
    token
):

    response = client.post(
        "/projects",
        headers={
            "Authorization":
            f"Bearer {token}"
        },
        json={
            "name": "test_project"
        }
    )

    return response