import { CustomSwitch } from "@/components_temp/ui/dashboard/CustomSwitch";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import Button from "@/components_temp/ui/common/Button";
import { SunMoon, Trash2 } from "lucide-react";

const SettingsActionButtons = () => {
  const { setShowDeleteAccountModal, darkModeLoading } = useDashboardStore();
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col gap-10 p-6">
      {/* Dark Mode Section */}
      <div className="rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 bg-gray-100 p-6 shadow-inner">
        <div className="flex items-center gap-4 mb-4">
          <SunMoon className="text-gray-800 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-headingSub dark:text-headingSub-dark">
            Appearance
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-800 dark:text-gray-400 max-w-md mt-1">
              Prefer a softer look? Simply toggle on Dark Mode to switch to a
              low-light theme that's easier on the eyes — especially during
              nighttime tracking or low-light environments. Your settings are
              saved instantly and will stay in place across sessions.
            </p>
          </div>
          <CustomSwitch
            checked={user?.darkMode || false}
            onChange={() => toggleDarkMode()}
            disabled={darkModeLoading}
          />
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-100 dark:bg-[#1a0000] p-6 shadow-inner">
        <div className="flex items-center gap-4 mb-4">
          <Trash2 className="text-red-600 dark:text-red-500" />
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-500">
            Delete Account
          </h2>
        </div>
        <p className="text-sm text-red-700 dark:text-red-200 max-w-md mb-4">
          ...you'll find the Delete Account option right here. Deleting your
          account is permanent and will erase all your stored glucose data.
          We'll ask you to confirm before anything happens — because your data
          and your trust matter to us.
        </p>
        <Button
          variant="fill"
          className="w-60 bg-red-600 hover:bg-red-700 transition-colors duration-200"
          onClick={() => setShowDeleteAccountModal(true)}
        >
          Delete My Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsActionButtons;
