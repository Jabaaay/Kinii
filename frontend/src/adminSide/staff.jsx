import React, { useState, useEffect } from 'react';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';

function Status() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/staff');
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate email to ensure it ends with @student.buksu.edu.ph
      const emailRegex = /^[a-zA-Z0-9._-]+@student\.buksu\.edu\.ph$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please use an email ending with @student.buksu.edu.ph.',
        });
        return;
      }

      if (!fullName || !email || !position) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Fields',
          text: 'Please fill in all required fields.',
        });
        return;
      }

      const requestData = {
        fullName: fullName.trim(),
        email: email.trim(),
        position: position,
      };

      const response = await fetch('http://localhost:3001/admin/invite-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Invitation sent successfully.',
        });
        setFullName('');
        setEmail('');
        setPosition('');
        setIsModalOpen(false);
        fetchStaff(); // Refresh staff list
      } else {
        throw new Error('Failed to send invite');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong.',
      });
    }
  };

  const handleDelete = async (staffId) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/staff/${staffId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStaffList(staffList.filter((staff) => staff._id !== staffId));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Staff member removed successfully.',
        });
      } else {
        throw new Error('Failed to delete staff');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete staff.',
      });
    }
  };

  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <div className="add">
            <h1 className="my">Manage Staff</h1>
            <button className="add-new" onClick={() => setIsModalOpen(true)}>
              + Add Staff
            </button>
          </div>
          <div className="app">
            <table className="staffTable">
              <thead>
                <tr className="tr1">
                  <th className="td1">ID</th>
                  <th className="td1">Name</th>
                  <th className="td1">Email Address</th>
                  <th className="td1">Position</th>
                  <th className="td1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr key={staff._id} className="tr1">
                    <td className="td1">{index + 1}</td>
                    <td className="td1">{staff.fullName}</td>
                    <td className="td1">{staff.email}</td>
                    <td className="td1">{staff.position}</td>
                    <td className="td1">
                      <div className="act">
                        <MdDelete className='del' onClick={() => handleDelete(staff._id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Add Staff</h2>
            <input
              type="text"
              className="inp1"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              className="inp1"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="drop"
            >
              <option value="">Select Position</option>
              <option value="Staff">Staff</option>
              <option value="Admin Clerk 1">Admin Clerk 1</option>
              <option value="Admin Clerk 2">Admin Clerk 2</option>
              <option value="Admin Clerk 3">Admin Clerk 3</option>
            </select>
            <br />
            <button onClick={handleSubmit} className="submit-btn">
              Add Staff
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Status;
