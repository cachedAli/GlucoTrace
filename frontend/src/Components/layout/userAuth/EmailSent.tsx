import clsx from "clsx";

import { useNavigate } from "react-router-dom";
import { MailOpen } from "lucide-react";

import Button from "@/components/ui/Button";
import AuthLayout from "./AuthLayout";

const EmailSent = () => {
  return (
    <AuthLayout className="gap-4">
      <div className="flex rounded-2xl bg-blue-100 p-5 ">
        <MailOpen size={96} className="text-blue-600" />
      </div>

      <p
        className={clsx(
          "text-gray-500 text-base text-center",
          "max-sm:text-sm"
        )}
      >
        We've sent a password reset link to your email.
      </p>

      <ButtonComponent />
    </AuthLayout>
  );
};

const ButtonComponent = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="fill"
        onClick={() => window.open("https://mail.google.com/", "_blank")}
      >
        Open Email
      </Button>

      <Button
        variant="transparent"
        className="-mt-1"
        onClick={() => navigate("/signin")}
      >
        Back to login
      </Button>
    </>
  );
};

export default EmailSent;
