import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importing motion from framer-motion
import logo from '../assets/1.png';
import { useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import './signUp.css';


function Logins() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: ''
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    submit: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (name === 'password' || name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswords = () => {
    let isValid = true;
    const newErrors = {};

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
      isValid = false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePasswords()) {
      try {
        // Check if position is Staff
        if (formData.position === 'Staff') {
          const response = await axios.post('http://localhost:3001/api/staff/register', {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            position: formData.position
          });

          if (response.data.success) {
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('staffId', response.data.staffId);
            
            // Show success message based on whether it was an update or new registration
            const message = response.data.isUpdate 
              ? 'Account updated successfully!' 
              : 'Account created successfully!';
            
            // You can use a toast notification here if you have one
            alert(message); // Replace with your preferred notification method
            
            // Redirect to admin dashboard
            navigate('/admindashboard');
          }
        } else {
          // Handle other user types (Student, etc.)
          setErrors(prev => ({
            ...prev,
            submit: 'This registration is only for staff members.'
          }));
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Registration failed. Please try again.'
        }));
      }
    }
  };

  const goToLogIn = () => {
    navigate('/login');
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
          <h1 className='h1'>Create Account</h1>
          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input">
              <div className="input-align">
                <motion.input
                  className='in'
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <motion.input
                  className='in'
                  type="email"
                  name="email"
                  placeholder="Enter Personal Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-align">
                <div className="password-input-container">
                  <motion.input
                    className={`in ${errors.password ? 'error' : ''}`}
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="password-input-container">
                  <motion.input
                    className={`in ${errors.confirmPassword ? 'error' : ''}`}
                    type="password"
                    name="confirmPassword"
                    placeholder="Re Enter Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="input-align">
                <motion.select
                  className='in'
                  required
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Position</option>
                  <option value="Staff">Staff</option>
                  <option value="Student">Student</option>
                  <option value="Admin Clerk 1">Admin Clerk 1</option>
                  <option value="Admin Clerk 2">Admin Clerk 2</option>
                  <option value="Admin Clerk 3">Admin Clerk 3</option>
                </motion.select>
              </div>

              <motion.button
                className='log'
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Account
              </motion.button>
              <p className="sign-up">
                Already Have an Account?
                <a href="#" onClick={goToLogIn}> Sign In</a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Logins;
