import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminLogin from './pages/adminLogin'
import AdminHome from './pages/adminHome'
import ProtectedRoute from './utils/protected'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          {/* Protect this route */}
          <Route 
            path="/admin/home" 
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
