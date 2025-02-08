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