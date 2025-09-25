import { HTMLAttributes, useContext } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

import { SidebarLayoutContext } from "../SidebarLayout/SidebarLayoutContext";

type StepState = "current" | "active" | "completed" | "empty";

export type StepProps = {
  title: string;
  state: StepState;
  selectable?: boolean;
  disabled?: boolean;
  className?: ClassValue;
  as?: keyof HTMLElementTagNameMap;
} & HTMLAttributes<HTMLElement>;

const rootClasses = {
  layout: ["flex", "items-center", "text-sm", "p-2", "before:mx-4"],
  marker: {
    base: ["marker:content-none"],
    completed: "fr-icon-check-line text-green-light",
    number: {
      base: [
        "before:text-white",
        "before:rounded-full",
        "before:leading-6",
        "before:min-w-6",
        "before:h-6",
        "before:text-center",
        "before:font-bold",
        "before:text-xs",
        'before:content-[counters(li-counter,".")]',
      ],
      active: "before:bg-blue-medium",
      inactive: "before:bg-grey-main dark:before:bg-grey-dark",
    },
  },
  colors: {
    completed: "text-green-main",
    active: [
      "bg-blue-ultralight dark:bg-blue-ultradark",
      "text-blue-ultradark dark:text-blue-ultralight",
    ],
    empty: "text-dsfr-greyDisabled",
    hover: "hover:bg-blue-ultralight hover:dark:bg-blue-ultradark",
  },
} as const;

const CurrentStepArrow = () => (
  <span className="fr-icon-arrow-right-s-line ml-auto" aria-hidden="true" />
);

const FormStepperStep = ({
  title,
  state,
  selectable,
  disabled,
  className,
  as: HtmlTag = "li",
  ...props
}: StepProps) => {
  const { isOpen: isExtended } = useContext(SidebarLayoutContext);
  const isActive = state === "current" || state === "active";
  const isCurrent = state === "current";
  const isCompleted = state === "completed";

  return (
    <HtmlTag
      title={!isExtended ? title : undefined}
      {...props}
      className={classNames(
        rootClasses.layout,
        rootClasses.marker.base,
        isCurrent && "font-medium",
        isCompleted
          ? [rootClasses.colors.completed, rootClasses.marker.completed]
          : [
              rootClasses.marker.number.base,
              isActive
                ? [rootClasses.colors.active, rootClasses.marker.number.active]
                : [rootClasses.colors.empty, rootClasses.marker.number.inactive],
            ],
        selectable && [
          rootClasses.colors.hover,
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        ],
        className,
      )}
    >
      {isExtended && (
        <>
          {title}
          {isCurrent && <CurrentStepArrow />}
        </>
      )}
    </HtmlTag>
  );
};

export default FormStepperStep;
