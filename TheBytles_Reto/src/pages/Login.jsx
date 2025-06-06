import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { AuthCard } from '../layouts/AuthCard'; 
import { Button } from '../components/Button';
import { SignUpButton } from '../components/SignUpButton';
import '../styles/custom.css';
import supabase from '../config/supabaseClient';

// Componente principal para la pantalla de inicio de sesión
export const Login = () => {
  // Estados para email y contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook para navegación entre rutas
  const navigate = useNavigate();

  // Estado para manejar errores del formulario
  const [formError, setFormError] = useState(null);

  // Función para iniciar sesión con Supabase
  const signInWithEmail = async (e) => {
    e.preventDefault(); // Evita recarga del formulario

    // Autenticación con email y contraseña
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // Si no hay error: limpiar recordatorio, navegar al perfil
      alert("Logged in succesfully!");
      sessionStorage.removeItem('certReminderDismissed');
      navigate("/perfil");
      return;
    } else if (error.message === "Email not confirmed") {
      // Si el correo no está confirmado
      console.error("Login error:", error.message);
      setFormError("Please check your inbox: You must authenticate before logging in.");
      return;
    } else if (error.message === "Invalid login credentials") {
      // Si las credenciales son inválidas
      console.error("Login error:", error.message);
      setFormError("Invalid email or password.");
      return;
    }

    // Otros errores pueden ser manejados aquí si se requiere
  };

  // Navega a la pantalla de registro
  const onSignUp = () => {
    navigate('/signup');
  };

  // Renderiza la interfaz de login
  return (
    <Layout>
      <AuthCard title="Log In to PathExplorer">
        {/* Formulario de login */}
        <form className="space-y-5" onSubmit={signInWithEmail}>
          <div>
            <label className="block text-left mb-2 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 text-base text-gray-700 placeholder-gray-400
                         bg-gray-100 border border-gray-200 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-left mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-5 py-3 text-base text-gray-700 placeholder-gray-400
                         bg-gray-100 border border-gray-200 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón de login */}
          <Button type="submit" className="w-full mt-4">
            Log In
          </Button>

          {/* Mensaje de error si ocurre */}
          {formError && (
            <p className='text-center text-red-500 text-lg font-bold mt-4'>{formError}</p>
          )}
        </form>

        {/* Enlace para registrarse */}
        <p className="mt-5 text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <SignUpButton onClick={onSignUp}>Sign up</SignUpButton>
        </p>
      </AuthCard>
    </Layout>
  );
};
