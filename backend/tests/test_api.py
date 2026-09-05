import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.core.database import get_session
from app.core.security import hash_password
from app.models.admin import AdminUser
from app.core.config import settings

@pytest.fixture(name="client")
def client_fixture():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(test_engine)
    
    # Create test admin
    with Session(test_engine) as session:
        admin = AdminUser(
            username=settings.ADMIN_USERNAME,
            hashed_password=hash_password("AuraTeaAdmin2026!")
        )
        session.add(admin)
        session.commit()
    
    def get_test_session():
        with Session(test_engine) as session:
            yield session
            
    app.dependency_overrides[get_session] = get_test_session
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_healthcheck(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_flow(client: TestClient):
    # Invalid password
    bad_resp = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert bad_resp.status_code == 401

    # Valid password
    good_resp = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AuraTeaAdmin2026!"
    })
    assert good_resp.status_code == 200
    token = good_resp.json()["access_token"]
    assert token

    # Check /me with token
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["username"] == "admin"

def test_product_crud_flow(client: TestClient):
    # Authenticate
    auth_resp = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AuraTeaAdmin2026!"
    })
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Public list initially empty in memory
    res = client.get("/api/products")
    assert res.status_code == 200
    assert res.json() == []

    # Unauthenticated create should fail
    create_payload = {
        "name": "Test Assam Gold",
        "slug": "test-assam-gold",
        "category": "Black Tea",
        "origin": "Upper Assam, India",
        "short_description": "Rich malty morning tea.",
        "description": "Full bodied rich malty tea.",
        "flavor_notes": ["Malt", "Caramel"],
        "brewing_guide": {"temp": "95°C", "steep_time": "4 mins", "ratio": "2.5g per 200ml", "infusions": 2},
        "image_url": "https://example.com/tea.jpg",
        "is_featured": True,
        "display_order": 1,
        "is_available": True
    }
    unauth_resp = client.post("/api/products", json=create_payload)
    assert unauth_resp.status_code == 401

    # Authenticated create should succeed
    create_resp = client.post("/api/products", json=create_payload, headers=headers)
    assert create_resp.status_code == 201
    created_id = create_resp.json()["id"]
    assert create_resp.json()["slug"] == "test-assam-gold"

    # Fetch by slug
    slug_resp = client.get("/api/products/test-assam-gold")
    assert slug_resp.status_code == 200
    assert slug_resp.json()["name"] == "Test Assam Gold"

    # Update product
    update_resp = client.put(f"/api/products/{created_id}", json={"is_featured": False}, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["is_featured"] is False

    # Delete product
    del_resp = client.delete(f"/api/products/{created_id}", headers=headers)
    assert del_resp.status_code == 204

    # Confirm deletion
    not_found_resp = client.get("/api/products/test-assam-gold")
    assert not_found_resp.status_code == 404

def test_contact_inquiry(client: TestClient):
    payload = {
        "name": "Lady Catherine",
        "email": "catherine@rosings.co.uk",
        "company": "Rosings Park Hospitality",
        "inquiry_type": "Wholesale & Export",
        "message": "We would like to request 5kg of First Flush samples for our dining salon."
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    assert response.json()["success"] is True
