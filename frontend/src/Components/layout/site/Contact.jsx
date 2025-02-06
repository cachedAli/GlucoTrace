import React from "react";
import { contact } from "../../pages/site/constants";

const Contact = () => {
  return (
    <section
      id="contact"
      className="bg-[#F4F6F8]  selection:bg-indigo-800 selection:text-amber-300"
    >
      <ContactDetails />
      <ContactForm />
    </section>
  );
};

const ContactForm = () => {
  return (
    <form className="flex flex-col gap-6  px-6 py-20 md:px-4 md:mx-20">
      {/* First and Last Name */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* First Name */}
        <div className="flex flex-col w-full">
          <label
            className="font-semibold text-blue-800 mb-2 font-lora"
            htmlFor="first-name"
          >
            First Name *
          </label>
          <input
            type="text"
            id="first-name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col w-full">
          <label
            className="font-semibold text-blue-800 mb-2 font-lora"
            htmlFor="last-name"
          >
            Last Name *
          </label>
          <input
            type="text"
            id="last-name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
      {/* Email */}
      <div className="flex flex-col">
        <label
          className="font-semibold text-blue-800 mb-2 font-lora"
          htmlFor="email"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Message */}
      <div className="flex flex-col">
        <label
          className="font-semibold text-blue-800 mb-2 font-lora"
          htmlFor="message"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          rows="5"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      {/* Submit button */}
      <button className=" bg-blue-900 text-white hover:opacity-90 hover:transition-all hover:duration-300 rounded-md text-base font-medium w-24 p-1 selection:text-blue-800 selection:bg-amber-300 mt-2">
        Submit
      </button>
    </form>
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
