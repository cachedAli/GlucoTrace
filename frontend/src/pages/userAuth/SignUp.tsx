import { useNavigate } from "react-router-dom";

import { signUpFields } from "@/libs/constants/authPage/formFields";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { signUpSchema } from "@/libs/validations/authSchema";
import { useUserStore } from "@/store/useUserStore";
import { SignUpData } from "@/types/authTypes";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";
import { useAuthStore } from "@/store/useAuthStore";

const SignUp = () => {
  const navigate = useNavigate();
  const user = useUserStore();
  const signup = useAuthStore().signup;

  const onSubmit = (data: SignUpData) => {
    signup(data);
    console.log(user);
    navigate("/verify-email");
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
        />
      </LazyLoader>
    </AuthLayout>
  );
};

export default SignUp;
