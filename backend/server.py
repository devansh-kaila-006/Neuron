from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay
import bcrypt
import jwt
import csv
import io

# -------------------------------------------------------------------
# ENVIRONMENT VALIDATION
# -------------------------------------------------------------------

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "neuron_db")
SECRET_KEY = os.getenv("SECRET_KEY")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
CORS_ORIGINS = os.getenv("CORS_ORIGINS")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

missing = [
    k for k, v in {
        "MONGO_URI": MONGO_URI,
        "SECRET_KEY": SECRET_KEY,
        "ADMIN_PASSWORD": ADMIN_PASSWORD,
        "CORS_ORIGINS": CORS_ORIGINS,
        "RAZORPAY_KEY_ID": RAZORPAY_KEY_ID,
        "RAZORPAY_KEY_SECRET": RAZORPAY_KEY_SECRET,
    }.items() if not v
]

if missing:
    raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")

# -------------------------------------------------------------------
# DATABASE
# -------------------------------------------------------------------

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

# -------------------------------------------------------------------
# JWT CONFIG
# -------------------------------------------------------------------

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# -------------------------------------------------------------------
# RAZORPAY
# -------------------------------------------------------------------

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# -------------------------------------------------------------------
# APP SETUP
# -------------------------------------------------------------------

app = FastAPI()
api_router = APIRouter(prefix="/api")

# -------------------------------------------------------------------
# MODELS
# -------------------------------------------------------------------

class AdminLogin(BaseModel):
    username: str
    password: str

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RegistrationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    college: str
    team_name: Optional[str] = None
    honeypot: Optional[str] = None

class Registration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    registration_id: str
    full_name: str
    email: str
    phone: str
    college: str
    team_name: Optional[str] = None
    payment_status: str = "pending"
    transaction_id: Optional[str] = None
    order_id: Optional[str] = None
    amount: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentOrderCreate(BaseModel):
    amount: int
    registration_id: str
    full_name: str
    email: str
    phone: str

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    registration_id: str

# -------------------------------------------------------------------
# AUTH HELPERS
# -------------------------------------------------------------------

def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------------------------------------------------------
# ADMIN ROUTES
# -------------------------------------------------------------------

@api_router.post("/auth/admin-login")
async def admin_login(credentials: AdminLogin):
    admin = await db.admins.find_one({"username": credentials.username})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(
        credentials.password.encode(),
        admin["hashed_password"].encode()
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": credentials.username})
    return {"access_token": token, "token_type": "bearer"}

# -------------------------------------------------------------------
# REGISTRATION ROUTES
# -------------------------------------------------------------------

@api_router.post("/registrations", response_model=Registration)
async def create_registration(reg: RegistrationCreate):
    if reg.honeypot:
        raise HTTPException(status_code=400, detail="Invalid submission")

    if await db.registrations.find_one({"email": reg.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    registration_id = f"NEU{datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:8].upper()}"

    registration = Registration(
        registration_id=registration_id,
        full_name=reg.full_name,
        email=reg.email,
        phone=reg.phone,
        college=reg.college,
        team_name=reg.team_name
    )

    await db.registrations.insert_one(registration.model_dump())
    return registration

@api_router.get("/registrations", response_model=List[Registration])
async def get_registrations(_: str = Depends(verify_token)):
    return await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# -------------------------------------------------------------------
# PAYMENTS
# -------------------------------------------------------------------

@api_router.post("/payment/create-order")
async def create_payment_order(data: PaymentOrderCreate):
    registration = await db.registrations.find_one(
        {"registration_id": data.registration_id}
    )

    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")

    order = razorpay_client.order.create({
        "amount": data.amount,
        "currency": "INR",
        "payment_capture": 1
    })

    await db.registrations.update_one(
        {"registration_id": data.registration_id},
        {"$set": {"order_id": order["id"], "amount": data.amount}}
    )

    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "key_id": RAZORPAY_KEY_ID
    }

# -------------------------------------------------------------------
# APP CONFIG
# -------------------------------------------------------------------

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router)

# -------------------------------------------------------------------
# STARTUP
# -------------------------------------------------------------------

@app.on_event("startup")
async def startup():
    if not await db.admins.find_one({"username": "admin"}):
        hashed = bcrypt.hashpw(
            ADMIN_PASSWORD.encode(),
            bcrypt.gensalt()
        ).decode()

        await db.admins.insert_one(Admin(
            username="admin",
            hashed_password=hashed
        ).model_dump())

@app.on_event("shutdown")
async def shutdown():
    client.close()
