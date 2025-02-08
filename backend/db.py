from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI,DB_NAME
from fastapi import HTTPException


try:
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    user_collection = db['Users']
    admin_collection = db['Admin']
except Exception as e:
    raise HTTPException(status_code=400, detail=f"DB connection failed : {e}")
