import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Perfil } from './pages/Perfil';
import { Projects } from './pages/Projects';
import { Employees } from './pages/Employees';
import { Clients } from './pages/Clients';
import { Assignments } from './pages/Assignments';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';

export const App = () => {
  return (
    <BrowserRouter>
        <Routes>
        // rutas publicas (acessibles a cualquiera)
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        // rutas privadas (cualquier persona logeada)
        <Route path="/perfil" element={<PrivateRoute> <Perfil /> </PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute> <Projects /> </PrivateRoute>} />

        // rutas privadas (solo para admins)
        <Route path="/employees" element={<AdminRoute> <Employees /> </AdminRoute>} />
        <Route path="/clients" element={<AdminRoute> <Clients /> </AdminRoute>} />
        <Route path="/assignments" element={<AdminRoute> <Assignments /> </AdminRoute>} />

        <Route path="*" element={<Login />} /> // redireccion al login cuando una pantalla no esta accesible
      </Routes>
    </BrowserRouter>
  );
};
