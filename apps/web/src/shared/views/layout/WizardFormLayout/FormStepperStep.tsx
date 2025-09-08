import { HTMLAttributes, useContext } from "react";

import classNames from "@/shared/views/clsx";

import { SidebarLayoutContext } from "../SidebarLayout/SidebarLayoutContext";

type StepProps = {
  title: string;
  state: "current" | "pending" | "completed" | "empty";
  disabled?: boolean;
  counterId?: "main" | "sub";
} & HTMLAttributes<HTMLLIElement>;

const ROUNDED_CIRCLE_CLASSES = [
  "text-white",
  "rounded-full",
  "leading-6",
  "min-w-6",
  "h-6",
  "text-center",
];

const SUCCESS_ICON_CLASSES = ["fr-icon-success-line text-green-light"];
const IN_PROGRESS_ICON_CLASSES = [
  "ri-pencil-line",
  "fr-icon--sm",
  "bg-blue-medium",
  ...ROUNDED_CIRCLE_CLASSES,
];

const MAIN_COUNTER_INC_CLASS = `[counter-increment:main-counter]` as const;
const SUB_COUNTER_INC_CLASS = `[counter-increment:sub-counter]` as const;

const MAIN_COUNTER_CONTENT_CLASS = `before:content-[counter(main-counter)]` as const;
const SUB_COUNTER_CONTENT_CLASS = `before:content-[counter(sub-counter)]` as const;

const NUMBER_CLASSES = ["font-bold", "text-xs", ...ROUNDED_CIRCLE_CLASSES];

const getNumberClasses = (isCurrent: boolean, counterId: StepProps["counterId"]) => {
  return [
    counterId === "main" ? MAIN_COUNTER_CONTENT_CLASS : SUB_COUNTER_CONTENT_CLASS,
    isCurrent ? "bg-blue-medium" : "bg-grey-main dark:bg-grey-dark",
    ...NUMBER_CLASSES,
  ];
};

const FormStepperStep = ({
  title,
  state,
  disabled,
  onClick,
  counterId = "main",
  ...props
}: StepProps) => {
  const { isOpen: isExtended } = useContext(SidebarLayoutContext);

  return (
    <li
      {...props}
      className={classNames(
        "flex",
        "items-center",
        "p-2",
        "marker:content-none",
        "text-sm",
        !isExtended && "justify-center",
        state === "completed" && "text-green-main",
        state === "current" || state === "pending"
          ? [
              "bg-blue-ultralight dark:bg-blue-ultradark",
              "text-blue-ultradark dark:text-blue-ultralight",
            ]
          : "text-dsfr-greyDisabled",
        onClick && [
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
        ],
        counterId === "main" ? MAIN_COUNTER_INC_CLASS : SUB_COUNTER_INC_CLASS,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <span
        className={classNames(
          isExtended ? "mx-4" : "mx-0",
          state === "completed"
            ? SUCCESS_ICON_CLASSES
            : state === "pending"
              ? IN_PROGRESS_ICON_CLASSES
              : getNumberClasses(state === "current", counterId),
        )}
        aria-hidden="true"
      />
      {isExtended && (
        <>
          <span className={state === "current" ? "font-medium" : ""}>{title}</span>
          {state === "current" && (
            <span className="fr-icon-arrow-right-s-line ml-auto" aria-hidden="true"></span>
          )}
        </>
      )}
    </li>
  );
};

export default FormStepperStep;
