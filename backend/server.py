from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timedelta, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'karan')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'karan@2026')
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALGO = 'HS256'
JWT_EXP_HOURS = 24 * 7

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Karan Pande Photography API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logger = logging.getLogger("kp")
logging.basicConfig(level=logging.INFO)


# ---------- Models ----------
Category = Literal["wedding", "pre-wedding", "cinematic"]
MediaKind = Literal["image", "video"]


class MediaItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: Category
    kind: MediaKind
    url: str
    poster: Optional[str] = None  # for videos: thumbnail
    title: str = ""
    caption: str = ""
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class MediaCreate(BaseModel):
    category: Category
    kind: MediaKind
    url: str
    poster: Optional[str] = None
    title: str = ""
    caption: str = ""
    order: int = 0


class MediaUpdate(BaseModel):
    url: Optional[str] = None
    poster: Optional[str] = None
    title: Optional[str] = None
    caption: Optional[str] = None
    order: Optional[int] = None
    kind: Optional[MediaKind] = None
    category: Optional[Category] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str


# ---------- Auth ----------
def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def require_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        data = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        if data.get("sub") != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token subject")
        return data["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Seed data ----------
SEED_MEDIA: List[dict] = [
    # Wedding
    {"category": "wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?auto=format&fit=crop&w=1600&q=80", "title": "The Vows", "order": 1},
    {"category": "wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1599462616558-2b75fd26a283?auto=format&fit=crop&w=1600&q=80", "title": "First Look", "order": 2},
    {"category": "wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1665960213508-48f07086d49c?auto=format&fit=crop&w=1600&q=80", "title": "Mandap Light", "order": 3},
    {"category": "wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1722952934708-749c22eb2e58?auto=format&fit=crop&w=1600&q=80", "title": "Baraat", "order": 4},
    {"category": "wedding", "kind": "image", "url": "https://images.pexels.com/photos/35069916/pexels-photo-35069916.jpeg?auto=compress&cs=tinysrgb&w=1600", "title": "Sindoor", "order": 5},
    {"category": "wedding", "kind": "image", "url": "https://images.pexels.com/photos/32060316/pexels-photo-32060316.jpeg?auto=compress&cs=tinysrgb&w=1600", "title": "Bidaai", "order": 6},
    # Pre-wedding
    {"category": "pre-wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1715285977619-6d9357168f46?auto=format&fit=crop&w=1600&q=80", "title": "Dunes", "order": 1},
    {"category": "pre-wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1715285978388-312252ee23de?auto=format&fit=crop&w=1600&q=80", "title": "Hand in Hand", "order": 2},
    {"category": "pre-wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1653688529238-1326ab9eeab9?auto=format&fit=crop&w=1600&q=80", "title": "Golden Hour", "order": 3},
    {"category": "pre-wedding", "kind": "image", "url": "https://images.unsplash.com/photo-1715285977526-5574f70b0d3d?auto=format&fit=crop&w=1600&q=80", "title": "Wildflowers", "order": 4},
    # Cinematic
    {
        "category": "cinematic", "kind": "video",
        "url": "https://videos.pexels.com/video-files/5849887/5849887-uhd_2560_1440_24fps.mp4",
        "poster": "https://images.pexels.com/photos/33419097/pexels-photo-33419097.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "title": "Aarav × Meera",
        "caption": "A monsoon wedding film, Sambhaji Nagar", "order": 1,
    },
    {
        "category": "cinematic", "kind": "video",
        "url": "https://videos.pexels.com/video-files/3205827/3205827-uhd_2560_1440_25fps.mp4",
        "poster": "https://images.pexels.com/photos/10603895/pexels-photo-10603895.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "title": "The First Dance",
        "caption": "A candlelit story", "order": 2,
    },
    {
        "category": "cinematic", "kind": "video",
        "url": "https://videos.pexels.com/video-files/5849887/5849887-uhd_2560_1440_24fps.mp4",
        "poster": "https://images.unsplash.com/photo-1519689950823-0a2251441815?auto=format&fit=crop&w=1600&q=80",
        "title": "Golden Bidaai",
        "caption": "A closing chapter", "order": 3,
    },
]


async def seed_if_empty():
    count = await db.media.count_documents({})
    if count == 0:
        logger.info("Seeding media collection…")
        docs = [MediaItem(**m).model_dump() for m in SEED_MEDIA]
        await db.media.insert_many(docs)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Karan Pande Photography API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(body: LoginRequest):
    if body.username != ADMIN_USERNAME or body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return LoginResponse(token=create_token(body.username), username=body.username)


@api_router.get("/admin/me")
async def admin_me(user: str = Depends(require_admin)):
    return {"username": user}


@api_router.get("/media", response_model=List[MediaItem])
async def list_all_media():
    docs = await db.media.find({}, {"_id": 0}).sort([("category", 1), ("order", 1)]).to_list(1000)
    return docs


@api_router.get("/media/{category}", response_model=List[MediaItem])
async def list_media(category: Category):
    docs = await db.media.find({"category": category}, {"_id": 0}).sort("order", 1).to_list(1000)
    return docs


@api_router.post("/admin/media", response_model=MediaItem)
async def create_media(body: MediaCreate, user: str = Depends(require_admin)):
    item = MediaItem(**body.model_dump())
    await db.media.insert_one(item.model_dump())
    return item


@api_router.put("/admin/media/{item_id}", response_model=MediaItem)
async def update_media(item_id: str, body: MediaUpdate, user: str = Depends(require_admin)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    res = await db.media.update_one({"id": item_id}, {"$set": updates})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    doc = await db.media.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/admin/media/{item_id}")
async def delete_media(item_id: str, user: str = Depends(require_admin)):
    res = await db.media.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Media not found")
    return {"deleted": item_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await seed_if_empty()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
