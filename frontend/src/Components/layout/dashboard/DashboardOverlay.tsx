import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/ui/dashboard/ConfirmationModal";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useReadingStore } from "@/store/useReadingStore";
import MobileNavDropUp from "./sidebar/MobileNavDropUp";
import { useAuthStore } from "@/store/useAuthStore";
import Setup from "@/components/ui/dashboard/Setup";

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
  } = useDashboardStore();
  const deleteReading = useReadingStore((state) => state.deleteReading);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleOnConfirm = (navigate: (path: string) => void) => {
    logout(navigate);
    setShowLogoutModal(false);
  };

  const handleDeleteReading = () => {
    deleteReading(readingToDelete);
    setShowDeleteReading(false);
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
          />
        )}

        {showDeleteReading && (
          <ConfirmationModal
            title="Delete this reading?"
            message="Are you sure you want to delete this reading? This action can’t be undone."
            confirmText="Delete"
            onCancel={() => setShowDeleteReading(false)}
            onConfirm={handleDeleteReading}
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
