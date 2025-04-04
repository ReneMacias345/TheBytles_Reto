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

export const App = () => {
  return (

        <Routes>
        // rutas publicas (acessibles a cualquiera)
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        // rutas privadas (solo logeados)
        <Route path="/perfil" element={<PrivateRoute> <Perfil /> </PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute> <Projects /> </PrivateRoute>} />
        <Route path="/employees" element={<PrivateRoute> <Employees /> </PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute> <Clients /> </PrivateRoute>} />
        <Route path="/assignments" element={<PrivateRoute> <Assignments /> </PrivateRoute>} />

        <Route path="*" element={<Login />} /> // redireccion al login
      </Routes>

  );
};
