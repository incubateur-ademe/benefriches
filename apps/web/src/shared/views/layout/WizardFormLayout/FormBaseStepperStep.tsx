import { HTMLAttributes, useContext, useEffect, useMemo } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";
import { SidebarCurrentStepContext } from "@/shared/views/layout/SidebarLayout/SidebarCurrentStepContext";

export type StepActivity = "current" | "groupActive" | "inactive";
export type StepValidation = "completed" | "empty";

export type StepVariant = {
  activity: StepActivity;
  validation: StepValidation;
};

type VariantKey = `${StepActivity}-${StepValidation}`;

export type VariantStyleConfig = Record<VariantKey, ClassValue>;

export type BaseStepperStepProps = {
  title: string;
  variant: StepVariant;
  variantStyles: VariantStyleConfig;
  className?: ClassValue;
  as?: keyof HTMLElementTagNameMap;
} & HTMLAttributes<HTMLElement>;

export const SHARED_STYLES = {
  numberMarker: [
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
} as const;

const BASE_LAYOUT_STYLES = [
  "flex",
  "items-center",
  "text-sm",
  "p-2",
  "before:mx-4",
  "marker:content-none",
] as const;

const CurrentStepArrow = () => (
  <span className="fr-icon-arrow-right-s-line ml-auto" aria-hidden="true" />
);

const getVariantKey = (variant: StepVariant): VariantKey => {
  return `${variant.activity}-${variant.validation}`;
};

const BaseStepperStep = ({
  title,
  variant,
  variantStyles,
  className,
  as: HtmlTag = "li",
  ...props
}: BaseStepperStepProps) => {
  const computedClasses = useMemo(() => {
    const variantKey = getVariantKey(variant);
    return classNames(
      BASE_LAYOUT_STYLES,
      HtmlTag === "button" && "text-left w-full",
      variantStyles[variantKey],
      className,
    );
  }, [variant, variantStyles, className, HtmlTag]);

  const isCurrent = variant.activity === "current";

  const { setCurrentStepLabel } = useContext(SidebarCurrentStepContext);
  useEffect(() => {
    if (isCurrent) {
      setCurrentStepLabel(title);
    }
  }, [isCurrent, title, setCurrentStepLabel]);

  const commonProps = {
    "aria-current": isCurrent ? ("step" as const) : undefined,
    className: computedClasses,
  };

  const content = (
    <>
      {title}
      {isCurrent && <CurrentStepArrow />}
    </>
  );

  return (
    <HtmlTag {...commonProps} {...props}>
      {content}
    </HtmlTag>
  );
};

export default BaseStepperStep;
