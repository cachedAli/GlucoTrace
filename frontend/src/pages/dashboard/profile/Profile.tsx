import PageTitle from "@/components_temp/layout/dashboard/mainContent/PageTitle";
import ProfileFormFields from "./components/ProfileFormFields";

const Profile = () => {
  return (
    <>
      <PageTitle
        title="Your Profile"
        subTitle="Manage your personal and health information."
      />
      <ProfileFormFields />
    </>
  );
};

export default Profile;
