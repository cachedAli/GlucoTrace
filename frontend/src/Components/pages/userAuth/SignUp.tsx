import { useNavigate } from "react-router-dom";

import { signUpFields } from "@/components/utils/constants/authPage/formFields";
import { signUpSchema } from "@/components/utils/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import Form from "@/components/ui/Form";

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
      <Form
        fields={signUpFields}
        onSubmit={onSubmit}
        schema={signUpSchema}
        buttonLabel="Sign up"
      />
    </AuthLayout>
  );
};

export default SignUp;
