import React from "react";

import { useNavigate } from "react-router-dom";

import { signInFields } from "@/libs/constants/authPage/formFields";
import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import { SignInSchema } from "@/libs/validations/authSchema";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SignInData } from "@/types/authTypes";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";

const SignIn = () => {
  const navigate = useNavigate();
  const user = useUserStore();
  const signin = useAuthStore().signin;

  const onSubmit = (data: SignInData) => {
    console.log("Form Data:", data);
    signin(data);
    if (user) {
      navigate("/dashboard");
    }
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
