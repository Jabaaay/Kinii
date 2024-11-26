import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from '../assets/1.png';
import Swal from 'sweetalert2';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Verification Code Sent!',
          text: 'Please check your email for the verification code.',
        });
        sessionStorage.setItem('resetEmail', email);
        navigate('/verify-code');
      } else {
        throw new Error(data.message || 'Failed to send verification code');
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
          <h1 className='h1'>Forgot Password</h1>
          <p className="text-center text-gray-600 mb-4">
            Enter your email address to receive a verification code
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <input
                type="email"
                className="in"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <motion.button
                className='log'
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default ForgotPassword;
