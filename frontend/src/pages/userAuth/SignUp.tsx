import { useNavigate } from "react-router-dom";

import { signUpFields } from "@/libs/constants/authPage/formFields";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { signUpSchema } from "@/libs/validations/authSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { SignUpData } from "@/types/authTypes";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  // const user = useUserStore((state)=>state.user);
  const {signup,signUpLoading} = useAuthStore();

  const onSubmit = async (data: SignUpData) => {
    try {
      const user = await signup(data);
      if (user !== null && "success" in user && user?.success) {
        navigate("/verify-email");
      } else if (!user) {
        toast.error("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred.");
    }
    console.log("Submitted signup data:", data);
  };

  return (
    <AuthLayout
      isSignIn={false}
      currentPage={"Sign Up"}
      formTitle="Create new account"
    >
      <LazyLoader
        fallback={() => (
          <FormSkeleton fields={signUpFields} divider transparentButton />
        )}
      >
        <Form
          fields={signUpFields}
          onSubmit={onSubmit}
          schema={signUpSchema}
          buttonLabel="Sign up"
          loading={signUpLoading}
        />
      </LazyLoader>
    </AuthLayout>
  );
};

export default SignUp;
