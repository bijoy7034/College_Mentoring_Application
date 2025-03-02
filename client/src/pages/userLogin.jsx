import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async () => {
    if (!email || !password) return;

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login/", {
        email,
        password,
      });

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        if (response.data.role === "student"){
          navigate('/student/home')
        }
        else {
          navigate('/teacher/home')
        }
        
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid Credentials");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="container login">
      <b>
        <h3 className="text-center mb-4 text-bold">Login</h3>
      </b>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label">Save Login Info</label>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-dark" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
