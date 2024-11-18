import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './navbar'; // Import the NavBar component
import Sidebar from './sidebar';
import logo from './assets/1.png'
import ProfileF from './profile_functions';



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
