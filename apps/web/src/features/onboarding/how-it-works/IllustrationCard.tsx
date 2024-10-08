import { fr, FrCxArg } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type IllustrationCardProps = {
  className: ClassValue;
  iconId: FrCxArg;
  title: string;
  children?: ReactNode;
  stepNumber: 1 | 2 | 3 | 4;
};

const iconColorsVariants = {
  1: `tw-text-onboarding-step1`,
  2: `tw-text-onboarding-step2`,
  3: `tw-text-onboarding-step3`,
  4: `tw-text-onboarding-step4`,
} as const;

const IllustrationCard = ({
  className,
  iconId,
  title,
  children,
  stepNumber,
}: IllustrationCardProps) => {
  return (
    <div
      className={classNames(
        "tw-bg-[var(--background-default-grey)]",
        "tw-rounded-2xl",
        "tw-shadow-[0_6px_18px_0px_#00001229]",
        "tw-flex",
        "tw-flex-col",
        "tw-justify-between",
        "tw-p-4",
        "tw-pb-6",
        "tw-gap-4",
        className,
      )}
    >
      <i className={classNames(fr.cx(iconId, "fr-icon--lg"), iconColorsVariants[stepNumber])}></i>
      <span className="tw-font-medium">{title}</span>
      {children}
    </div>
  );
};

export default IllustrationCard;
