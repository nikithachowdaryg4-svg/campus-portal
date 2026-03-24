import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

// Layout child components (Placeholders for now)
import AdminDashboard from '../pages/AdminDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import StudentDashboard from '../pages/StudentDashboard';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (user.role === 'admin') {
      return (
        <>
          <NavLink to="/" end className="nav-btn">Home</NavLink>
          <NavLink to="/register" className="nav-btn">Register Users</NavLink>
        </>
      );
    }
    if (user.role === 'faculty') {
      return (
        <>
          <NavLink to="/" end className="nav-btn">Home</NavLink>
          <NavLink to="/assignments" className="nav-btn">Assignments</NavLink>
          <NavLink to="/marks" className="nav-btn">Marks</NavLink>
          <NavLink to="/notices" className="nav-btn">Notice Board</NavLink>
          <NavLink to="/free-periods" className="nav-btn">Class Statuses</NavLink>
        </>
      );
    }
    if (user.role === 'student') {
      return (
        <>
          <NavLink to="/" end className="nav-btn">Home</NavLink>
          <NavLink to="/assignments" className="nav-btn">Assignments</NavLink>
          <NavLink to="/marks" className="nav-btn">Marks</NavLink>
          <NavLink to="/notices" className="nav-btn">Notice Board</NavLink>
          <NavLink to="/feedback" className="nav-btn">Feedback</NavLink>
          <NavLink to="/class-status" className="nav-btn">Mark Class Status</NavLink>
        </>
      );
    }
  };

  return (
    <div className="layout-container">
      {/* Left Navigation Frame */}
      <div className="left-frame">
        <div className="nav-header">
          <h3>Welcome, {user.username}</h3>
          <p>Role: {user.role}</p>
        </div>
        <div className="nav-links">
          {renderNavLinks()}
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {/* Right Content Frame */}
      <div className="right-frame">
        <Routes>
          {user.role === 'admin' && <Route path="/*" element={<AdminDashboard />} />}
          {user.role === 'faculty' && <Route path="/*" element={<FacultyDashboard />} />}
          {user.role === 'student' && <Route path="/*" element={<StudentDashboard />} />}
        </Routes>
      </div>
    </div>
  );
};

export default DashboardLayout;
