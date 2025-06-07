import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

// Se crea el contexto para compartir datos de usuario en toda la app
export const UserContext = createContext();

// Componente proveedor que envuelve la app y proporciona el contexto del usuario
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Datos del usuario desde la tabla "User"
  const [loading, setLoading] = useState(true);   // Estado de carga mientras se obtiene info
  const [session, setSession] = useState(null);   // Sesión de autenticación actual

  useEffect(() => {
    // Función que obtiene la sesión actual al cargar el componente
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUser(session.user.id); // Si hay usuario, se buscan sus datos en la tabla User
      } else {
        setUserData(null);
        setLoading(false);
      }
    };

    getSession();

    // Listener para cambios de sesión (login, logout, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth changed:", _event, session);
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id); // Al cambiar sesión, se cargan los nuevos datos
      } else {
        setUserData(null);
      }
    });

    // Limpieza del listener al desmontar el componente
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Función que obtiene los datos del usuario desde la tabla "User"
  const fetchUser = async (userId) => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user info:", error);
    } else {
      setUserData(data); // Se guardan los datos obtenidos
    }

    setLoading(false);
  };

  // Se pasa el contexto con datos de usuario, sesión y estado de carga
  return (
    <UserContext.Provider value={{ userData, loading, session }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto del usuario
export const useUser = () => useContext(UserContext);
