from fastapi.testclient import TestClient
from importlib import import_module

app = import_module("main").app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "API is running"
    }