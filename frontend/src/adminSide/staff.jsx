import React, { useState } from 'react';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';

function Status() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      if (!email.endsWith('@gmail.com')) {
        setMessage('Please enter a valid Gmail address');
        return;
      }

      if (!fullName || !email || !position) {
        setMessage('Please fill in all required fields');
        return;
      }

      const requestData = {
        name: fullName.trim(),
        email: email.trim(),
        position: position,
        generateAdminLink: true
      };

      console.log('Sending data:', requestData);

      const response = await fetch('http://localhost:3001/admin/invite-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invite');
      }

      setMessage('Invitation sent successfully with admin access link');
      setFullName('');
      setEmail('');
      setPosition('');
    } catch (error) {
      console.error('Error details:', error);
      setMessage(error.message || 'Something went wrong');
    }
  };

  const inputStyle = {
    border: '1px solid', // Border color
    padding: '10px', // Padding
    width: '100%', // Full width
    marginBottom: '10px', // Space between inputs
  };

  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <h1>Add Staff</h1>
          <div className="app">
            <div className="addStaff">
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
                style={inputStyle} // Apply the same style to the dropdown
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              >
                <option value="">Select Position</option>
                <option value="Staff">Staff</option>
                <option value="Admin Clerk 1">Admin Clerk 1</option>
                <option value="Admin Clerk 2">Admin Clerk 2</option>
                <option value="Admin Clerk 3">Admin Clerk 3</option>
              </select>
              <br /><br /><br />
              <button className="con" onClick={handleSubmit}>
                Send Invites
              </button>
              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Status;
