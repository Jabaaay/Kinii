import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Logins from '../adminSide/adminLogin';





const clientId = "556695054744-arqaruhda60fv774uephm2irh0uan4du.apps.googleusercontent.com";



function Login() {


  const [count, setCount] = useState(0);
  const navigate = useNavigate();


  const loginAdmin = () => {
    navigate('/adminDashboard');
  }

  return (
    <>

<nav>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

    </nav>

      <div className="card">
        <h1 className='h1'>Log In as Admin</h1>
        <div className="input">
      
          <label>Username:</label><input className='in' type="text" placeholder="Username" required />
          <label>Password:</label><input className='in' type="password" placeholder="Password" />
          <button className='log' onClick={handleLogin}>Log In</button> 
          
          <hr />
          
          <Logins className="log1" />

          <a className='ad' href="" onClick={loginAdmin}>Admin</a>

          
        </div>

       
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
    
     

      </Routes>
    </Router>
  );
}

export default App;
