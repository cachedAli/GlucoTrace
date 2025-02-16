import React from "react";

import AuthLayout from "@/components/layout/userAuth/AuthLayout";
import Button from "@/components/ui/Button";
import Form from "@/components/ui/Form";
import { z } from "zod";

type FormField = {
  name: string;
  type: "text" | "email" | "password" | "textarea";
  label: string;
  colSpan?: number;
};

const SignIn = () => {
  const contactSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Name must be at least 3 characters"),
  });
  const contactFields: FormField[] = [
    { name: "email", type: "email", label: "Email" },
    { name: "password", type: "password", label: "Password" },
  ];
  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };
  return (
    <AuthLayout
      isSignIn={true}
      currentPage={"Sign In"}
      formTitle="Sign in to your Account"
    >
      <Form
        fields={contactFields}
        onSubmit={onSubmit}
        schema={contactSchema}
        buttonLabel="Sign in"
      />
    </AuthLayout>
  );
};

export default SignIn;
