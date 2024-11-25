// Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './session/logout';
import { FaCalendar } from 'react-icons/fa'; // Import calendar icon

function Sidebar() {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="card2">
      <ul>
        <li onClick={() => handleNavigation('/dashboard')}>My Appointment</li>
        <li onClick={() => handleNavigation('/history')}>View History</li>
        <li onClick={() => handleNavigation('/status')}>Status</li>
        <li onClick={() => handleNavigation('/calendar')}>Calendar
        </li>
        <li><Logout /></li>
      </ul>
    </div>
  );
}

export default Sidebar;
