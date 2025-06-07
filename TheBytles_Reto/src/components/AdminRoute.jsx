import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

// Componente para proteger rutas que solo deben ser accesibles por administradores
export const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // Estado para verificar si el usuario es admin
  const [loading, setLoading] = useState(true); // Estado para controlar carga

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      // Obtener sesión actual desde Supabase
      const { data: { session } } = await supabase.auth.getSession();

      // Si no hay sesión, no está autorizado
      if (!session) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      // Obtener ID del usuario autenticado
      const userId = session.user.id;

      // Consultar nivel de autorización del usuario desde la tabla "User"
      const { data, error } = await supabase
        .from("User")
        .select("clearanceLevel")
        .eq("userId", userId)
        .single();

      // Si hay error o no se encontró al usuario, no autoriza
      if (error || !data) {
        console.error("Error fetching clearance level:", error);
        setIsAuthorized(false);
      } else {
        // Solo autoriza si el nivel de permiso es 2 (admin)
        setIsAuthorized(data.clearanceLevel === 2);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  // Mientras se verifica autorización, muestra "Loading..."
  if (loading) return <div>Loading...</div>;

  // Si no está autorizado, redirige a página de acceso no autorizado
  if (!isAuthorized) return <Navigate to="/unauthorized" replace />;

  // Si está autorizado, muestra los componentes hijos
  return children;
};
