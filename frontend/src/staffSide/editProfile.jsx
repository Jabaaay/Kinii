import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import EditProfileF from './functionEditProfile';



function Profile() {


  return (
  
    <>
    <NavBar />
  <div className="card1">
  <Sidebar />
          <div className="card3">

            <EditProfileF />

        </div>
    </div>
  </>
    
    
  );

}

export default Profile;
