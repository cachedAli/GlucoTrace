import { useNavigate } from "react-router-dom";

import { signUpFields } from "@/libs/constants/authPage/formFields";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import { signUpSchema } from "@/libs/validations/authSchema";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

type Data = {
  firstName: string;
  LastName: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = (data: Data) => {
    console.log("Form Data:", data);
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
