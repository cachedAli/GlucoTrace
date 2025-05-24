// src/pages/AuthRedirectHandler.jsx

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SphereLoader from "@/components/ui/loader/SphereLoader";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/libs/supabaseClient";

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const setGoogleLoading = useDashboardStore((state) => state.setGoogleLoading);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        toast.error("Authentication failed");
        navigate("/signin");
        return;
      }
      const user = data.user;
      const meta = user.user_metadata || {};

      if (!meta.otpVerified) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { otpVerified: true },
        });

        if (updateError) {
          console.error("Failed to update otpVerified:", updateError.message);
          toast.error(updateError.message);
        }
      }
      
      const fullName = meta.full_name || "";
      const [firstName, ...lastParts] = fullName.split(" ");
      const lastName = lastParts.join(" ");

      const newUser = {
        id: user.id,
        createdAt: user?.created_at || new Date(),
        email: user.email ?? "",
        firstName,
        lastName,
        darkMode: false,
        profilePic: meta?.avatar_url,
        medicalProfile: undefined,
      };

      useUserStore.getState().setUser(newUser);

      if (!meta.hasCompletedSetup) {
        useDashboardStore.getState().setShowSetupModal(true);
      }

      setGoogleLoading(false);
      toast.success(`Welcome back, ${newUser.firstName} ${newUser.lastName}`);
      navigate("/dashboard");
    };

    getUser();
  }, [navigate]);

  return <SphereLoader />;
};

export default AuthRedirectHandler;
