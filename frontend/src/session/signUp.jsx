import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importing motion from framer-motion
import logo from '../assets/1.png';
import { useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import './signUp.css';


function Logins() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
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
        let response;
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        };

        // Choose the endpoint based on the selected role
        if (formData.role === 'Staff' || formData.role === 'Admin') {
          response = await axios.post('http://localhost:3001/api/auth/register-admin', {
            ...userData,
            position: '', // Add empty position for admin/staff
            picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          });
        } else {
          response = await axios.post('http://localhost:3001/api/auth/register', userData);
        }

        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          
          alert(response.data.message);
          
          switch(formData.role) {
            case 'Staff':
            case 'Admin':
              alert('Please login to access your account');
              navigate('/adminLogin');
              break;
            case 'Student':
              navigate('/login');
              break;
            default:
              navigate('/login');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
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
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
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
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
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
