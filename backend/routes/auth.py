from fastapi import APIRouter
from model.auth import User, UserLogin
from services.auth import login_user, login_admin

router = APIRouter()

@router.post('/login')
async def login(user : UserLogin):
    return await login_user(user)

@router.post('/admin/login')
async def loginAdmin(user: UserLogin):
    return await login_admin(user)

