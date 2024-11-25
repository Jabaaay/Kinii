import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';
import VerifyCode from './session/verifyCode';
import ResetPassword from './session/resetPassword';
import ForgotPassword from './session/forgotPassword';



function App() {
  return (
    <Router>
      <UserRoutes />
      <AdminRoutes />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
