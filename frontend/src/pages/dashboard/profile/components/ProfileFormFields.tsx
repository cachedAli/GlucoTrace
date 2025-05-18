import Button from "@/components/ui/common/Button";
import Form from "@/components/ui/common/Form";
import {
  profileGlucosePreferenceFields,
  profileUserInfoFields,
} from "@/libs/constants/dashboard";
import {
  profileGlucosePreferenceSchema,
  profileUserInfoSchema,
} from "@/libs/validations/dashboardSchema";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";
import ProfilePicture from "./ProfilePicture";
import dayjs from "dayjs";

type UserInfoData = {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
  diabetesType?: "Type 1" | "Type 2" | "Pre-diabetes";
  diagnosisDate?: Date | string;
};

type GlucosePreferenceData = {
  unit?: "mg/dL" | "mmol/L";
  targetMin?: number;
  targetMax?: number;
};
const ProfileFormFields = () => {
  const { user, setUser } = useUserStore();
  const unit = user?.medicalProfile?.bloodSugarUnit || "mg/dL";

  const handleUserInfoSubmit = (data: UserInfoData) => {
    if (!user || !user.id) return;
    const { firstName, lastName, age, gender, diabetesType, diagnosisDate } =
      data;

    console.log(data);
    const isEmpty = (val: any) =>
      val === undefined || val === "" || val === null;

    const updatedUser = {
      ...user,
      firstName: isEmpty(firstName) ? user.firstName : (firstName as string),
      lastName: isEmpty(lastName) ? user.lastName : (lastName as string),
      medicalProfile: {
        ...user.medicalProfile,
        diabetesType: isEmpty(diabetesType)
          ? user?.medicalProfile?.diabetesType
          : diabetesType,
        age: isEmpty(age) ? user?.medicalProfile?.age : age,
        bloodSugarUnit: unit,
        gender: isEmpty(gender) ? user?.medicalProfile?.gender : gender,
        diagnosisDate: isEmpty(diagnosisDate)
          ? user?.medicalProfile?.diagnosisDate
          : dayjs(diagnosisDate).toISOString(),
      },
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log(user);
  };

  const handleGlucosePreferenceSubmit = (data: GlucosePreferenceData) => {
    if (!user || !user?.id) return;
    const { unit, targetMin, targetMax } = data;

    const updatedUser = {
      ...user,
      medicalProfile: {
        ...user?.medicalProfile,
        bloodSugarUnit: unit ?? user?.medicalProfile?.bloodSugarUnit,
        targetBloodSugarRange: {
          min:
            targetMin !== undefined
              ? targetMin
              : user.medicalProfile?.targetBloodSugarRange?.min ??
                user?.medicalProfile?.bloodSugarUnit === "mg/dL"
              ? 70
              : 3.9,
          max:
            targetMax !== undefined
              ? targetMax
              : user.medicalProfile?.targetBloodSugarRange?.max ??
                user?.medicalProfile?.bloodSugarUnit === "mg/dL"
              ? 180
              : 10,
        },
      },
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log(data);
  };
  return (
    <>
      <ProfilePicture />
      <h2
        className={clsx(
          "text-headingSub mt-2 text-xl font-semibold",
          "dark:text-headingSub-dark"
        )}
      >
        User Information
      </h2>
      <Form
        fields={profileUserInfoFields}
        schema={profileUserInfoSchema}
        buttonLabel="Confirm"
        onSubmit={handleUserInfoSubmit}
        googleAuth={false}
        buttonClassName="w-96 max-sm:w-full"
        buttonAlignment="end"
      />
      <h2
        className={clsx(
          "text-headingSub mt-2 text-xl font-semibold",
          "dark:text-headingSub-dark"
        )}
      >
        Glucose Preferences
      </h2>
      <Form
        fields={profileGlucosePreferenceFields}
        schema={profileGlucosePreferenceSchema(unit)}
        buttonLabel="Confirm"
        onSubmit={handleGlucosePreferenceSubmit}
        googleAuth={false}
        buttonClassName="w-96 max-sm:w-full"
        buttonAlignment="end"
      />
    </>
  );
};

export default ProfileFormFields;
