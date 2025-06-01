import React, { useRef } from "react";

import { useNavigate } from "react-router-dom";

import { signInFields } from "@/libs/constants/authPage/formFields";
import FormSkeleton from "@/components_temp/ui/skeleton/FormSkeleton";
import AuthLayout from "@/components_temp/layout/userAuth/AuthLayout";
import { SignInSchema } from "@/libs/validations/authSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { SignInData } from "@/types/authTypes";
import LazyLoader from "@/libs/LazyLoader";
import { Form } from "@/router/LazyRoutes";
import {
  preloadDashboardLayout,
  preloadOverview,
} from "@/router/preloadRoutes";

const SignIn = () => {
  const navigate = useNavigate();
  const { signin, signInLoading } = useAuthStore();
  const hasPrefetched = useRef(false);

  const onSubmit = async (data: SignInData) => {
    const signedInUser = await signin(data);

    if (signedInUser && !("success" in signedInUser)) {
      preloadDashboardLayout();
      preloadOverview();
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

  const handleMouseEnter = () => {
    if (!hasPrefetched.current) {
      preloadDashboardLayout();
      preloadOverview();
      hasPrefetched.current = true;
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
          onMouseEnter={handleMouseEnter}
          googleOnMouseEnter={handleMouseEnter}
        />
      </LazyLoader>
    </AuthLayout>
  );
};

export default SignIn;
