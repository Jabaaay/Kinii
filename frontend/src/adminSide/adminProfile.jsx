import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './adminNavbar'; // Import the NavBar component
import Sidebar from './adminSidebar';
import ProfileF from './functionProfile';



function Profile() {



  return (
  
    <>
    <NavBar />
  <div className="card1">
  <Sidebar />
          <div className="card3">

             <ProfileF />

            
    </div>
    
  </div>

  </>
    
    
  );

}

export default Profile;
