import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  return <HeroSection onStartDrawing={() => navigate('/planner')} />;
};