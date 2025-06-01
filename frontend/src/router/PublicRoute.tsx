import React from "react";
import { Navigate } from "react-router-dom";

import { useDashboardStore } from "@/store/useDashboardStore";
import SphereLoader from "@/components_temp/ui/loader/SphereLoader";
import { useUserStore } from "@/store/useUserStore";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const loading = useDashboardStore((state) => state.loading);

  const user = useUserStore((state) => state.user);

  if (loading) return <SphereLoader />;

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
