import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserState } from "@/store/useUserStore";
import { Switch } from "@mui/material";

const Settings = () => {
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const user = useUserState((state) => state.user);
  return (
    <div>
      <PageTitle
        title="Settings"
        subTitle="Customize your app experience and manage preferences."
      />

      <Switch checked={user?.darkMode} />
    </div>
  );
};

export default Settings;
