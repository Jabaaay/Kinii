import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Importing motion from framer-motion
import logo from '../assets/1.png';
import ReCAPTCHA from "react-google-recaptcha";

const clientId = "403785858213-teclugcpi5rmkocudnj0dqgk0h3j8f5n.apps.googleusercontent.com";
const RECAPTCHA_SITE_KEY = "6LdndnoqAAAAAFIKS5elH66llnZvKoOmPIY21CNv";

function Logins() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Initialize the Google API client once component is mounted
  useEffect(() => {
    const loadGoogleAPI = () => {
      window.gapi.load("client:auth2", initClient);
    };

    if (window.gapi) {
      loadGoogleAPI();
    } else {
      // Google API script not loaded yet, add event listener to check when it's ready
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api.js";
      script.onload = loadGoogleAPI;
      document.body.appendChild(script);
    }
  }, []);

  const initClient = () => {
    window.gapi.client.init({
      apiKey: 'AIzaSyA_viGY4c2LAW1tXrIxGI5KDohhibrH52E', // Replace with your API key
      clientId: clientId, // Use your client ID
      scope: "https://www.googleapis.com/auth/calendar",
    }).then(() => {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        authInstance.signIn();
      }
    });
  };

  const handleSuccess = async (response) => {
    console.log("Login successful", response);
    try {
      sessionStorage.clear();
      const decoded = jwtDecode(response.credential);
      console.log(decoded);

      const res = await fetch('http://localhost:3001/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          course: "",
          department: "",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        console.log('User stored successfully:', data);
        setUserInfo(data.user);
        sessionStorage.setItem('userInfo', JSON.stringify(data.user));

        alert('Proceed to Profile for verification');
        navigate('/profile');
      } else {
        console.error('Error storing user:', data.error);
      }
    } catch (error) {
      console.error("Failed to decode token or store user:", error);
    }
  };

  const handleFailure = (error) => {
    console.log("Login failed", error);
  };

  const handleLogin = () => {
    if (recaptchaValue) {
      navigate('/dashboard');
    } else {
      alert("Please complete the reCAPTCHA verification.");
    }
  };

  const loginAdmin = () => {
    navigate('/adminLogin');
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
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
          <h1 className='h1'>Log In</h1>
          <div className="input">
            <label>Username:</label>
            <motion.input
              className='in'
              type="text"
              placeholder="Username"
              required
            />
            <label>Password:</label>
            <motion.input
              className='in'
              type="password"
              placeholder="Password"
            />
            
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              className='recaptcha'
            />
            <motion.button
              className='log'
              onClick={handleLogin}
            >
              Log In
            </motion.button>

            <hr />

            <motion.div
              id='signIn'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GoogleLogin 
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                cookiePolicy={'single-host-origin'}
                isSignedIn={true}
              />
            </motion.div>

            <motion.button
              className="log-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="" onClick={loginAdmin}>Admin</a>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Logins;