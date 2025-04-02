import { NavLink, useNavigate } from "react-router-dom";

const  StudentNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-body">
            <div className="container">
                <NavLink className="navbar-brand" to="/student/home">Student DashBoard</NavLink>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/student/home" end>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/student/profile">Profile</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/student/comment">Comments</NavLink>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-danger btn-sm ms-3" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
     );
}
 
export default StudentNav;