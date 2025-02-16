import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodSchema } from "zod";
import Button from "./Button";
import clsx from "clsx";
import InputField from "./InputField";
import { FcGoogle } from "react-icons/fc";

type FormField = {
  name: string;
  type: "text" | "email" | "password" | "textarea";
  label: string;
  colSpan?: number;
};

type FormProps = {
  fields: FormField[];
  schema: ZodSchema;
  onSubmit: (data: any) => void;
  buttonLabel?: string;
};

const Form = ({
  fields,
  schema,
  onSubmit,
  buttonLabel = "Submit",
}: FormProps) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className=" w-full grid grid-cols-2 gap-4 "
      >
        {fields.map((field, index) => (
          <>
            <div
              key={index}
              className={clsx(
                "flex flex-col",
                field.colSpan === 1 ? "col-span-1" : "col-span-2"
              )}
            >
              <InputField
                name={field.name}
                control={control}
                label={field.label}
                error={errors[field.name]?.message as string}
                type={field.type}
              />
            </div>
          </>
        ))}
        <Button variant="fill" type="submit" className="col-span-2 !h-14 rounded-[14px]">
          {buttonLabel}
        </Button>
      </form>

      <div className="flex items-center my-4 w-full">
        <div className="flex-grow border-t border-gray-300 h-0"></div>
        <span className="px-4 text-gray-500 text-sm whitespace-nowrap">
          Or continue with
        </span>
        <div className="flex-grow border-t border-gray-300 h-0"></div>
      </div>

      <div className="w-full">
        <Button
          type="button"
          className="w-full flex items-center justify-center !h-14 rounded-[14px]"
        >
          <FcGoogle size={20} />
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default Form;
