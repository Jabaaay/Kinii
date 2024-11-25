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

      const response = await fetch('http://localhost:3001/admin/invite-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          position: position
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invite');
      }

      const data = await response.json();
      setMessage('Invitation sent successfully! Staff member will receive an email.');
      setFullName('');
      setEmail('');
      setPosition('');
    } catch (error) {
      setMessage(error.message || 'Something went wrong');
    }
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
              <input
                type="text"
                className="inp1"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
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
