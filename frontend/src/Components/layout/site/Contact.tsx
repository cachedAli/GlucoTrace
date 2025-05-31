import { useRef } from "react";

import { contactFormFields } from "@/libs/constants/authPage/formFields.js";
import { contactSchema } from "@/libs/validations/authSchema.js";
import { contact } from "@/libs/constants/homepage.js";

import FormSkeleton from "@/components/ui/skeleton/FormSkeleton";
import usePreloadOnScroll from "@/hooks/usePreloadOnScroll.js";
import { preloadForm } from "@/router/preloadRoutes.js";
import { Form } from "@/router/LazyRoutes.js";
import LazyLoader from "@/libs/LazyLoader";
import { useAuthStore } from "@/store/useAuthStore.js";
import { capitalizeFirstLetter } from "@/libs/utils/utils.js";

type Data = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const { contactUs, contactUsLoading } = useAuthStore();

  const handleContact = async (data: Data): Promise<any> => {
    const { email, firstName, lastName, message } = data;
    const fullName = `${firstName} ${lastName}`;
    const capitalizedName = capitalizeFirstLetter(fullName);
    try {
      const success = await contactUs({
        email,
        fullName: capitalizedName,
        message,
      });
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
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
        submit={handleContact}
        loading={contactUsLoading}
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
  loading,
}: any) => {
  const isPreloaded = usePreloadOnScroll(formRef, preloadForm);
  return (
    <div className="flex flex-col gap-6  px-6 pb-20 pt-6 md:px-4 md:mx-20">
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
            loading={loading}
          />
        </LazyLoader>
      )}
    </div>
  );
};

const ContactDetails = () => {
  return (
    <div className="flex flex-col items-start gap-2 md:px-4 px-6  pt-20 md:mx-20 whitespace-normal">
      <h1 className="md:text-4xl text-3xl font-bold font-nunito mb-2 text-headingMain">
        {contact.heading}
      </h1>
      <p className=" md:text-lg mb-4 selection:bg-indigo-800 selection:text-white">
        {contact.description1}
      </p>
      <p className=" md:text-lg selection:bg-indigo-800 selection:text-white">
        {contact.description2}
      </p>
      <p className=" md:text-lg mb-2 selection:bg-indigo-800 selection:text-white">
        <strong className="selection:bg-indigo-800 selection:text-white">
          Email us at:{" "}
        </strong>
        <span className="selection:bg-indigo-800 selection:text-white">
          contact.monkebytes@gmail.com
        </span>
      </p>
    </div>
  );
};

export default Contact;
