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
        <li onClick={() => handleNavigation('/staff-Dashboard')}>Dashboard</li>
        <li onClick={() => handleNavigation('/staff-studentApp')}>Appointment</li>
        <li onClick={() => handleNavigation('/staff-reportGen')}>Report Generation</li>
        <li onClick={() => handleNavigation('/staff-postAnnouncements')}>Post Announcements</li>
        <li><Logout /></li>
        
      </ul>
    </div>
  );
}

export default Sidebar;
