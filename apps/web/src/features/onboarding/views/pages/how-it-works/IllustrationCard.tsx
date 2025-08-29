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
  1: `text-onboarding-step1`,
  2: `text-onboarding-step2`,
  3: `text-onboarding-step3`,
  4: `text-onboarding-step4`,
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
        "bg-[var(--background-default-grey)]",
        "rounded-2xl",
        "shadow-[0_6px_18px_0px_#00001229]",
        "flex",
        "flex-col",
        "justify-between",
        "p-4",
        "pb-6",
        "gap-4",
        className,
      )}
    >
      <i className={classNames(fr.cx(iconId, "fr-icon--lg"), iconColorsVariants[stepNumber])}></i>
      <span className="font-medium">{title}</span>
      {children}
    </div>
  );
};

export default IllustrationCard;
