import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

type Props = {
  htmlTitle: string;
  title: ReactNode;
  children: ReactNode;
  nextButtonLabel?: string;
  onNextClick: () => void;
  onBackClick?: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

export default function StepView({
  htmlTitle,
  title,
  children,
  onNextClick,
  nextButtonLabel = "Suivant",
  onBackClick,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  return (
    <OnboardingPageLayout
      htmlTitle={htmlTitle}
      bottomBarContent={
        <ul className="list-none p-0 m-0 flex gap-4 items-center justify-between md:max-w-3/4 md:mx-auto">
          {onBackClick && (
            <li>
              <Button priority="secondary" onClick={onBackClick}>
                Retour
              </Button>
            </li>
          )}
          {canSkipOnboarding && (
            <li className="ml-auto">
              <Button priority="tertiary no outline" onClick={skipOnboarding}>
                Passer l'introduction
              </Button>
            </li>
          )}
          <li className={!canSkipOnboarding ? "ml-auto" : ""}>
            <Button priority="primary" onClick={onNextClick}>
              {nextButtonLabel}
            </Button>
          </li>
        </ul>
      }
    >
      <div className="md:max-w-3/4 md:mx-auto">
        <h1 className="text-[32px]">{title}</h1>
        {children}
      </div>
    </OnboardingPageLayout>
  );
}
