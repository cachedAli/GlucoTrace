import clsx from "clsx";

import { capitalizeFirstLetter } from "@/libs/utils";
import { useUserState } from "@/store/useUserStore";

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
  const user = useUserState((state) => state.user);
  return (
    <div className={clsx("flex items-center font-montserrat")}>
      {isDashboard ? (
        <div className={clsx("flex flex-col gap-2")}>
          <h1
            className={clsx(
              "text-headingMain font-bold text-3xl",
              "max-lg:text-2xl",
              "max-sm:text-xl"
            )}
          >
            Welcome Back, {capitalizeFirstLetter(user?.firstName || "")}{" "}
            {capitalizeFirstLetter(user?.lastName || "")}
          </h1>

          <h2
            className={clsx("text-lg", "max-lg:text-base", "max-sm:text-sm")}
          ></h2>
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
              "max-sm:text-lg"
            )}
          >
            {title}
          </h1>

          <h2
            className={clsx(
              "text-headingSub font-medium",
              "max-lg:text-sm",
              "max-sm:text-xs"
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
