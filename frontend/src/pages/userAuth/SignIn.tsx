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
  const {signin,signInLoading} = useAuthStore();

  const onSubmit = async (data: SignInData) => {
    const signedInUser = await signin(data);

    if (signedInUser && !("success" in signedInUser)) {
      navigate("/dashboard");
      return true;
    } else if (signedInUser && "success" in signedInUser) {
      navigate("/verify-email");
      return false;
    } else {
      console.log("Login failed or user is not set.");
      return false;
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
          loading={signInLoading}
          isSignIn
        />
      </LazyLoader>
    </AuthLayout>
  );
};

export default SignIn;
