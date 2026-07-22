"""
Backend tests for Shutter Shots by KP (Karan Pande Photography).
Covers albums (per-category + slug lookup), testimonials, admin auth + CRUD,
media CRUD (with album_id) and site settings.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://karan-visuals.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_USER = "karan"
ADMIN_PASS = "karan@2026"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health ----------
class TestHealth:
    def test_health(self, session):
        r = session.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---------- Albums (public) ----------
class TestAlbumsPublic:
    def test_wedding_albums_min_3(self, session):
        r = session.get(f"{API}/albums/wedding")
        assert r.status_code == 200
        albums = r.json()
        assert isinstance(albums, list)
        assert len(albums) >= 3, f"expected >=3 wedding albums, got {len(albums)}"
        for a in albums:
            for k in ("id", "slug", "name", "cover", "category", "order"):
                assert k in a, f"missing key {k}"
            assert a["category"] == "wedding"

    def test_prewedding_albums_min_2(self, session):
        r = session.get(f"{API}/albums/pre-wedding")
        assert r.status_code == 200
        albums = r.json()
        assert len(albums) >= 2

    def test_cinematic_albums_min_2(self, session):
        r = session.get(f"{API}/albums/cinematic")
        assert r.status_code == 200
        albums = r.json()
        assert len(albums) >= 2

    def test_album_by_slug_aarav_meera(self, session):
        r = session.get(f"{API}/albums/wedding/aarav-meera")
        assert r.status_code == 200
        payload = r.json()
        assert "album" in payload and "media" in payload
        album = payload["album"]
        media = payload["media"]
        assert album["name"] == "Aarav & Meera"
        assert album["slug"] == "aarav-meera"
        assert isinstance(media, list) and len(media) > 0
        for m in media:
            assert m["album_id"] == album["id"]

    def test_album_by_slug_not_found(self, session):
        r = session.get(f"{API}/albums/wedding/does-not-exist")
        assert r.status_code == 404

    def test_cinematic_film_slug(self, session):
        # 'Aarav × Meera — Film' should slugify to 'aarav-meera-film'
        r = session.get(f"{API}/albums/cinematic/aarav-meera-film")
        assert r.status_code == 200
        p = r.json()
        assert p["album"]["category"] == "cinematic"
        assert len(p["media"]) >= 1


# ---------- Testimonials ----------
class TestTestimonials:
    def test_list(self, session):
        r = session.get(f"{API}/testimonials")
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 4
        for t in items:
            assert "author" in t and t["author"]
            assert "quote" in t and t["quote"]
            assert "rating" in t and isinstance(t["rating"], int)


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
        assert r.status_code == 200
        d = r.json()
        assert "token" in d
        assert d.get("username") == ADMIN_USER

    def test_login_bad_creds(self, session):
        r = session.post(f"{API}/admin/login", json={"username": ADMIN_USER, "password": "wrong"})
        assert r.status_code == 401

    def test_admin_without_bearer_401(self, session):
        r = session.post(f"{API}/admin/albums", json={"category": "wedding", "name": "TEST_NoAuth"})
        assert r.status_code == 401

    def test_admin_media_without_bearer_401(self, session):
        r = session.post(f"{API}/admin/media", json={
            "category": "wedding", "kind": "image", "url": "https://x/y.jpg"
        })
        assert r.status_code == 401

    def test_admin_testimonial_without_bearer_401(self, session):
        r = session.post(f"{API}/admin/testimonials", json={"author": "x", "quote": "y"})
        assert r.status_code == 401

    def test_admin_settings_without_bearer_401(self, session):
        r = session.put(f"{API}/admin/settings", json={"phone": "x"})
        assert r.status_code == 401


# ---------- Album CRUD ----------
class TestAlbumCRUD:
    def test_create_update_delete_album(self, session, auth_headers):
        # CREATE
        payload = {
            "category": "wedding",
            "name": "TEST_Couple X & Y",
            "cover": "https://example.com/x.jpg",
            "location": "TEST City",
            "date": "Jan 2026",
            "order": 99,
        }
        r = session.post(f"{API}/admin/albums", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        album = r.json()
        assert album["name"] == payload["name"]
        assert album["slug"] == "test-couple-x-y"  # slugify check
        aid = album["id"]

        # It should show up in GET /albums/wedding
        r = session.get(f"{API}/albums/wedding")
        assert any(a["id"] == aid for a in r.json())

        # Create a media item linked to it
        m_payload = {
            "category": "wedding", "kind": "image",
            "url": "https://example.com/media.jpg",
            "title": "TEST_media", "order": 1, "album_id": aid,
        }
        rm = session.post(f"{API}/admin/media", json=m_payload, headers=auth_headers)
        assert rm.status_code == 200, rm.text
        media_id = rm.json()["id"]

        # UPDATE album name -> slug regen
        r = session.put(f"{API}/admin/albums/{aid}", json={"name": "TEST_Renamed Album"}, headers=auth_headers)
        assert r.status_code == 200
        upd = r.json()
        assert upd["name"] == "TEST_Renamed Album"
        assert upd["slug"] == "test-renamed-album"

        # DELETE album — media should stay but album_id -> null
        r = session.delete(f"{API}/admin/albums/{aid}", headers=auth_headers)
        assert r.status_code == 200

        # verify GET album -> 404
        r = session.get(f"{API}/albums/wedding/test-renamed-album")
        assert r.status_code == 404

        # verify media still exists but album_id is null
        r_all = session.get(f"{API}/media")
        assert r_all.status_code == 200
        found = [m for m in r_all.json() if m["id"] == media_id]
        assert len(found) == 1
        assert found[0]["album_id"] in (None, "", "null")

        # cleanup media
        session.delete(f"{API}/admin/media/{media_id}", headers=auth_headers)


# ---------- Media CRUD ----------
class TestMediaCRUD:
    def test_create_update_delete_media(self, session, auth_headers):
        # first find an existing album
        r = session.get(f"{API}/albums/wedding")
        assert r.status_code == 200
        album_id = r.json()[0]["id"]

        payload = {
            "category": "wedding", "kind": "image",
            "url": "https://example.com/test.jpg",
            "title": "TEST_Media Item", "order": 999, "album_id": album_id,
        }
        r = session.post(f"{API}/admin/media", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        item = r.json()
        assert item["album_id"] == album_id
        mid = item["id"]

        # Update title
        r = session.put(f"{API}/admin/media/{mid}", json={"title": "TEST_Updated"}, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Updated"

        # Delete
        r = session.delete(f"{API}/admin/media/{mid}", headers=auth_headers)
        assert r.status_code == 200


# ---------- Testimonial CRUD ----------
class TestTestimonialCRUD:
    def test_create_update_delete(self, session, auth_headers):
        payload = {"author": "TEST_Someone", "role": "TEST_role", "quote": "TEST quote here", "rating": 4, "order": 999}
        r = session.post(f"{API}/admin/testimonials", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        t = r.json()
        tid = t["id"]
        assert t["author"] == "TEST_Someone"
        assert t["rating"] == 4

        # Update
        r = session.put(f"{API}/admin/testimonials/{tid}", json={"rating": 5}, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["rating"] == 5

        # Delete
        r = session.delete(f"{API}/admin/testimonials/{tid}", headers=auth_headers)
        assert r.status_code == 200


# ---------- Settings ----------
class TestSettings:
    def test_get_settings(self, session):
        r = session.get(f"{API}/settings")
        assert r.status_code == 200
        s = r.json()
        for k in ("hero_video_url", "hero_headline_1", "phone", "email", "instagram"):
            assert k in s

    def test_update_settings_reflects(self, session, auth_headers):
        # capture original phone
        original = session.get(f"{API}/settings").json().get("phone")

        new_phone = "+91 99999 12345"
        r = session.put(f"{API}/admin/settings", json={"phone": new_phone}, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["phone"] == new_phone

        # GET reflects
        r = session.get(f"{API}/settings")
        assert r.json()["phone"] == new_phone

        # revert
        session.put(f"{API}/admin/settings", json={"phone": original}, headers=auth_headers)
