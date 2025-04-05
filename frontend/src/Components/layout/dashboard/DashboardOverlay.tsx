import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/ui/dashboard/ConfirmationModal";
import { useDashboardStore } from "@/store/useDashboardStore";
import MobileNavDropUp from "./sidebar/MobileNavDropUp";
import { useAuthStore } from "@/store/useAuthStore";

const DashboardOverlay = () => {
  const { showNavModal, showLogoutModal, setShowLogoutModal } =
    useDashboardStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleOnConfirm = (navigate: (path: string) => void) => {
    logout(navigate);
    setShowLogoutModal(false);
  };

  return (
    <>
      <AnimatePresence>
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
      </AnimatePresence>
    </>
  );
};

export default DashboardOverlay;
