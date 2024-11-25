import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importing motion from framer-motion
import logo from '../assets/1.png';


function Logins() {
  const navigate = useNavigate();


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
          <div className="input">

            <div className="input-align">
                
            <motion.input
              className='in'
              type="text"
              placeholder="Full Name"
              required
            />
            <motion.input
              className='in'
              type="email"
              placeholder="Institutional Email"
            />

</div>


<div className="input-align">
            <motion.input
              className='in'
              type="password"
              placeholder="Enter Password"
              required
            />
            <motion.input
              className='in'
              type="password"
              placeholder="Re Enter Password"
            />

</div>
<motion.input
              className='in'
              type="email"
              placeholder="Student"
              readOnly
            />



            

            <motion.button
              className='log'
              onClick={goToLogIn}
            >
              Create Account
            </motion.button>
            <p className="sign-up">
              Already Have an Account?
              <a href="#" onClick={goToLogIn}> Sign In</a>
            </p>

          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Logins;
