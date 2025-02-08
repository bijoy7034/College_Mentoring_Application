import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    const handleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/admin')
    }
  return (
<nav class="navbar bg-dark navbar-expand-lg border-body" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Mentoring Admin</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Add Student</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Add Teacher</a>
        </li>
        <button className='btn btn-danger btn-sm mx-5' onClick={handleLogout}>Logout</button>
      </ul>
    </div>
  </div>
</nav>
  )
}
