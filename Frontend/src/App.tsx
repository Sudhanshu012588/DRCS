import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroPage } from './pages/HeroPage';
import { PlannerPage } from './pages/PlannerPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}