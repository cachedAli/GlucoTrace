import { CircleHelp } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

import Button from "../common/Button";

type ConfirmationModalProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: "Confirm" | "Delete";
};

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
}: ConfirmationModalProps) => {
  const isDelete = confirmText === "Delete";

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
              {title}
            </h1>
            <p
              className={clsx(
                "text-sm max-sm:text-xs text-headingSub",
                "dark:text-cardsSub"
              )}
            >
              {message}
            </p>
          </div>
        </div>

        <div className="w-full flex gap-2 justify-end items-end">
          <Button
            variant="transparent"
            onClick={onCancel}
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
            onClick={onConfirm}
            className={clsx(
              "w-36 max-sm:w-full max-sm:text-sm",
              isDelete && "bg-red-500"
            )}
          >
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;
