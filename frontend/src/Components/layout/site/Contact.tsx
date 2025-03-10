import { useRef } from "react";

import { contactFormFields } from "@/libs/constants/authPage/formFields";
import { contactSchema } from "@/libs/validations/authSchema";
import { contact } from "@/libs/constants/homepage";

import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import usePreloadOnScroll from "@/hooks/usePreloadOnScroll";
import { preloadForm } from "@/router/preloadRoutes";
import { Form } from "@/router/LazyRoutes";
import LazyLoader from "@/libs/LazyLoader";

type Data = {
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
};

const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const submit = (data: Data) => {
    console.log("Contact Form Submit: ", data);
  };
  return (
    <section
      ref={formRef}
      id="contact"
      className="bg-slate-50 max-w-screen-2xl w-full mx-auto  selection:bg-indigo-800 selection:text-white"
    >
      <ContactDetails />
      <ContactForm
        contactFormFields={contactFormFields}
        contactSchema={contactSchema}
        submit={submit}
        formRef={formRef}
        usePreloadOnScroll={usePreloadOnScroll}
      />
    </section>
  );
};

const ContactForm = ({
  contactFormFields,
  contactSchema,
  submit,
  formRef,
  usePreloadOnScroll,
}: any) => {
  const isPreloaded = usePreloadOnScroll(formRef, preloadForm);
  return (
    <div className="flex flex-col gap-6  px-6 pb-20 pt-10 md:px-4 md:mx-20">
      {isPreloaded && (
        <LazyLoader
          fallback={() => <FormSkeleton fields={contactFormFields} />}
        >
          <Form
            fields={contactFormFields}
            schema={contactSchema}
            googleAuth={false}
            buttonLabel="Submit"
            onSubmit={submit}
          />
        </LazyLoader>
      )}
    </div>
  );
};

const ContactDetails = () => {
  return (
    <div className="flex flex-col items-start gap-2 md:px-4 px-6  pt-20 md:mx-20 whitespace-normal">
      <h1 className="md:text-4xl text-3xl font-bold font-lora mb-2 text-[#193798]">
        {contact.heading}
      </h1>
      <p className="font-roboto md:text-lg mb-4 selection:bg-indigo-800 selection:text-white">
        {contact.description1}
      </p>
      <p className="font-roboto md:text-lg selection:bg-indigo-800 selection:text-white">
        {contact.description2}
      </p>
      <p className="font-roboto md:text-lg mb-2 selection:bg-indigo-800 selection:text-white">
        <strong className="selection:bg-indigo-800 selection:text-white">
          Email us at:{" "}
        </strong>
        <span className="selection:bg-indigo-800 selection:text-white">
          contact.monkebytes@gmail.com
        </span>
      </p>
      <p className="font-roboto md:text-base italic text-sm selection:bg-indigo-800 selection:text-white">
        {contact.required}
      </p>
    </div>
  );
};

export default Contact;
