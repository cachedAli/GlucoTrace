import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
import { CustomSwitch } from "@/components/ui/dashboard/CustomSwitch";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { Switch } from "@mui/material";
import SettingsActionButtons from "./components/SettingsActionButtons";

const Settings = () => {

  return (
    <>
      <PageTitle
        title="Settings"
        subTitle="Customize your app experience and manage preferences."
      />


     <SettingsActionButtons/>
    </>
  );
};

export default Settings;
