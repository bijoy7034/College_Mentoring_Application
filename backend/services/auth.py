from model.auth import User, UserLogin
from db import user_collection, admin_collection
from fastapi import HTTPException
from utils import security, token

async def login_user(user: UserLogin):
    existing_user = await user_collection.find_one({"email" : user.email})
    if not existing_user or not security.verify_password(plain=user.password, hashed=existing_user['password']):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    access_token = token.create_access({"email" : existing_user['email'], "role" : existing_user['role']})
    return {"access_token" : access_token, "token_type" : "access_token" , "role" : existing_user.get('role')}

async def login_admin(user: UserLogin):
    existing_user = await admin_collection.find_one({"email" : user.email})
    if existing_user and existing_user['password'] == user.password:
        access_token = token.create_access({"email" : existing_user['email'], "role" : "admin"})
        return {"access_token" : access_token, "token_type" : "access_token"}
    raise HTTPException(status_code=400, detail="Invalid Credentials")
        