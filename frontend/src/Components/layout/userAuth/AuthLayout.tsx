import clsx from "clsx";
import { motion } from "framer-motion";

import Header from "../Header";
import Footer from "../Footer";

type authProps = {
  children: React.ReactNode;
  isSignIn?: boolean;
  currentPage?: string;
  formTitle?: string;
  formDescription?: string;
  resetPage?: boolean;
  className?: string;
};

const AuthLayout = ({
  children,
  isSignIn,
  currentPage,
  formTitle,
  formDescription,
  resetPage = false,
  className,
}: authProps) => {
  return (
    <>
      <Header authPage={true} resetPage={resetPage} isSignInPage={isSignIn} />
      <div
        className={clsx(
          "relative min-h-[150vh] overflow-hidden mb-2 mx-3 rounded-2xl flex flex-col items-center justify-center gap-10 px-4"
        )}
      >
        <AuthPageBackground />

        <h1
          className={clsx(
            "text-white text-5xl font-bold font-lora z-10",
            "max-lg:text-4xl",
            "max-sm:text-3xl"
          )}
        >
          {currentPage}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={clsx(
            "relative mx-auto bg-slate-50 w-[600px] py-12 px-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center z-10",
            "2xl:w-[700px]",
            "max-lg:w-[500px] max-lg:px-8",
            "max-sm:w-full max-sm:px-6",
            className
          )}
        >
          {formTitle && (
            <AuthFormHeader
              formDescription={formDescription}
              formTitle={formTitle}
            />
          )}

          {children}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default AuthLayout;

type AuthFormHeaderProps = {
  formTitle?: string;
  formDescription?: string;
};

const AuthFormHeader = ({
  formTitle,
  formDescription,
}: AuthFormHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 mb-6 items-center justify-center w-full max-w-xs text-center">
      <h1
        className={clsx(
          "text-zinc-800 text-2xl font-lora tracking-wide",
          "max-sm:text-xl"
        )}
      >
        {formTitle}
      </h1>
      {formDescription && (
        <p
          className={clsx(
            "text-gray-500 text-base text-center font-roboto",
            "max-sm:text-sm"
          )}
        >
          {formDescription}
        </p>
      )}
    </div>
  );
};

const AuthPageBackground = () => {
  return (
    <div
      className={clsx(
        "absolute h-full inset-0 bg-gradient-to-r from-[#1a237e] to-[#283593]",
        "max-sm:bg-gradient-to-b from-[#1a237e] to-[#283593]"
      )}
    >
      <div className="absolute inset-0 bg-[url('/userAuth/authPageBackground.webp')] bg-bottom bg-no-repeat opacity-40 mix-blend-overlay bg-cover"></div>
    </div>
  );
};
