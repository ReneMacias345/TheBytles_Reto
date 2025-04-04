import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../config/supabaseClient';

export const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("User")
        .select("clearanceLevel")
        .eq("userId", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching clearance level:", error);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(data.clearanceLevel === 2); // 2 = Admin
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <Navigate to="/unauthorized" replace />;
  return children;
};