import React from 'react';
import Navbar from '../components/navbar';
import { AiOutlineAudit } from "react-icons/ai";
import { FaUserTie, FaUserGraduate } from "react-icons/fa"; // Icons for teachers & students
import { useNavigate } from 'react-router-dom';

export default function AdminHome() {
  const navigate = useNavigate()
  return (
    <div className='admin_home'>
      <Navbar />
      <div className="container mt-4">
        <h4>Admin Dashboard</h4>
        <div className="mt-2 d-flex flex-wrap justify-content-between">


          <div className="card p-2" style={{ width: "25rem" }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Users Analytics</h5>
                <button  className='btn btn-outline-dark btn-sm mt-2'>View</button>
              </div>
              <AiOutlineAudit size={45} className="text-primary" />
            </div>
          </div>

          
          <div className="card p-2" style={{ width: "25rem" }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Manage Teachers</h5>
                <button onClick={()=>navigate('/admin/teachers')} className='btn btn-outline-dark btn-sm mt-2'>Manage</button>
              </div>
              <FaUserTie size={45} className="text-success" />
            </div>
          </div>

  
          <div className="card p-2" style={{ width: "25rem" }}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Manage Students</h5>
                <button onClick={()=>navigate('/admin/students')} className='btn btn-outline-dark btn-sm mt-2'>Manage</button>
              </div>
              <FaUserGraduate size={45} className="text-danger" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
