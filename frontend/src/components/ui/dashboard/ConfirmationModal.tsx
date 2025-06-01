import { CircleHelp } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

import BaseLoader from "../loader/BaseLoader";
import Button from "../common/Button";
import Form from "../common/Form";

type BaseProps = {
  title: string;
  message: string;
  loading?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type DeleteOrConfirmModal = BaseProps & {
  confirmText?: "Confirm" | "Delete";
};

type ShareModal = BaseProps & {
  confirmText: "Share";
  fields: any;
  schema: any;
  onConfirm: (data: any) => Promise<any>;
};

type ConfirmationModalProps = DeleteOrConfirmModal | ShareModal;

const ConfirmationModal = ({ ...props }: ConfirmationModalProps) => {
  const isDelete = props.confirmText === "Delete";
  const isShare = props.confirmText === "Share";

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.15, ease: "easeIn" },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={clsx(
          "bg-slate-50 z-50 w-[500px] max-sm:w-[300px] px-6 py-6 max-sm:px-4 max-sm:py-4 gap-6 shadow-xl rounded-2xl flex flex-col items-start",
          "dark:bg-gray-800"
        )}
      >
        <div className="flex gap-2 items-center max-sm:flex-col">
          {isDelete && (
            <CircleHelp className="size-20 max-sm:size-14 text-red-600" />
          )}

          <div className="flex flex-col gap-2 items-start justify-center max-sm:items-center max-sm:text-center">
            <h1
              className={clsx(
                "text-xl max-sm:text-lg font-semibold text-headingMain",
                "dark:text-headingMain-dark"
              )}
            >
              {props.title}
            </h1>
            <p
              className={clsx(
                "text-sm max-sm:text-xs text-headingSub",
                "dark:text-cardsSub"
              )}
            >
              {props.message}
            </p>
          </div>
        </div>

        {isShare ? (
          <Form
            fields={props.fields}
            schema={props.schema}
            onSubmit={props.onConfirm}
            backButtonLabel="Cancel"
            loading={props.loading}
            googleAuth={false}
            backButtonOnClick={props.onCancel}
            buttonClassName="w-44 max-sm:w-36 max-[412px]:w-28"
            backButtonClassName="w-36 max-sm:w-28 max-[412px]:w-24"
            buttonAlignment="custom"
          />
        ) : (
          <div className="w-full flex gap-2 justify-end items-end">
            <Button
              variant="transparent"
              onClick={props.onCancel}
              className={clsx(
                "w-28 max-sm:w-full max-sm:text-sm",
                isDelete && "border-red-500 text-red-500"
              )}
              hoverExpandBg={clsx(isDelete && "bg-red-500")}
            >
              Cancel
            </Button>

            <Button
              variant="fill"
              onClick={props.onConfirm}
              disabled={props.loading ? true : false}
              className={clsx(
                "w-36 max-sm:w-full max-sm:text-sm",
                isDelete && "bg-red-500"
              )}
            >
              {props.loading ? <BaseLoader /> : props.confirmText}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
