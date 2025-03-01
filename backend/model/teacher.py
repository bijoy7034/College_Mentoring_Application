from typing import List
from pydantic import BaseModel

class TeacherPost(BaseModel):
    name: str
    department: str
    phone : int
    email: str

class StudentPost(BaseModel):
    name: str
    department: str
    email: str
    register_number: int


class Parent(BaseModel):
    name: str
    occupation: str
    phone: str

class Sibling(BaseModel):
    name: str
    occupation: str
    phone: str

class Guardian(BaseModel):
    name: str
    phone: str

class Profile(BaseModel):
    dob: str
    grade_10: str
    grade_12: str
    blood_group: str
    doctor_name: str
    allergies: str
    treatment: str
    daily_medicine: str
    religion: str
    community: str
    father: Parent
    mother: Parent
    siblings: List[Sibling]
    guardian: Guardian


