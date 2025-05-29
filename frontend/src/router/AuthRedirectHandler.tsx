// src/pages/AuthRedirectHandler.jsx

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SphereLoader from "@/components/ui/loader/SphereLoader";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { supabase } from "@/libs/supabaseClient";

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const setGoogleLoading = useAuthStore((state) => state.setGoogleLoading);

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

      if (!meta.custom_avatar_url && meta?.avatar_url) {
        const { error: customImageError } = await supabase.auth.updateUser({
          data: { custom_avatar_url: meta?.avatar_url },
        });

        if (customImageError) {
          console.error(
            "Failed to update otpVerified:",
            customImageError.message
          );
          toast.error(customImageError.message);
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
        darkMode: user?.user_metadata?.darkMode,
        profilePic: meta?.custom_avatar_url || meta?.avatar_url,
        medicalProfile: {
          bloodSugarUnit: meta?.medicalProfile?.bloodSugarUnit ?? "",
          age: meta?.medicalProfile?.age ?? "",
          diabetesType: meta?.medicalProfile?.diabetesType ?? "",
          diagnosisDate: meta?.medicalProfile?.diagnosisDate ?? "",
          gender: meta?.medicalProfile?.gender ?? "",
          targetBloodSugarRange:
            meta?.medicalProfile?.targetBloodSugarRange ?? "",
        },
      };

      useUserStore.getState().setUser(newUser);

      if (!meta.hasWelcomed) {
        toast.success(`Welcome, ${firstName} ${lastName}!`);

        const { error: welcomeUpdateError } = await supabase.auth.updateUser({
          data: { hasWelcomed: true },
        });

        if (welcomeUpdateError) {
          console.error(
            "Failed to update hasWelcomed:",
            welcomeUpdateError.message
          );
        }
      } else if (meta?.hasWelcomed) {
        toast.success(`Welcome back, ${firstName} ${lastName}!`);
      }

      if (!meta.hasCompletedSetup) {
        useDashboardStore.getState().setShowSetupModal(true);
      } else {
        useDashboardStore.getState().setShowSetupModal(false);
      }

      setGoogleLoading(false);
      navigate("/dashboard");
    };

    getUser();
  }, [navigate]);

  return <SphereLoader />;
};

export default AuthRedirectHandler;
