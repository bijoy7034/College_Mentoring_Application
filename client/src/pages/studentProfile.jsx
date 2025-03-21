import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentNav from "../components/studentNav";
import Footer from "../components/footer";

const StudentProfile = () => {
    const [student, setStudent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/admin/student/profile", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        "Content-Type": "application/json",
                    },
                });

                if (!response.data.profile) {
                    setError("You need to create a profile to use the application.");
                    return;
                }

                setStudent(response.data);
            } catch (err) {
                if (err.response) {
                    setError("Error fetching student profile: " + err.response.data.detail);
                } else {
                    setError("Network error. Please try again later.");
                }
            }
        };

        fetchStudent();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!student) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    const { name, department, email, register_number, profile } = student;
    const { dob, grade_10, grade_12, blood_group, doctor_name, allergies, treatment, daily_medicine, religion, community, father, mother, guardian } = profile;

    return (
        <><StudentNav /><div className="container mt-4">
            <h2 className="text-center mb-4">Student Profile</h2>
            <div className="card  p-4">
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <h4 className="text-primary">Basic Information</h4>
                        <ul className="list-group mb-4">
                            <li className="list-group-item"><strong>Name:</strong> {name}</li>
                            <li className="list-group-item"><strong>Department:</strong> {department}</li>
                            <li className="list-group-item"><strong>Email:</strong> {email}</li>
                            <li className="list-group-item"><strong>Register Number:</strong> {register_number}</li>
                            <li className="list-group-item"><strong>Date of Birth:</strong> {dob}</li>
                        </ul>

                        <h4 className="text-primary">Academic Details</h4>
                        <ul className="list-group mb-4">
                            <li className="list-group-item"><strong>10th Grade:</strong> {grade_10}%</li>
                            <li className="list-group-item"><strong>12th Grade:</strong> {grade_12}%</li>
                        </ul>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <h4 className="text-primary">Medical Information</h4>
                        <ul className="list-group mb-4">
                            <li className="list-group-item"><strong>Blood Group:</strong> {blood_group}</li>
                            <li className="list-group-item"><strong>Doctor Name:</strong> {doctor_name}</li>
                            <li className="list-group-item"><strong>Allergies:</strong> {allergies}</li>
                            <li className="list-group-item"><strong>Treatment:</strong> {treatment}</li>
                            <li className="list-group-item"><strong>Daily Medicine:</strong> {daily_medicine}</li>
                        </ul>

                        <h4 className="text-primary">Personal & Family Details</h4>
                        <ul className="list-group">
                            <li className="list-group-item"><strong>Religion:</strong> {religion}</li>
                            <li className="list-group-item"><strong>Community:</strong> {community}</li>
                            <li className="list-group-item"><strong>Father:</strong> {father.name} ({father.occupation}), 📞 {father.phone}</li>
                            <li className="list-group-item"><strong>Mother:</strong> {mother.name} ({mother.occupation}), 📞 {mother.phone}</li>
                            <li className="list-group-item"><strong>Guardian:</strong> {guardian.name}, 📞 {guardian.phone}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <Footer/></>
    );
};

export default StudentProfile;
