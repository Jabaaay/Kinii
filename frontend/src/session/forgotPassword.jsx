import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion"; // Importing motion from framer-motion
import logo from '../assets/1.png';


function Logins() {
  const navigate = useNavigate();

  const goToLogIn = () => {
    alert('Please check your email for confirmation');
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
          <h1 className='h1'>Reset Password</h1>
          <div className="input">
            <br />


<input type="text"  className="in" placeholder="Institutional Email" required/>

<br />

            

            <motion.button
              className='log'
              onClick={goToLogIn}
            >
              Reset Password
            </motion.button>


          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Logins;
