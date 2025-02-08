from model.teacher import TeacherPost, StudentPost
from db import user_collection
from fastapi import HTTPException, Request
from utils.security import hash_password
from utils.token import verify_access  

async def add_teachers(teacher: TeacherPost,):
    existing_entry = await user_collection.find_one({"email": teacher.email})
    if existing_entry:
        raise HTTPException(status_code=400, detail="Teacher already exists")
    generated_password = teacher.name.split(" ")[0].lower() + str(teacher.phone)[:4]
    hashed_password = hash_password(generated_password)
    teacher_data = teacher.model_dump()
    teacher_data["password"] = hashed_password
    teacher_data["role"] = "teacher"
    await user_collection.insert_one(teacher_data)
    return {"message": "Teacher added successfully", "password": generated_password}  

async def add_students(student: StudentPost):
    existing_entry = await user_collection.find_one({"register_number": student.register_number})
    if existing_entry:
        raise HTTPException(status_code=400, detail="Student already exists")
    generated_password = student.name.split(" ")[0].lower() + str(student.register_number)[-4:]
    hashed_password = hash_password(generated_password)
    student_data = student.model_dump()
    student_data["password"] = hashed_password  
    student_data["role"] = "student"
    await user_collection.insert_one(student_data)

    return {"message": "Student added successfully", "password": generated_password}