import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentNav from "../components/studentNav"; // Import Student Navbar
import Footer from "../components/footer";

export default function StudentComments() {
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/teacher/student_comments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setComments(response.data.comments);
      } catch (err) {
        if (err.response) {
          setError(`Error: ${err.response.data.detail}`);
        } else {
          setError("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="d-flex flex-column min-vh-100">
      <StudentNav />
      <div className="container mt-4 flex-grow-1">
        <h2 className="text-primary mb-3">My Semester Comments</h2>
        <div className="card p-4">
          <ul className="list-group">
            {Object.keys(comments).length > 0 ? (
              Object.entries(comments).map(([semester, comment], index) => (
                <li key={index} className="list-group-item">
                  <strong>{semester.replace("_", " ").toUpperCase()}:</strong> {comment}
                </li>
              ))
            ) : (
              <p>No comments available</p>
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
