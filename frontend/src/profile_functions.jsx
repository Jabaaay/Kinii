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

  useEffect(() => {
    if (department && collegeCoursesMap[department]) {
      // Ensure the course remains consistent
      if (!collegeCoursesMap[department].includes(course)) {
        setCourse(""); // Reset course if it doesn't match the department
      }
    }
  }, [department]);

  const handleSave = async () => {
    if (course && department) {
      const res = await fetch(`http://localhost:3001/update-profile/${userData.googleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course, department }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        const updatedUser = { ...userData, course, department };
        sessionStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setEditable(false);
  
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Error updating profile. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  };
  

  const handleEdit = () => {
    setEditable(true); // Toggle to edit mode
  };

  const collegeCoursesMap = {
    COT: [
      "Bachelor of Science in Information Technology",
      "Bachelor of Science in Entertainment and Multimedia Computing major in Digital Animation Technology Game Development",
      "Bachelor of Science in Automotive Technology",
      "Bachelor of Science in Electronics Technology",
      "Bachelor of Science in Food Technology"
    ],
    CAS: [
      "Bachelor of Science in Biology Major in Biotechnology",
      "Bachelor of Arts in English Language",
      "Bachelor of Arts in Economics",
      "Bachelor of Arts in Sociology",
      "Bachelor of Arts in Philosophy",
      "Bachelor of Arts in Social Science",
      "Bachelor of Science in Mathematics",
      "Bachelor of Science in Community Development",
      "Bachelor of Science in Development Communication"
    ],
    CPAG: ["Bachelor of Public Administration Major in Local Governance"],

    CON: ["Bachelor of Science in Nursing"],

    COE: [
      "Bachelor of Elementary Education",
      "Bachelor of Secondary Education Major in Mathematics",
      "Bachelor of Secondary Education Major in Filipino",
      "Bachelor of Secondary Education Major in English",
      "Bachelor of Secondary Education Major in Social Studies",
      "Bachelor of Secondary Education, Major in Science",
      "Bachelor of Early Childhood Education",
      "Bachelor of Physical Education"
    ],
    COB: [
      "Bachelor of Science in Accountancy",
      "Bachelor of Science in Business Administration Major in Financial Management",
      "Bachelor of Science in Hospitality Management"
    ],

    COL: ["Bachelor of Law (Juris Doctor)"]
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
              <td className='td2'>College</td>
              <td className='td2'>
                <select
                  name="department"
                  id="department"
                  className='dropPos'
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={!editable}>
                  <option value="">Select Colleges</option>
                  {Object.keys(collegeCoursesMap).map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr className='tr2'>
              <td className='td2'>Course</td>
              <td className='td2'>
                <select
                  name="course"
                  id="course"
                  className='dropPos'
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  disabled={!editable || !department}>
                  <option value="">Select Course</option>
                  {department &&
                    collegeCoursesMap[department]?.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
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