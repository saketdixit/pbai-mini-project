import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

def test_full_e2e_system_workflow():
    client = TestClient(app)

    # 1. Healthcheck
    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"

    # 2. Public Catalog Flow
    products_res = client.get("/api/products")
    assert products_res.status_code == 200
    products = products_res.json()
    assert len(products) >= 6, "Expected seeded products"

    # Check detail page
    detail_res = client.get(f"/api/products/{products[0]['slug']}")
    assert detail_res.status_code == 200
    assert "brewing_guide" in detail_res.json()
    assert "temp" in detail_res.json()["brewing_guide"]

    # Check Category Filter
    white_res = client.get("/api/products?category=White%20Tea")
    assert white_res.status_code == 200
    assert any(p["category"] == "White Tea" for p in white_res.json())

    # Check Public About Page Content
    about_res = client.get("/api/content/about")
    assert about_res.status_code == 200
    assert "Aura Artisanal Teas" in about_res.json()["story"]

    # Check Public Inquiry Intake
    inquiry_res = client.post("/api/contact", json={
        "name": "Lord Sterling",
        "email": "sterling@luxuryresort.ch",
        "phone": "+41 22 555 0199",
        "company": "Alpine Vista Palace Hotel",
        "inquiry_type": "Wholesale & Export",
        "product_slug": products[0]["slug"],
        "message": "We would like to establish an exclusive tea lounge program and request wholesale tasting kits."
    })
    assert inquiry_res.status_code == 201
    assert inquiry_res.json()["success"] is True

    # 3. Admin Authentication
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AuraTeaAdmin2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify /me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "admin"

    # 4. Image Upload Simulation
    dummy_image = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 50)
    upload_res = client.post(
        "/api/upload",
        files={"file": ("test_tea.jpg", dummy_image, "image/jpeg")},
        headers=headers
    )
    assert upload_res.status_code == 200
    uploaded_url = upload_res.json()["url"]
    assert uploaded_url.startswith("/uploads/")

    # 5. Admin Create Product
    new_product_res = client.post(
        "/api/products",
        json={
            "name": "Kangra Mist Royal Flush",
            "slug": "kangra-mist-royal-flush",
            "category": "Black Tea",
            "origin": "Palampur Estate, Kangra (4,600 ft)",
            "flush": "Spring First Pick",
            "grade": "FTGFOP1 Royal",
            "short_description": "Exclusive pine smoked spring orthodox leaf.",
            "description": "Crafted from centenarian bushes planted in 1882 in the shadows of the Dhauladhar range.",
            "flavor_notes": ["Wild Mint", "Pine Honey", "Ripe Fig"],
            "brewing_guide": {
                "temp": "85°C / 185°F",
                "steep_time": "3 mins",
                "ratio": "2.5g per 200ml",
                "infusions": 4
            },
            "image_url": uploaded_url,
            "is_featured": True,
            "display_order": 99,
            "is_available": True
        },
        headers=headers
    )
    assert new_product_res.status_code == 201
    created_id = new_product_res.json()["id"]

    # 6. Admin Reorder
    reorder_res = client.put(
        "/api/products/batch/reorder",
        json=[{"id": created_id, "display_order": 0}],
        headers=headers
    )
    assert reorder_res.status_code == 200

    # 7. Admin Update Content
    content_update_res = client.put(
        "/api/content/about",
        json={"headline": "Mastery in Every Mountain Harvest Lot"},
        headers=headers
    )
    assert content_update_res.status_code == 200
    assert content_update_res.json()["headline"] == "Mastery in Every Mountain Harvest Lot"

    # 8. Admin View Inquiries
    inquiries_res = client.get("/api/contact/inquiries", headers=headers)
    assert inquiries_res.status_code == 200
    inquiries = inquiries_res.json()
    assert any(i["email"] == "sterling@luxuryresort.ch" for i in inquiries)

    # 9. Clean up created product
    del_res = client.delete(f"/api/products/{created_id}", headers=headers)
    assert del_res.status_code == 204
