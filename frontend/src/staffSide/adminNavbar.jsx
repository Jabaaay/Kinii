import React, { useEffect, useState } from 'react';
import logo from '../assets/1.png';
import { useNavigate } from 'react-router-dom';
import { MdNotifications } from "react-icons/md";

function NavBar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      setUserData(JSON.parse(storedUser)); // Set user data in state
    }

    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/staff/contact'); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setNotifications(data); // Store fetched notifications
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    fetchNotifications();
  }, []);

  const handleNavigation = (route) => {
    navigate(route);  // Navigate to the specified route
  };

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="user-info">
        <MdNotifications 
          className="notif" 
          onClick={() => handleNavigation('/staff-notification')}  // Navigate to notifications page
        />
        
        {userData ? (
          <button className='user' onClick={() => handleNavigation('/staff-Profile')}>
            {userData.picture ? (
              <img src={userData.picture} alt="User" />
            ) : (
              <span>{userData.name?.charAt(0)}</span> // Show initial if no picture
            )}
          </button>
        ) : (
          <button className='user' onClick={() => handleNavigation('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
