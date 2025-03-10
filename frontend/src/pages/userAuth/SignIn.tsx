import React from "react";

import { signInFields } from "@/libs/constants/authPage/formFields";
import { SignInSchema } from "@/libs/validations/authSchema";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

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
      <LazyLoader
        fallback={() => (
          <FormSkeleton fields={signInFields} divider transparentButton />
        )}
      >
        <Form
          fields={signInFields}
          onSubmit={onSubmit}
          schema={SignInSchema}
          buttonLabel="Sign in"
        />
      </LazyLoader>
    </AuthLayout>
  );
};

export default SignIn;
