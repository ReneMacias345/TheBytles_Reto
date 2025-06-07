import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

// Componente de ruta protegida para usuarios autenticados
export const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    let mounted = true;

    // Verifica si hay sesión activa al montar el componente
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setIsAuthenticated(!!session); // true si hay sesión, false si no
        setLoading(false);
      }
    };

    checkSession();

    // Escucha cambios en la autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
        setLoading(false);
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Mientras verifica autenticación, muestra "Loading..."
  if (loading) return <div>Loading...</div>;

  // Si no está autenticado, redirige a la página de acceso no autorizado
  if (!isAuthenticated) return <Navigate to="/unauthorized" replace />;

  // Si está autenticado, muestra el contenido protegido
  return children;
};
