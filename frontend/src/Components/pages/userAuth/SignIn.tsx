import React from "react";

import { signInFields } from "@/components/utils/constants/authPage/formFields";
import { SignInSchema } from "@/components/utils/validations/authSchema";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import Form from "@/components/ui/Form";

type Data = {
  email: string;
  password: string;
};

const SignIn = () => {
  const onSubmit = (data: Data) => {
    console.log("Form Data:", data);
  };
  return (
    <AuthLayout
      isSignIn={true}
      currentPage={"Sign In"}
      formTitle="Sign in to your account"
    >
      <Form
        fields={signInFields}
        onSubmit={onSubmit}
        schema={SignInSchema}
        buttonLabel="Sign in"
      />
    </AuthLayout>
  );
};

export default SignIn;
