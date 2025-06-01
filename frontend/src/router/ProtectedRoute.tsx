import { Navigate, Outlet } from "react-router-dom";

import { useDashboardStore } from "@/store/useDashboardStore";
import SphereLoader from "@/components/ui/loader/SphereLoader";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/libs/supabaseClient";

const ProtectedRoute = () => {
  const loading = useDashboardStore((state) => state.loading);
  const user = useUserStore((state) => state.user);

  supabase.auth.onAuthStateChange((e, session) => {
    if (session?.user && !session.user?.user_metadata?.otpVerified) {
      <Navigate to="/verify-email" replace />;
    }
  });

  if (loading) return <SphereLoader />;

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
