import React, { useState, useEffect } from 'react'; // Added useEffect import
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import { format } from 'timeago.js'; // Import timeago.js

function Status() {
  const [notifications, setNotifications] = useState([]); // State to store notifications
  const [loading, setLoading] = useState(true); // Loading state
  const [userData, setUserData] = useState(null); // State to store user data
  
  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      setUserData(JSON.parse(storedUser)); // Set user data in state
    }

    // Fetch notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/contact'); // Adjust the URL as needed
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


  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <h1>Notifications</h1>
          {loading ? (
            <p>Loading notifications...</p> // Loading state displayed
          ) : (
            notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className='message'>
                  <p><b>{notification.fullName}</b></p> {/* Assuming 'fullName' is a field in notification */}
                  <p>{notification.message}</p>
                  <p><i>{format(notification.date)}</i></p> {/* Format the date using timeago.js */}
                </div>
              ))
            ) : (
              <p>No new notifications</p> // No notifications state
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Status;
