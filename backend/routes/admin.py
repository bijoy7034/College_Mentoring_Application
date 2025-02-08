from fastapi import APIRouter, HTTPException, Request
from utils.token import verify_access
from model.teacher import StudentPost, TeacherPost
from services.admin import add_students, add_teachers

router = APIRouter()

@router.post('/teacher')
async def add_teacher_route(teacher : TeacherPost, request : Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await add_teachers(teacher)

@router.post('/student')
async def add_student_route(student: StudentPost, request : Request):
    if request.state.role != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await add_students(student)