import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ProfileF() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [position, setPosition] = useState("");
  const [editable, setEditable] = useState(false); // State to toggle edit mode


  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = sessionStorage.getItem('userInfo');
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUserData(user);
        setPosition(user.position || "");
      } else {
        // Fetch from API if no data found in storage
        const fetchUserData = async () => {
          const token = localStorage.getItem('token');
          if (!token) return navigate('/login');
  
          try {
            const res = await fetch('http://localhost:3001/admin/profile', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            });
  
            const data = await res.json();
            if (res.ok) {
              setUserData(data.user);
              setPosition(data.user.position || "");
            } else {
              Swal.fire('Error', data.message || 'Failed to fetch user data.', 'error');
              navigate('/login');
            }
          } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire('Error', 'An error occurred while fetching user data.', 'error');
            navigate('/login');
          }
        };
  
        fetchUserData();
      }
    };
  
    loadUserData();
  }, [navigate]);
  

  const handleSave = async () => {
    if (position) {
      // Save the user's course and department
      const res = await fetch(`http://localhost:3001/admin/update-profile/${userData.googleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          position,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update sessionStorage with new user info
        const updatedUser = { ...userData, position };
        setUserData(updatedUser);
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setEditable(false); // Exit edit mode
        
        // Show success SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        // Show error SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Error updating profile.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      }
    } else {
      // Show warning SweetAlert
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in both fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleEdit = () => {
    setEditable(true); // Toggle to edit mode
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <h1>Account Overview</h1>

      <div className="prof-card">
        <div className="prof-card1">
          <div className="prof">
            <button className='profile'>
              <img src={userData?.picture} alt="User Profile" />
            </button>
          </div>

          <div className="prof1">
            <button>Account Overview</button>
            <button onClick={handleEdit}>Edit Account</button>
          </div>
        </div>

        <div className="prof-card2">
          <span className='profInfo'>Profile Information</span>

          <table className='t2'>
            <tr className='tr2'>
              <td className='td2'>Email Address</td>
              <td className='td2'>
                <input type="text" className='inp' value={userData?.email} readOnly />
              </td>
            </tr>
            <tr className='tr2'>
              <td className='td2'>Full Name</td>
              <td className='td2'>
                <input type="text" className='inp' value={userData?.name} readOnly />
              </td>
            </tr>
            <tr className='tr2'>
              <td className='td2'>Position</td>
              <td className='td2'>


                <select name="" id="" className='dropPos'
                  value={editable ? position : userData?.position}
                  onChange={(e) => setPosition(e.target.value)}
                  readOnly={!editable}>
                  <option value="">Select Position</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin Clerk 1">Admin Clerk 1</option>
                  <option value="Admin Clerk 2">Admin Clerk 2</option>
                  <option value="Admin Clerk 3">Admin Clerk 3</option>
                </select>
              </td>
            </tr>
            <tr className='tr2'>
              <td className='td2'>Role</td>
              <td className='td2'>
                <input type="text" className='inp' value={userData?.role || 'Student'} readOnly />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                {editable ? (
                  <button className='editBtn' onClick={handleSave}>Save Changes</button>
                ) : (
                  <button className='editBtn' onClick={handleEdit}>Edit Account</button>
                )}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
   
  );
}

export default ProfileF;
