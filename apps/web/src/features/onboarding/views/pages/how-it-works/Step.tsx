import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames, { ClassValue } from "@/shared/views/clsx";

type StepProps = {
  stepNumber: 1 | 2 | 3 | 4;
  title: string;
  text: ReactNode;
  className?: ClassValue;
};

const numberBgVariants = {
  1: `bg-onboarding-step1`,
  2: `bg-onboarding-step2`,
  3: `bg-onboarding-step3`,
  4: `bg-onboarding-step4`,
} as const;

const OnBoardingIntroductionStep = ({ stepNumber, title, text, className }: StepProps) => {
  return (
    <div className={classNames("grid", "grid-cols-[2rem_1fr]", "gap-4", className)}>
      <div
        className={classNames(
          "flex",
          "items-center",
          "justify-center",
          "rounded-full",
          "h-8",
          "w-8",
          "font-bold",
          "text-white",
          numberBgVariants[stepNumber],
        )}
      >
        {stepNumber}
      </div>
      <div>
        <h3 className={classNames(fr.cx("fr-text--xl", "fr-text--bold", "fr-mb-2v"))}>{title}</h3>
        <p className={fr.cx("fr-text--md", "fr-mt-1w")}>{text}</p>
      </div>
    </div>
  );
};

export default OnBoardingIntroductionStep;
