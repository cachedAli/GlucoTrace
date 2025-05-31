import clsx from "clsx";
import React from "react";
import { motion } from "framer-motion";
import Form from "../common/Form";
import { setupFields } from "@/libs/constants/dashboard";
import { setupSchema } from "@/libs/validations/dashboardSchema.js";
import { useUserStore } from "@/store/useUserStore.js";
import { useDashboardStore } from "@/store/useDashboardStore.js";
import dayjs from "dayjs";


interface Data {
  age: number;
  gender: "Male" | "Female" | "Other";
  diabetesType: "Type 1" | "Type 2" | "Pre-diabetes";
  diagnosisDate: Date | string;
  unit: "mg/dL" | "mmol/L";
}
const Setup = () => {
  const { user, setUser } = useUserStore();
  const { setShowSetupModal, medicalProfile, medicalProfileLoading } =
    useDashboardStore();

  const handleSubmit = async (data: Data) => {
    if (!user || !user.id) return;

    const { age, gender, diabetesType, diagnosisDate, unit } = data;

    const updatedUser = {
      ...user,
      medicalProfile: {
        diabetesType,
        age,
        bloodSugarUnit: unit,
        gender,
        diagnosisDate: dayjs(diagnosisDate).toISOString(),
      },
    };

    const success = await medicalProfile({
      diabetesType,
      age,
      bloodSugarUnit: unit,
      gender,
      diagnosisDate: dayjs(diagnosisDate).toISOString(),
    });

    if (success) {
      setUser(updatedUser);
      setShowSetupModal(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.15, ease: "easeIn" },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={clsx(
          "bg-slate-50 z-50 w-[900px] px-6 py-6 max-sm:px-4 max-sm:py-4 gap-2 shadow-xl rounded-2xl flex flex-col items-start",
          "max-lg:w-[700px]",
          "max-md:w-[600px]",
          "max-sm:w-[350px]",
          "dark:bg-gray-800"
        )}
      >
        <h1 className="font-montserrat text-xl font-semibold dark:text-white">
          Let's personalize your experience
        </h1>
        <h2 className=" text-gray-600 dark:text-gray-200">
          Just a few quick questions to get you started.
        </h2>

        <Form
          fields={setupFields}
          schema={setupSchema}
          googleAuth={false}
          buttonLabel="Save and Continue"
          onSubmit={handleSubmit}
          loading={medicalProfileLoading}
        />
      </motion.div>
    </div>
  );
};

export default Setup;
