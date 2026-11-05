import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroPage } from './pages/HeroPage';
import { PlannerPage } from './pages/PlannerPage';
import Auth  from './pages/Auth_Service/Auth.tsx';
import Signup from './pages/Auth_Service/Signup.tsx';
import AuthCallback from "./pages/Auth_Service/AuthCallback.tsx"
import Login from './pages/Auth_Service/Login.tsx';
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
    <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
    />
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/planner/:userId" element={<PlannerPage />} />
          <Route path='/Auth' element={<Auth/>}/>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path='/Auth/Signup' element={<Signup/>}/>
          <Route path="/Auth/Login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  );
}