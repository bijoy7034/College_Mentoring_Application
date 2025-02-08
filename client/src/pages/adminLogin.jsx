import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return; 
    }
    setError(""); 
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/admin/login", {
        email,
        password,
      });
      if (response.data.access_token){
        localStorage.setItem("token", response.data.access_token)
        navigate("/admin/home")
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="container login">
      <b>
        <h3 className="text-center mb-4 text-bold">Admin Login</h3>
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
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
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
}
