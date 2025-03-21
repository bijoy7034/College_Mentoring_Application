import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherNav from "../components/teacherNav";
import Footer from "../components/footer";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null); 

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/teacher/student_details", { 
          params: { email: id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setStudent(response.data);
        console.log(response.data);
      } catch (err) {
        if (err.response) {
          setError(`Error fetching student details: ${err.response.data.detail}`);
        } else {
          setError("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <TeacherNav />
      <div className="container mt-4 flex-grow-1">
        <button className="btn btn-outline-dark mb-3" onClick={() => navigate(-1)}>
          ⬅ Back to Student List
        </button>

        <h2 className="text-primary mb-3">Student Details</h2>

        <div className="card p-4">
          <div className="row">
          <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>Name:</strong> {student.name}</li>
            <li className="list-group-item"><strong>Department:</strong> {student.department}</li>
            <li className="list-group-item"><strong>Email:</strong> {student.email}</li>
            <li className="list-group-item"><strong>Register Number:</strong> {student.register_number}</li>
          </ul>
          </div>

          <div className="col-md-6">
          {/* <h4 className="mt-4">Profile Information</h4> */}
          <ul className="list-group">
            {student.profile && (
              <>
                <li className="list-group-item"><strong>Date of Birth:</strong> {student.profile.dob}</li>
                <li className="list-group-item"><strong>Blood Group:</strong> {student.profile.blood_group}</li>
                <li className="list-group-item"><strong>Doctor Name:</strong> {student.profile.doctor_name}</li>
                <li className="list-group-item"><strong>Allergies:</strong> {student.profile.allergies}</li>
                <li className="list-group-item"><strong>Ongoing Treatment:</strong> {student.profile.treatment}</li>
                <li className="list-group-item"><strong>Daily Medicine:</strong> {student.profile.daily_medicine}</li>
                <li className="list-group-item"><strong>Religion:</strong> {student.profile.religion}</li>
                <li className="list-group-item"><strong>Community:</strong> {student.profile.community}</li>
              </>
            )}
          </ul>
          </div>
          </div>

          <h4 className="mt-4">Semester Details</h4>
          <div className="accordion" id="semesterAccordion">
            {Object.keys(student)
              .filter((key) => key.startsWith("semester_"))
              .map((semesterKey, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading-${index}`}>
                    <button
                      className={`accordion-button ${expandedSemester === index ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => setExpandedSemester(expandedSemester === index ? null : index)}
                    >
                      {semesterKey.replace("_", " ")}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${index}`}
                    className={`accordion-collapse collapse ${expandedSemester === index ? "show" : ""}`}
                  >
                    <div className="accordion-body">
                      <h5 className="text-primary">Curricular Details</h5>
                      <ul className="list-group">
                        <li className="list-group-item"><strong>University Result:</strong> {student[semesterKey].curricular.universityResult}</li>
                        <li className="list-group-item"><strong>Study Habits:</strong> {student[semesterKey].curricular.studyHabits}</li>
                        <li className="list-group-item"><strong>Online Material:</strong> {student[semesterKey].curricular.onlineMaterial}</li>
                        <li className="list-group-item"><strong>Professional Activities:</strong> {student[semesterKey].curricular.professionalActivities}</li>
                        <li className="list-group-item"><strong>Extra Activities:</strong> {student[semesterKey].curricular.extraActivities}</li>
                      </ul>

                      <h5 className="mt-3 text-primary">Traits</h5>
                      <ul className="list-group">
                        <li className="list-group-item"><strong>Goal:</strong> {student[semesterKey].traits.goal}</li>
                        <li className="list-group-item"><strong>Character Traits:</strong> {student[semesterKey].traits.characterTraits}</li>
                        <li className="list-group-item"><strong>Personal Traits:</strong> {student[semesterKey].traits.personalTraits}</li>
                        <li className="list-group-item"><strong>Learning Ability:</strong> {student[semesterKey].traits.learningAbility}</li>
                        <li className="list-group-item"><strong>Group Dynamics:</strong> {student[semesterKey].traits.groupDynamics}</li>
                        <li className="list-group-item"><strong>Leadership:</strong> {student[semesterKey].traits.leadership}</li>
                        <li className="list-group-item"><strong>Sincerity:</strong> {student[semesterKey].traits.sincerity}</li>
                      </ul>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
