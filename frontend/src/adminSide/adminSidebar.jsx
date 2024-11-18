// Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './adminLogout.jsx';


function Sidebar() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="card2">
      <ul>
        <li onClick={() => handleNavigation('/adminDashboard')}>Dashboard</li>
        <li onClick={() => handleNavigation('/studentApp')}>Appointment</li>
        <li onClick={() => handleNavigation('/addStaff')}>Add Staff</li>
        <li onClick={() => handleNavigation('/reportGen')}>Report Generation</li>
        <li onClick={() => handleNavigation('/postAnnouncements')}>Post Announcements</li>
        <li><Logout /></li>
        
      </ul>
    </div>
  );
}

export default Sidebar;
