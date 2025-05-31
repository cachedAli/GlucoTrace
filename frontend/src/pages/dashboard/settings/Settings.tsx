import PageTitle from "@/components/layout/dashboard/mainContent/PageTitle";
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
