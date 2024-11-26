import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/1.png';
import Swal from 'sweetalert2';

function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if email exists in session
    const email = sessionStorage.getItem('resetEmail');
    if (!email) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = sessionStorage.getItem('resetEmail');
      const response = await fetch('http://localhost:3001/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store verification status in sessionStorage
        sessionStorage.setItem('codeVerified', 'true');
        
        Swal.fire({
          icon: 'success',
          title: 'Code Verified!',
          text: 'Please enter your new password.',
        });
        navigate('/change-password', { replace: true });
      } else {
        throw new Error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.nav>
        <div className="logo">
          <motion.img
            src={logo}
            alt="logo"
            whileHover={{ scale: 1.1 }}
          />
        </div>
      </motion.nav>
      <div className="bg">
        <motion.div
          className="card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='h1'>Enter Verification Code</h1>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <input
                type="text"
                className="in"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <motion.button
                className='log'
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default VerifyCode; 