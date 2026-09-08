import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { ReactNode } from "react";

import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

import OnboardingSpeechBubble from "./OnboardingSpeechBubble";
import OnboardingStepProgress from "./OnboardingStepProgress";
import { getOnboardingStepInfo, type OnboardingStepKey } from "./onboardingSteps";
import type { OnboardingVariant } from "./onboardingVariant";

type Props = {
  step: OnboardingStepKey;
  variant?: OnboardingVariant;
  htmlTitle: string;
  children: ReactNode;
  belowBubbleContent?: ReactNode;
};

export default function OnboardingStepShell({
  step,
  variant,
  htmlTitle,
  children,
  belowBubbleContent,
}: Props) {
  const { stepNumber, totalSteps, previousLinkProps, forwardLabel, forwardLinkProps } =
    getOnboardingStepInfo(step, variant);

  const forwardButton: ButtonProps = {
    className: "mb-0",
    children: forwardLabel,
    priority: "primary",
    linkProps: forwardLinkProps,
  };
  const buttons: [ButtonProps, ...ButtonProps[]] = previousLinkProps
    ? [
        {
          className: "mb-0",
          children: "Retour",
          priority: "secondary",
          linkProps: previousLinkProps,
        },
        forwardButton,
      ]
    : [forwardButton];

  return (
    <OnboardingPageLayout
      htmlTitle={htmlTitle}
      bottomBarContent={
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment={previousLinkProps ? "between" : "right"}
          buttons={buttons}
        />
      }
    >
      <OnboardingStepProgress currentStep={stepNumber} totalSteps={totalSteps} />
      <OnboardingSpeechBubble>{children}</OnboardingSpeechBubble>
      {belowBubbleContent && <div className="mt-10">{belowBubbleContent}</div>}
    </OnboardingPageLayout>
  );
}
