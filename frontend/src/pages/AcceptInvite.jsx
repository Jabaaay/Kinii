import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AcceptInvite() {
  const [status, setStatus] = useState('Verifying...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatus('Invalid invitation link');
      return;
    }

    verifyToken(token);
  }, [location]);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/auth/verify-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        // Token is valid, redirect to login
        navigate('/login');
      } else {
        setStatus('Invalid or expired invitation');
      }
    } catch (error) {
      setStatus('Error verifying invitation');
    }
  };

  return (
    <div>
      <h1>Staff Invitation</h1>
      <p>{status}</p>
    </div>
  );
}

export default AcceptInvite; 