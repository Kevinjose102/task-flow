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
    client: TestClient,
    token: str
):

    response = client.post(
        "/tasks",
        headers={
            "Authorization":
            f"Bearer {token}"
        },
        json={
            "title": "test_task"
        }
    )

    return response