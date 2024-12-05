import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminPanel from "../staffSide/adminDashboard";
import StudentApp from "../staffSide/studentApp";
import Post from "../staffSide/postAnnoucement";
import Report from "../staffSide/reportGen";
import Panel from "../staffSide/adminPanel";
import AdminProfile from "../staffSide/adminProfile";
import AdminEditProfile from "../staffSide/editProfile";
import Notifications from "../staffSide/notification";

const StaffRoutes = () => {
  return (
    <Routes>
      <Route path="/adminPanel" element={<Panel />} /> 
      <Route path="/editProfile" element={<AdminEditProfile />} />
      <Route path="/staff-Dashboard" element={<AdminPanel />} /> 
      <Route path="/staff-Profile" element={<AdminProfile />} /> 
      <Route path="/staff-studentApp" element={<StudentApp />} /> 
      <Route path="/staff-postAnnouncements" element={<Post />} />
      <Route path="/staff-reportGen" element={<Report />} />
      <Route path="/staff-notification" element={<Notifications />} /> 
    </Routes>
  );
};

export default StaffRoutes;
