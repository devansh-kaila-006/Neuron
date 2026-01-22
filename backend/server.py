from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay
import bcrypt
import jwt
import csv
import io

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'neuron-secret-key-2025-ai-ml-dl')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# Razorpay Configuration
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_dummy')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'dummy_secret')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class AdminCreate(BaseModel):
    username: str
    password: str

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
    honeypot: Optional[str] = None  # Hidden field for bot detection

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
    amount: int  # Amount in paise (INR)
    registration_id: str
    full_name: str
    email: str
    phone: str

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    registration_id: str

# Helper Functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Admin Routes
@api_router.post("/auth/admin-login")
async def admin_login(credentials: AdminLogin):
    admin = await db.admins.find_one({"username": credentials.username}, {"_id": 0})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), admin['hashed_password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Registration Routes
@api_router.post("/registrations", response_model=Registration)
async def create_registration(reg: RegistrationCreate):
    # Honeypot check - if filled, it's a bot
    if reg.honeypot:
        raise HTTPException(status_code=400, detail="Invalid submission")
    
    # Check for duplicate email
    existing = await db.registrations.find_one({"email": reg.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate unique registration ID
    registration_id = f"NEU{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
    
    registration_obj = Registration(
        registration_id=registration_id,
        full_name=reg.full_name,
        email=reg.email,
        phone=reg.phone,
        college=reg.college,
        team_name=reg.team_name,
        payment_status="pending"
    )
    
    doc = registration_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.registrations.insert_one(doc)
    return registration_obj

@api_router.get("/registrations", response_model=List[Registration])
async def get_registrations(username: str = Depends(verify_token)):
    registrations = await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for reg in registrations:
        if isinstance(reg.get('created_at'), str):
            reg['created_at'] = datetime.fromisoformat(reg['created_at'])
    
    return registrations

@api_router.get("/registrations/export")
async def export_registrations(username: str = Depends(verify_token)):
    registrations = await db.registrations.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    # Create CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Registration ID', 'Full Name', 'Email', 'Phone', 
        'College', 'Team Name', 'Payment Status', 'Transaction ID', 
        'Amount (INR)', 'Created At'
    ])
    
    # Write data
    for reg in registrations:
        writer.writerow([
            reg.get('registration_id', ''),
            reg.get('full_name', ''),
            reg.get('email', ''),
            reg.get('phone', ''),
            reg.get('college', ''),
            reg.get('team_name', ''),
            reg.get('payment_status', ''),
            reg.get('transaction_id', ''),
            reg.get('amount', 0) / 100 if reg.get('amount') else 0,
            reg.get('created_at', '')
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=neuron_registrations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    )

@api_router.get("/registrations/stats")
async def get_stats(username: str = Depends(verify_token)):
    total = await db.registrations.count_documents({})
    paid = await db.registrations.count_documents({"payment_status": "completed"})
    pending = await db.registrations.count_documents({"payment_status": "pending"})
    
    # Calculate total revenue
    paid_registrations = await db.registrations.find(
        {"payment_status": "completed"},
        {"_id": 0, "amount": 1}
    ).to_list(10000)
    
    total_revenue = sum(reg.get('amount', 0) for reg in paid_registrations)
    
    return {
        "total_registrations": total,
        "paid_registrations": paid,
        "pending_registrations": pending,
        "total_revenue_inr": total_revenue / 100
    }

# Payment Routes
@api_router.post("/payment/create-order")
async def create_payment_order(order_data: PaymentOrderCreate):
    try:
        # Check if registration exists
        registration = await db.registrations.find_one(
            {"registration_id": order_data.registration_id},
            {"_id": 0}
        )
        
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        if registration.get('payment_status') == 'completed':
            raise HTTPException(status_code=400, detail="Payment already completed")
        
        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            "amount": order_data.amount,
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "registration_id": order_data.registration_id,
                "email": order_data.email,
                "name": order_data.full_name
            }
        })
        
        # Update registration with order details
        await db.registrations.update_one(
            {"registration_id": order_data.registration_id},
            {"$set": {
                "order_id": razorpay_order['id'],
                "amount": order_data.amount
            }}
        )
        
        return {
            "order_id": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency": razorpay_order['currency'],
            "key_id": RAZORPAY_KEY_ID
        }
    
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@api_router.post("/payment/verify")
async def verify_payment(payment_data: PaymentVerify):
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': payment_data.razorpay_order_id,
            'razorpay_payment_id': payment_data.razorpay_payment_id,
            'razorpay_signature': payment_data.razorpay_signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Update registration
        await db.registrations.update_one(
            {"registration_id": payment_data.registration_id},
            {"$set": {
                "payment_status": "completed",
                "transaction_id": payment_data.razorpay_payment_id,
                "order_id": payment_data.razorpay_order_id
            }}
        )
        
        return {"status": "success", "message": "Payment verified successfully"}
    
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

# Health Check
@api_router.get("/")
async def root():
    return {"message": "Neuron Club API - Active"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Create default admin if not exists
    admin_exists = await db.admins.find_one({"username": "admin"})
    if not admin_exists:
        hashed_password = bcrypt.hashpw("NeuronAdmin@2025".encode('utf-8'), bcrypt.gensalt())
        admin = Admin(
            username="admin",
            hashed_password=hashed_password.decode('utf-8')
        )
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.admins.insert_one(doc)
        logger.info("Default admin created: username='admin', password='NeuronAdmin@2025'")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()