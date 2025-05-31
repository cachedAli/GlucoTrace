import clsx from "clsx";

import { capitalizeFirstLetter } from "@/libs/utils/utils.js";
import { useUserStore } from "@/store/useUserStore.js";

type PageTitleProps = {
  title?: string;
  subTitle?: string;
  isDashboard?: boolean;
};

const PageTitle = ({
  title,
  subTitle,
  isDashboard = false,
}: PageTitleProps) => {
  const user = useUserStore((state) => state.user);
  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div className={clsx("flex items-center font-montserrat")}>
      {isDashboard ? (
        <div className={clsx("flex flex-col gap-2")}>
          <h1
            className={clsx(
              "text-headingMain font-bold text-3xl",
              "max-lg:text-2xl",
              "max-sm:text-xl",
              "dark:text-headingMain-dark"
            )}
          >
            {user?.hasCompletedSetup
              ? `Welcome back, ${capitalizeFirstLetter(fullName)}`
              : `Welcome, ${capitalizeFirstLetter(fullName)} `}
          </h1>

          <h2
            className={clsx(
              "text-lg text-headingSub font-medium font-inter",
              "max-lg:text-base",
              "max-sm:text-sm",
              "dark:text-headingSub-dark"
            )}
          >
            {user?.hasCompletedSetup
              ? "Review your latest readings and plan your next steps."
              : "Congrats on setting up GlucoTrace! Let’s start tracking your progress."}
          </h2>
        </div>
      ) : (
        <div
          className={clsx(
            "flex flex-col gap-2 items-start justify-center",
            "max-sm:gap-1"
          )}
        >
          <h1
            className={clsx(
              "text-headingMain font-bold text-2xl",
              "max-lg:text-xl",
              "max-sm:text-lg",
              "dark:text-headingMain-dark"
            )}
          >
            {title}
          </h1>

          <h2
            className={clsx(
              "text-headingSub font-medium font-inter",
              "max-lg:text-sm",
              "max-sm:text-xs",
              "dark:text-headingSub-dark"
            )}
          >
            {subTitle}
          </h2>
        </div>
      )}
    </div>
  );
};

export default PageTitle;
