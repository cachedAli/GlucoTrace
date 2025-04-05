import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { Switch } from "@mui/material";

const Settings = () => {
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const user = useUserStore((state) => state.user);
  return (
    <div>
      <PageTitle
        title="Settings"
        subTitle="Customize your app experience and manage preferences."
      />

      <Switch
        checked={user?.darkMode || false}
        onChange={(e) => toggleDarkMode()}
      />
    </div>
  );
};

export default Settings;
