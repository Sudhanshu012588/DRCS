import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroPage } from './pages/HeroPage';
import { PlannerPage } from './pages/PlannerPage';
import { ProtectedRoute } from './components/ProtectedRoute';

import Auth from './pages/Auth_Service/Auth';
import Login from './pages/Auth_Service/Login';
import Signup from './pages/Auth_Service/Signup';
import AuthCallback from './pages/Auth_Service/AuthCallback';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroPage />} />

          {/* Protected Planner Routes */}
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <PlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner/:userId"
            element={
              <ProtectedRoute>
                <PlannerPage />
              </ProtectedRoute>
            }
          />

          {/* Authentication Routes */}
          <Route path="/Auth" element={<Auth />} />
          <Route path="/Auth/Login" element={<Login />} />
          <Route path="/Auth/Signup" element={<Signup />} />
          <Route path="/Auth/Callback" element={<AuthCallback />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}