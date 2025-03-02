import React, { useEffect, useState } from "react";
import TeacherNav from "../components/teacherNav";
import Footer from "../components/footer";

export default function Teacher() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/admin/teacher/home", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        return response.json();
      })
      .then((data) => {
        setTeacher(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <TeacherNav />
      <div className="container mt-4 flex-grow-1">
        <div className="row">
          <div className="col-md-8">
            <h3>Students List</h3>
            {teacher.students.length === 0 ? (
              <p>No students assigned.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr className="text-primary">
                    <th><b>#</b></th>
                    <th><b>Name</b></th>
                    <th><b>Department</b></th>
                    <th><b>Email</b></th>
                    <th><b>Register Number</b></th>
                    <th><b>Actions</b></th>
                  </tr>
                </thead>
                <tbody>
                  {teacher.students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.department}</td>
                      <td>{student.email}</td>
                      <td>{student.register_number}</td>
                      <td><button className="btn btn-outline-success btn-sm">View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Teacher Profile */}
          <div className="col-md-4">
            <div className="card p-4">
              <h4 className="mb-3">Teacher Profile</h4>
              <ul className="list-group">
                <li className="list-group-item"><strong>Name:</strong> {teacher.name}</li>
                <li className="list-group-item"><strong>Department:</strong> {teacher.department}</li>
                <li className="list-group-item"><strong>Phone:</strong> {teacher.phone}</li>
                <li className="list-group-item"><strong>Email:</strong> {teacher.email}</li>
                <li className="list-group-item"><strong>Role:</strong> {teacher.role}</li>
                <li className="list-group-item"><strong>Assigned Students:</strong> {teacher.students.length}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
