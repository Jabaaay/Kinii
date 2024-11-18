import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AdminRoutes from './routes/adminRoutes';
import UserRoutes from './routes/userRoutes';



function App() {
  return (
    <Router>
      <UserRoutes />
      <AdminRoutes />
    </Router>
  );
}

export default App;
