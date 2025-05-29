import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/ui/dashboard/ConfirmationModal";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useReadingStore } from "@/store/useReadingStore";
import MobileNavDropUp from "./sidebar/MobileNavDropUp";
import { useAuthStore } from "@/store/useAuthStore";
import Setup from "@/components/ui/dashboard/Setup";
import { supabase } from "@/libs/supabaseClient";
import { useEffect, useState } from "react";

const DashboardOverlay = () => {
  const {
    showNavModal,
    showLogoutModal,
    setShowLogoutModal,
    showDeleteReading,
    setShowDeleteReading,
    readingToDelete,
    showDeleteAccountModal,
    setShowDeleteAccountModal,
    showSetupModal,
    setShowSetupModal,
    signOutLoading,
  } = useDashboardStore();
  const { deleteReading, deleteReadingLoading } = useReadingStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSetup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const hasCompleted = user?.user_metadata?.hasCompletedSetup;

      if (!hasCompleted) {
        setShowSetupModal(true);
      } else {
        setShowSetupModal(false);
      }
    };

    checkSetup();
  }, []);

  const handleOnConfirm = async (navigate: (path: string) => void) => {
    try {
      await logout(navigate);
    } catch (error) {
      console.error("Signout failed", error);
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleDeleteReading = async () => {
    const success = await deleteReading(readingToDelete);

    if (success) {
      setShowDeleteReading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSetupModal && <Setup />}

        {showNavModal && <MobileNavDropUp />}

        {showLogoutModal && (
          <ConfirmationModal
            title="Confirm logout"
            message="Are you sure you want to log out? You will need to sign in again
              to access your account."
            confirmText="Confirm"
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={() => handleOnConfirm(navigate)}
            loading={signOutLoading}
          />
        )}

        {showDeleteReading && (
          <ConfirmationModal
            title="Delete this reading?"
            message="Are you sure you want to delete this reading? This action can’t be undone."
            confirmText="Delete"
            onCancel={() => setShowDeleteReading(false)}
            onConfirm={handleDeleteReading}
            loading={deleteReadingLoading}
          />
        )}

        {showDeleteAccountModal && (
          <ConfirmationModal
            title="Delete this Account?"
            message="Are you sure you want to delete this reading? This action can’t be undone."
            confirmText="Delete"
            onCancel={() => setShowDeleteAccountModal(false)}
            // onConfirm={handleDeleteReading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardOverlay;
