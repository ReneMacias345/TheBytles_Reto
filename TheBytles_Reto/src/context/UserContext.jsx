import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null); 

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        await fetchUser(session.user.id);
      } else {
        setUserData(null);
        setLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth changed:", _event, session);
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUserData(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId) => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("userId", userId)
      .single();

    if (error) {
      console.error("Failed to fetch user info:", error);
    } else {
      setUserData(data);
    }

    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ userData, loading, session }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);