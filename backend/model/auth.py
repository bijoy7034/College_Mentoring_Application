from typing import Dict
from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class User(BaseModel):
    name : str
    email : str
    role : UserRole
    password : str

class UserLogin(BaseModel):
    email : str
    password : str

