import clsx from "clsx";

import { capitalizeFirstLetter } from "@/libs/utils";
import { useUserState } from "@/store/useUserStore";

const UserProfile = () => {
  const user = useUserState((state) => state.user);

  return (
    <div className={clsx("flex items-center gap-2 font-montserrat")}>
      <img
        src={user?.profilePic || "/default-avatar.png"}
        alt="User Profile"
        className="size-10 rounded-full object-cover"
      />

      <div className="flex flex-col">
        <h2 className="text-sm text-zinc-800 font-semibold">
          {capitalizeFirstLetter(user?.firstName || "")}{" "}
          {capitalizeFirstLetter(user?.lastName || "")}
        </h2>

        <h3 className="text-xs text-gray-500">
          {user?.medicalProfile?.diabetesType
            ? `${user?.medicalProfile?.diabetesType} Diabetic`
            : "Not Specified"}
        </h3>
      </div>
    </div>
  );
};

export default UserProfile;
