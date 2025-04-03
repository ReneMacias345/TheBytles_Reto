import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Perfil } from './pages/Perfil';
import { Projects } from './pages/Projects';
import { Employees } from './pages/Employees';
import { Clients } from './pages/Clients';
import { Assignments } from './pages/Assignments';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/perfil" element={<Perfil/>} />
      <Route path="/projects" element={<Projects/>} />
      <Route path="/employees" element ={<Employees/>} />
      <Route path="/clients" element ={<Clients/>} />
      <Route path="/assignments" element ={<Assignments/>} />
      
    </Routes>
  );
};
