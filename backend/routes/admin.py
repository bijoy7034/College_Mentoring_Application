from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from utils.security import hash_password
from utils.token import verify_access
from model.teacher import Profile, StudentPost, TeacherPost
from services.admin import add_profile, add_student_data, add_students, add_teachers, assign_students, delete_student, delete_teacher, get_student, get_student_details, get_students, get_teachers, update_student, view_teacher_dash
import io
import csv
from db import user_collection

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
async def delete_student_route(request: Request):
    auth_header = request.headers.get("Authorization") or ""
    user = verify_access(auth_header)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    body = await request.json()
    register_number = body.get("register_number")
    if not register_number:
        raise HTTPException(status_code=400, detail="Missing register_number")
    return await delete_student(register_number)



@router.get('/teacher/all')
async def get_teacher_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await get_teachers()


@router.delete("/teacher")
async def delete_teacher_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    body = await request.json()
    email = body.get("email")
    return await delete_teacher(email=email)

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

@router.get('/teacher/home')
async def get_teacher_dash(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    
    if user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")
    return await view_teacher_dash(user.get("email"))

@router.post('/student/add_data')
async def add_student_data_route(
    request: Request, 
):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "student":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")

    body = await request.json()
    student_data = body.get('student_data')
    sem = body.get('sem')


    return await add_student_data(email=user.get('email'), student_data=student_data, sem=sem)


@router.post('/students/bulk')
async def add_students_bulk(request: Request, file: UploadFile = File(...)):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")

    content = await file.read()
    decoded_content = content.decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(decoded_content))

    students_to_add = []

    for row in csv_reader:
        try:
            register_number = int(row["register_number"])

            existing_student = await user_collection.find_one({"register_number": register_number})
            if existing_student:
                raise HTTPException(status_code=400, detail=f"Student with register number {register_number} already exists")
            
            generated_password = row["name"].split(" ")[0].lower() + str(register_number)[-4:]
            hashed_password = hash_password(generated_password)

            student_data = {
                "name": row["name"],
                "department": row["department"],
                "email": row["email"],
                "register_number": register_number,
                "password": hashed_password,
                "role": "student",
                "profile": None
            }
            students_to_add.append(student_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing row: {row}, Error: {str(e)}")


    if students_to_add:
        await user_collection.insert_many(students_to_add)

    return {"message": f"{len(students_to_add)} students added successfully"}


@router.get('/teacher/student_details')
async def get_student_details_route(request: Request):
    user = verify_access(request.headers.get("Authorization"))
    if user.get("role") != "teacher":
        raise HTTPException(status_code=403, detail="You are not authorized to perform this action")

    student_email = request.query_params.get("email")

    if not student_email:
        raise HTTPException(status_code=400, detail="Missing student_email parameter")

    return await get_student_details(email=student_email)