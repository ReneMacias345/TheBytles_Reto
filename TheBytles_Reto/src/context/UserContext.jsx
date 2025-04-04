import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    console.log("Session userId:", userId);

    if (!userId) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("User")
      .select("*") 
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user info:", error);
    } else {
      console.log("User fetched:", data);
      setUserData(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser(); //load inicial

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth changed:", _event, session);
      fetchUser(); // cambio de estado 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);