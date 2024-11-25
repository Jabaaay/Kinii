import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/1.png';
import Swal from 'sweetalert2';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('resetEmail');
    const isVerified = sessionStorage.getItem('codeVerified');
    
    if (!email || !isVerified) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sessionStorage.getItem('resetEmail'),
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your password has been reset successfully.',
        });
        sessionStorage.removeItem('resetEmail');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Failed to reset password');
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
          <h1 className='h1'>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <input
                type="password"
                className="in"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="in"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <motion.button
                className='log'
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default ResetPassword; 