import React, { useEffect, useState } from 'react';
import logo from './assets/1.png';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));  // Set user data in state
    }
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className="user-info">
        {/* Display user initial or profile picture if available */}
        {userData ? (
          <button className='user' onClick={() => handleNavigation('/profile')}>
            {userData.picture ? (
              <img src={userData.picture} alt="User"  />
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
