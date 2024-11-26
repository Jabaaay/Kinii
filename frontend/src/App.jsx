import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';
import VerifyCode from './session/verifyCode';
import ForgotPassword from './session/forgotPassword';
import ChangePassword from './session/changePassword';

function App() {
  return (
    <Router>
      <UserRoutes />
      <AdminRoutes />
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
