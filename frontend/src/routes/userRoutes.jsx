import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../dashboard';  
import History from '../history';  
import Status from '../status';
import Profile from '../profile';
import Edit_Profile from '../edit_profile';
import Login from '../session/login';
import Page from '../landingPage';
import Admin from '../adminSession/adminLogin';
import Calendar from '../components/Calendar';
import SignUp from '../session/signUp';
import ForgotPass from '../session/forgotPassword';



const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path='/sign-up' element={<SignUp />}/>
      <Route path='/reset-password' element={<ForgotPass />}/>
      <Route path='/adminLogin' element={<Admin />}/>
      <Route path="/login" element={<Login />} /> 
      <Route path="/dashboard" element={<Dashboard />} />  
      <Route path="/history" element={<History />} />  
      <Route path="/status" element={<Status />} /> 
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/edit_profile" element={<Edit_Profile />} /> 
      <Route path="/calendar" element={<Calendar />} /> 
    </Routes>
  );
};

export default UserRoutes;
