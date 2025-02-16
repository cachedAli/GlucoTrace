import Header from "../Header";
import Footer from "../Footer";
import { motion } from "framer-motion";

type authProps = {
  children: React.ReactNode;
  isSignIn?: boolean;
  currentPage: string;
  formTitle: string;
  formDescription?: string;
};

const AuthLayout = ({
  children,
  isSignIn,
  currentPage,
  formTitle,
  formDescription
}: authProps) => {
  return (
    <>
      <Header authPage={true} isSignInPage={isSignIn} />
      <div className="relative min-h-screen h-full overflow-hidden mb-2 mx-3 rounded-2xl flex flex-col items-center justify-center gap-16 px-4 pt-28 pb-52">
        {/* Background Container */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a237e] to-[#283593]">
          <div className="absolute inset-0 bg-[url('/authbg.png')] bg-bottom bg-no-repeat opacity-40 mix-blend-overlay bg-cover"></div>
        </div>

        {/* Foreground Content */}
        <h1 className="text-white text-5xl font-bold font-lora z-10">
          {currentPage}
        </h1>

        {/* Animated Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-slate-50 w-[600px] py-12 px-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center z-10"
        >
          <AuthFormHeader formDescription={formDescription} formTitle={formTitle}/>

          {children}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default AuthLayout;


const AuthFormHeader =({formTitle,formDescription}:any)=>{
  return(
<div className="flex flex-col gap-2 mb-6 items-center justify-center w-96">
            <h1 className="text-zinc-800 text-2xl font-lora tracking-wide ">
              {formTitle}
            </h1>
           {formDescription && <p className="text-gray-400 text-base text-center font-roboto">
              Enter your email address and we'll send you a link to reset your
              password
            </p>}
          </div>
  )
}