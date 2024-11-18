import React, { useState } from 'react';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';

function Status() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email }),
      });

      if (!response.ok) {
        throw new Error('Failed to add staff member');
      }

      const data = await response.json();
      setMessage(data.message);
      setFullName('');
      setEmail('');
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
              <input type="text" className="inp1" placeholder="Add as Staff" readOnly />
              <br /><br /><br /><br /><br />
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
