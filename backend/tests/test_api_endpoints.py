import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Mausam" in data["service"]

def test_location_resolve():
    res = client.post("/api/location/resolve", json={"latitude": 23.242, "longitude": 69.6669})
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Bhuj"
    assert data["state"] == "Gujarat"

def test_personalized_home_endpoint():
    res = client.get("/api/home/personalized?lat=23.242&lon=69.6669&persona=fitness")
    assert res.status_code == 200
    data = res.json()
    assert "location" in data
    assert "current_weather" in data
    assert "cards" in data
    assert len(data["cards"]) > 0
    # Top card should be fitness
    assert data["cards"][0]["type"] == "running_score"

def test_demo_persona_switch():
    res = client.post("/api/demo/set-persona", json={"persona": "agriculture"})
    assert res.status_code == 200
    assert res.json()["active_persona"] == "agriculture"

    # Home request should now feature agriculture card
    home_res = client.get("/api/home/personalized?lat=23.242&lon=69.6669")
    assert home_res.status_code == 200
    assert home_res.json()["cards"][0]["type"] == "agriculture"
