from bson import ObjectId
from model.teacher import Profile, TeacherPost, StudentPost
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
    teacher_data['students'] = []
    await user_collection.insert_one(teacher_data)
    return {"message": "Teacher added successfully", "password": generated_password}  

async def get_teachers():
    students = await user_collection.find({'role': 'teacher'}).to_list()
    for stud in students:
        stud['_id'] = str(stud['_id'])
        for s in stud['students']:
            s['_id'] = str(s['_id'])
    return students

async def add_students(student: StudentPost):
    existing_entry = await user_collection.find_one({"register_number": student.register_number})
    if existing_entry:
        raise HTTPException(status_code=400, detail="Student already exists")
    generated_password = student.name.split(" ")[0].lower() + str(student.register_number)[-4:]
    hashed_password = hash_password(generated_password)
    student_data = student.model_dump()
    student_data["password"] = hashed_password  
    student_data["role"] = "student"
    student_data["profile"] = None
    await user_collection.insert_one(student_data)

    return {"message": "Student added successfully", "password": generated_password}

async def update_student(student: StudentPost):
    existing_entry = await user_collection.find_one({"register_number": student.register_number})
    if not existing_entry:
        raise HTTPException(status_code=404, detail="Student not found")
    student_data = student.model_dump()
    await user_collection.update_one({"register_number": student.register_number}, {"$set": student_data })
    return {"message": "Student updated successfully"}

async def get_students():
    students = await user_collection.find({'role': 'student'}).to_list()
    for stud in students:
        stud['_id'] = str(stud['_id'])
    return students

async def delete_student(id: int):
    existing_entry = await user_collection.find_one({"register_number": id})
    if not existing_entry:
        raise HTTPException(status_code=404, detail="Student not found")
    await user_collection.delete_one({"register_number" : id})
    return {"message": "Student deleted successfully"}

async def assign_students(std_id: str, teacher_id: str):
    try:
        # Validate ObjectIds
        try:
            std_object_id = ObjectId(std_id)
            teacher_object_id = ObjectId(teacher_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid student or teacher ID format")
        
        # Fetch the student and teacher from the database
        student = await user_collection.find_one({"_id": std_object_id, "role": "student"})
        teacher = await user_collection.find_one({"_id": teacher_object_id, "role": "teacher"})
        
        # Handle case where student or teacher doesn't exist
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if not teacher:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        # Check if the student is already assigned to the same teacher
        if student.get("teacher_id") == teacher_id:
            raise HTTPException(status_code=400, detail="Student is already assigned to this teacher")
        
        # Update the student with the new teacher ID
        await user_collection.update_one(
            {"_id": std_object_id}, 
            {"$set": {"teacher_id": teacher_id}}
        )
        
        # Add the student to the teacher's list of students (if not already there)
        if student["_id"] not in teacher.get("students", []):
            await user_collection.update_one(
                {"_id": teacher_object_id},
                {"$push": {"students": student}}
            )

        return {"message": "Student assigned successfully"}

    except HTTPException as e:
        raise e

async def get_student(email : str):
    try:
        student = await user_collection.find_one({"email": email, "role": "student"})
        student['_id'] = str(student['_id'])
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student
    except HTTPException as http_err:
        raise http_err


async def add_profile(email: str, profile_data: Profile):
    try:
        user = await user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if "profile" in user and user["profile"]:
            raise HTTPException(status_code=400, detail="User profile already exists")

        # Update user document with the new profile
        result = await user_collection.update_one(
            {"email": email},
            {"$set": {"profile": profile_data.dict()}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to add profile")

        return {"message": "Profile added successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
