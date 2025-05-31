import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ConfirmationModal from "@/components/ui/dashboard/ConfirmationModal";
import { useDashboardStore } from "@/store/useDashboardStore.js";
import { useReadingStore } from "@/store/useReadingStore.js";
import MobileNavDropUp from "./sidebar/MobileNavDropUp";
import { useAuthStore } from "@/store/useAuthStore.js";
import Setup from "@/components/ui/dashboard/Setup";
import { supabase } from "@/libs/supabaseClient.js";
import { useEffect } from "react";
import { shareReportFields } from "@/libs/constants/dashboard";
import { shareReportSchema } from "@/libs/validations/dashboardSchema.js";
import { ShareReport } from "@/types/dashboardTypes.js";
import { useUserStore } from "@/store/useUserStore.js";
import {
  filterReadingsByDate,
  generateReportData,
  getDateRange,
} from "@/libs/utils/reportUtils.js";
import GlucoseReportPDF from "@/pages/dashboard/report/components/GenerateReportPdf";
import { capitalizeFirstLetter } from "@/libs/utils/utils.js";
import { pdf } from "@react-pdf/renderer";
import { useThemeStore } from "@/store/useThemeStore.js";

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
    showShareReportModal,
    setShowShareReportModal,
    shareReportWithEmail,
    shareReportLoading,
    timeRange,
    startDate,
    endDate,
    deleteAccount,
    deleteAccountLoading,
  } = useDashboardStore();
  const { deleteReading, deleteReadingLoading, readings } = useReadingStore();
  const logout = useAuthStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";
  const targetRange = user?.medicalProfile?.targetBloodSugarRange;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const fullName = `${firstName} ${lastName}`;

  const dateRange = getDateRange(
    timeRange,
    startDate ? startDate.toDate() : undefined,
    endDate ? endDate.toDate() : undefined
  );

  // Filter readings
  const filteredReadings = filterReadingsByDate(
    readings,
    dateRange.start,
    dateRange.end
  );

  // Generate report data
  const reportData = generateReportData(
    filteredReadings,
    dateRange.label,
    unit,
    targetRange,
    capitalizeFirstLetter(fullName),
    user?.medicalProfile?.diabetesType || "Type 2",
    user?.medicalProfile?.gender || "Other",
    user?.medicalProfile?.age?.toString() || "--",
    user?.medicalProfile?.diagnosisDate || "--"
  );

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

  const generatePdfBlob = async (): Promise<any> => {
    const blob = await pdf(<GlucoseReportPDF data={reportData} />).toBlob();
    return blob;
  };

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

  const handleShareReportByEmail = async (data: ShareReport) => {
    const { email, emailMessage } = data;
    const name = capitalizeFirstLetter(fullName);
    const blob = await generatePdfBlob();
    const file = new File([blob], "glucose_report.pdf", {
      type: "application/pdf",
    });
    try {
      const success = await shareReportWithEmail({
        email,
        file,
        fullName: name,
        emailMessage,
      });
      if (success) {
        setShowShareReportModal(false);
        return;
      }
      return;
    } catch (error) {
      console.log("handleShareReport error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const success = await deleteAccount();
      if (success) {
        useThemeStore.getState().resetTheme();
        useUserStore.getState().setUser(null);
        setShowDeleteAccountModal(false);
        navigate("/signin");
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return;
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

        {showShareReportModal && (
          <ConfirmationModal
            title="Share this report"
            message="Enter their email address to send the report. You can also write a message to include in the email."
            confirmText="Share"
            onCancel={() => setShowShareReportModal(false)}
            onConfirm={
              ((data?: any) => {
                if (data) {
                  handleShareReportByEmail(data);
                }
              }) as (() => void) & ((data: any) => Promise<any>)
            }
            loading={shareReportLoading}
            fields={shareReportFields}
            schema={shareReportSchema}
          />
        )}

        {showDeleteAccountModal && (
          <ConfirmationModal
            title="Delete this Account?"
            message="Are you sure you want to delete this reading? This action can’t be undone."
            confirmText="Delete"
            onCancel={() => setShowDeleteAccountModal(false)}
            onConfirm={handleDeleteAccount}
            loading={deleteAccountLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardOverlay;
