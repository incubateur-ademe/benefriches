import { fr } from "@codegouvfr/react-dsfr";
import { HTMLAttributes, useContext } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";
import { SidebarLayoutContext } from "@/shared/views/layout/SidebarLayout/SidebarLayoutContext";

export type StepProps = {
  title: string;
  variant: "completed" | "empty" | "current" | "active";
  className?: ClassValue;
} & HTMLAttributes<HTMLButtonElement>;

const MARKER_NUMBER_CLASSES = [
  "before:text-white",
  "before:rounded-full",
  "before:leading-6",
  "before:min-w-6",
  "before:h-6",
  "before:text-center",
  "before:font-bold",
  "before:text-xs",
  'before:content-[counters(li-counter,".")]',
] as const;

const ACTIVE_CLASSES = [
  "before:bg-blue-ultradark",
  "bg-blue-ultralight dark:bg-blue-ultradark",
  "text-blue-ultradark dark:text-blue-ultralight",
  "font-medium",
];
const COMPLETED_CLASSES = ["before:bg-blue-ultradark"];
const EMPTY_CLASSES = [fr.cx("fr-icon-error-warning-line"), "bg-[#FFF0DB] text-[#774600]"];

const CurrentStepArrow = () => (
  <span className="fr-icon-arrow-right-s-line ml-auto" aria-hidden="true" />
);

const UpdateFormStepperStep = ({ title, variant, className, ...props }: StepProps) => {
  const { isOpen: isExtended } = useContext(SidebarLayoutContext);

  const isActive = variant === "current" || variant === "active";

  return (
    <button
      title={!isExtended ? title : undefined}
      {...props}
      className={classNames(
        "flex",
        "items-center",
        "text-sm",
        "p-2",
        "before:mx-4",
        "text-left w-full",
        "marker:content-none",

        variant === "empty"
          ? EMPTY_CLASSES
          : [MARKER_NUMBER_CLASSES, isActive ? ACTIVE_CLASSES : COMPLETED_CLASSES],

        "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",

        className,
      )}
    >
      {isExtended && (
        <>
          {title}
          {variant === "current" && <CurrentStepArrow />}
        </>
      )}
    </button>
  );
};

export default UpdateFormStepperStep;
