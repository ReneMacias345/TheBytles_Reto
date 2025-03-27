
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Perfil } from './pages/Perfil';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/perfil" element={<Perfil/>} />
    </Routes>
  );
};
