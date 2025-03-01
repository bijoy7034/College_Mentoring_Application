import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { AiFillFileAdd, AiOutlineCloudDownload } from 'react-icons/ai';

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ name: "", department: "", email: "", register_number: "" });
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const departments = [
        "Computer Science",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Electronics and Communication",
        "Information Technology",
    ];

    useEffect(() => {
        const fetchStudentsAndTeachers = async () => {
            try {
                const studentResponse = await axios.get('http://127.0.0.1:8000/admin/student/all', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setStudents(studentResponse.data);

                const teacherResponse = await axios.get('http://127.0.0.1:8000/admin/teacher/all', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setTeachers(teacherResponse.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchStudentsAndTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/admin/student/', formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });
            

            setGeneratedPassword(response.data.password);
            setStudents([...students, formData]);

            
            setShowSuccess(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete("http://127.0.0.1:8000/admin/student/", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                data: { register_number: id }  
            });
    
            if (response.status === 200) {
                setStudents(students.filter(student => student.register_number !== id));
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting student");
        }
    };
    

    const handleAssignTeacher = async () => {
        if (selectedTeacher && selectedStudent) {
            try {
                await axios.patch('http://127.0.0.1:8000/admin/assign/', {
                    student_id: selectedStudent._id, 
                    teacher_id: selectedTeacher._id
                }, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json",
                    }
                });
    
                alert('Teacher assigned successfully!');
                setSelectedTeacher(null);
                setSelectedStudent(null);
            } catch (err) {
                console.log(err);
    
                if (err.response && err.response.data && err.response.data.detail) {
                    alert(err.response.data.detail);
                } else {
                    alert('An error occurred while assigning the teacher. Please try again.');
                }
            }
        } else {
            alert("Please select both a student and a teacher before assigning.");
        }
    };
    

    const handleAddAnother = () => {
        setFormData({ name: "", department: "", email: "", register_number: "" });
        setGeneratedPassword("");
        setShowSuccess(false);
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h4>Students</h4>
                    <div>
                        <button type="button" className="btn btn-dark btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                            <AiFillFileAdd size={18} className="me-1" /> Add
                        </button>
                        <button className="btn btn-outline-dark btn-sm mx-1">
                            <AiOutlineCloudDownload size={18} className="me-1" /> Download
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Reg No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Department</th>
                            <th scope="col">Email</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <th scope="row">{student.register_number}</th>
                                <td>{student.name}</td>
                                <td>{student.department}</td>
                                <td>{student.email}</td>
                                <td>
                                    <button className="btn btn-outline-primary btn-sm mx-1">Update</button>
                                    <button className="btn btn-outline-danger btn-sm mx-1" onClick={(e)=>handleDelete(student.register_number)}>Delete</button>
                                    <button
                                        className="btn btn-outline-success btn-sm mx-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#assignTeacherModal"
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        Assign Faculty
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bootstrap Modal for Adding Student */}
            <div className="modal fade" id="addStudentModal" tabIndex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addStudentModalLabel">Add Student</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAddAnother}></button>
                        </div>
                        <div className="modal-body">
                            {showSuccess ? (
                                <div className="text-center">
                                    <div className="alert alert-success">
                                        <h5>Student added successfully!</h5>
                                        <p><strong>Generated Password: {generatedPassword}</strong></p>
                                    </div>
                                    <button className="btn btn-dark" onClick={handleAddAnother}>Add Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Department</label>
                                        <select className="form-control" name="department" value={formData.department} onChange={handleChange} required>
                                            <option value="">Select Department</option>
                                            {departments.map((dept, index) => (
                                                <option key={index} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Register Number</label>
                                            <input type="text" className="form-control" name="register_number" value={formData.register_number} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-dark btn-sm" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-dark btn-sm">Save Student</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* Bootstrap Modal for Assigning Teacher */}
            <div className="modal fade" id="assignTeacherModal" tabIndex="-1" aria-labelledby="assignTeacherModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Assign Teacher</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <select className="form-select" onChange={(e) => setSelectedTeacher(teachers.find(t => t._id === e.target.value))}>
                                <option value="">Select Teacher</option>
                                {teachers.map(teacher => <option key={teacher._id} value={teacher._id}>{teacher.name}</option>)}
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-dark btn-sm" onClick={handleAssignTeacher}>Assign</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
