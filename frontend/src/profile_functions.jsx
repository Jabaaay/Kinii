import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

function ProfileF() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false); // State to toggle edit mode
  const [course, setCourse] = useState(""); // For holding course information
  const [department, setDepartment] = useState(""); // For holding department information

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setCourse(parsedUser.course || ""); // Initialize course with stored value
      setDepartment(parsedUser.department || ""); // Initialize department with stored value
    } else {
      // If no user data, navigate to the login page
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = async () => {
    if (course && department) {
      // Save the user's course and department
      const res = await fetch(`http://localhost:3001/update-profile/${userData.googleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course,
          department,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Update sessionStorage with new user info
        const updatedUser = { ...userData, course, department };
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
              <td className='td2'>Course</td>
              <td className='td2'>
                <input
                  type="text"
                  className='inp'
                  value={editable ? course : userData?.course}
                  onChange={(e) => setCourse(e.target.value)}
                  readOnly={!editable}
                />
              </td>
            </tr>
            <tr className='tr2'>
              <td className='td2'>Department</td>
              <td className='td2'>
                <input
                  type="text"
                  className='inp'
                  value={editable ? department : userData?.department}
                  onChange={(e) => setDepartment(e.target.value)}
                  readOnly={!editable}
                />
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
