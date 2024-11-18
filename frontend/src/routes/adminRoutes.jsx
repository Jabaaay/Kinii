import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from "../adminSide/adminDashboard";
import StudentApp from "../adminSide/studentApp";
import AddStaff from "../adminSide/staff";
import Post from "../adminSide/postAnnoucement";
import Report from "../adminSide/reportGen";
import Panel from "../adminSide/adminPanel";
import AdminProfile from "../adminSide/adminProfile";
import AdminEditProfile from "../adminSide/editProfile";
import Notifications from "../adminSide/notification";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/adminPanel" element={<Panel />} /> 
      <Route path="/editProfile" element={<AdminEditProfile />} />
      <Route path="/adminDashboard" element={<AdminPanel />} /> 
      <Route path="/adminProfile" element={<AdminProfile />} /> 
      <Route path="/studentApp" element={<StudentApp />} /> 
      <Route path="/postAnnouncements" element={<Post />} />
      <Route path="/reportGen" element={<Report />} />
      <Route path="/addStaff" element={<AddStaff />} /> 
      <Route path="/notification" element={<Notifications />} /> 
    </Routes>
  );
};

export default AdminRoutes;
