import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const SUPER_ADMIN_EMAIL = 'owner@ordio.id';

export default function SuperAdminProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthorized(session?.user?.email === SUPER_ADMIN_EMAIL);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthorized(session?.user?.email === SUPER_ADMIN_EMAIL);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-bold text-slate-400">
        Memverifikasi Akses Super Admin...
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <Outlet />;
}