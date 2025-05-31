import React from "react";
import { Navigate } from "react-router-dom";

import { useDashboardStore } from "@/store/useDashboardStore.js";
import SphereLoader from "@/components/ui/loader/SphereLoader";
import { useUserStore } from "@/store/useUserStore.js";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const loading = useDashboardStore((state) => state.loading);

  const user = useUserStore((state) => state.user);

  if (loading) return <SphereLoader />;

  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
