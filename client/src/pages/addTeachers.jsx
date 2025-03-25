import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { AiFillFileAdd, AiOutlineCloudDownload } from 'react-icons/ai';

export default function AdminTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({ name: "", department: "", phone: "", email: "" });
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null); 

    const departments = [
        "Computer Science",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Electronics and Communication",
        "Information Technology",
    ];

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/admin/teacher/all', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setTeachers(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/admin/teacher/', formData, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            setGeneratedPassword(response.data.password);
            setTeachers([...teachers, formData]);
            setShowSuccess(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete("http://127.0.0.1:8000/admin/teacher/", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                data: { email: id }  
            });

                setTeachers(prev => prev.filter(teacher => teacher.email !== id));
        } catch (err) {
            console.error("Error deleting student:", err);
            alert("Error deleting student");
        }
    };

    const handleAddAnother = () => {
        setFormData({ name: "", department: "", phone: "", email: "" });
        setGeneratedPassword("");
        setShowSuccess(false);
    };

    const handleViewStudents = (teacher) => {
        setSelectedTeacher(teacher);  // Set selected teacher
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h4>Teachers</h4>
                    <div>
                        <button type="button" className="btn btn-dark btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#addTeacherModal">
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
                            <th scope="col">Name</th>
                            <th scope="col">Department</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher, index) => (
                            <tr key={index}>
                                <td>{teacher.name}</td>
                                <td>{teacher.department}</td>
                                <td>{teacher.phone}</td>
                                <td>{teacher.email}</td>
                                <td>
                                    <button className="btn btn-outline-danger btn-sm mx-1" onClick={(e)=>handleDelete(teacher.email)}>Delete</button>
                                    <button className="btn btn-outline-primary btn-sm mx-1">Update</button>
                                    <button className="btn btn-outline-success btn-sm mx-1" onClick={() => handleViewStudents(teacher)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Bootstrap Modal for Adding Teacher */}
            <div className="modal fade" id="addTeacherModal" tabIndex="-1" aria-labelledby="addTeacherModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addTeacherModalLabel">Add Teacher</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleAddAnother}></button>
                        </div>
                        <div className="modal-body">
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

                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>

                                {/* Success Message & Generated Password */}
                                {showSuccess && (
                                    <div className="alert alert-success">
                                        Teacher added successfully! <br />
                                        Generated Password: <strong>{generatedPassword}</strong>
                                    </div>
                                )}

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleAddAnother}>Close</button>
                                    <button type="submit" className="btn btn-primary">Add Teacher</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Bootstrap Modal for Viewing Students */}
            {selectedTeacher && (
                <div className="modal fade show" id="viewStudentsModal" tabIndex="-1" aria-labelledby="viewStudentsModalLabel" style={{ display: 'block' }} aria-hidden="false">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewStudentsModalLabel">Students of {selectedTeacher.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedTeacher(null)}></button>
                            </div>
                            <div className="modal-body">
                                <h6>Department: {selectedTeacher.department}</h6>
                                <h6>Email: {selectedTeacher.email}</h6>
                                <h6>Phone: {selectedTeacher.phone}</h6>
                                <h5>Students:</h5>
                                {selectedTeacher.students && selectedTeacher.students.length > 0 ? (
                                    <ul>
                                        {selectedTeacher.students.map((student, index) => (
                                            <li key={index}>
                                                <strong>{student.name}</strong> ({student.department})<br />
                                                Email: {student.email}<br />
                                                Register Number: {student.register_number}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No students available for this teacher.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
