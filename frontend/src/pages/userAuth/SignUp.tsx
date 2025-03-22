import { useNavigate } from "react-router-dom";

import { signUpFields } from "@/libs/constants/authPage/formFields";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { signUpSchema } from "@/libs/validations/authSchema";
import { useUserState } from "@/store/useUserStore";
import { SignUpData } from "@/types/authTypes";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

const SignUp = () => {
  const navigate = useNavigate();
  const { user, signup } = useUserState();
  console.log("First render", user);
  const onSubmit = (data: SignUpData) => {
    console.log("Form Data:", data);
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
