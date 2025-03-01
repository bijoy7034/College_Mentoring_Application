from fastapi import APIRouter, HTTPException, Request
from utils.token import verify_access
from model.teacher import Profile, StudentPost, TeacherPost
from services.admin import add_profile, add_students, add_teachers, assign_students, delete_student, get_student, get_students, get_teachers, update_student

router = APIRouter()

@router.post('/teacher')
async def add_teacher_route(teacher : TeacherPost, request : Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await add_teachers(teacher)

@router.post('/student')
async def add_student_route(student: StudentPost, request : Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await add_students(student)

@router.put('/student')
async def update_student_route(student: StudentPost, request : Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await update_student(student)

@router.get('/student/all')
async def get_student_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await get_students()

@router.delete('/student')
async def delete_student_route(request : Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    body = await request.json()
    return await delete_student(body.get("register_number"))


@router.get('/teacher/all')
async def get_teacher_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await get_teachers()

@router.patch('/assign')
async def assign_student_to_teacher_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    body = await request.json()
    teacher_id = body.get('teacher_id')
    student_id = body.get('student_id')
    if not teacher_id or not student_id:
        raise HTTPException(status_code=400, detail="Missing teacher_id or student_id")
    return await assign_students(teacher_id=teacher_id, std_id=student_id)


@router.get('/student/profile')
async def get_student_by_email_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "student":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await get_student(email=user.get("email"))

@router.post('/student/profile')
async def update_student_profile_route(request: Request, profile_data: Profile):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "student":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await add_profile(email=user.get('email'), profile_data=profile_data)

