import type { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { ReactNode } from "react";

import OnboardingPageLayout from "@/shared/views/layout/OnboardingPageLayout/OnboardingPageLayout";

import OnboardingSpeechBubble from "./OnboardingSpeechBubble";
import OnboardingStepProgress from "./OnboardingStepProgress";
import { getOnboardingStepInfo, type OnboardingStepKey } from "./onboardingSteps";

type Props = {
  step: OnboardingStepKey;
  htmlTitle: string;
  children: ReactNode;
  belowBubbleContent?: ReactNode;
};

export default function OnboardingStepShell({
  step,
  htmlTitle,
  children,
  belowBubbleContent,
}: Props) {
  const { stepNumber, totalSteps, previousRoute, forwardLabel, forwardRoute } =
    getOnboardingStepInfo(step);

  const forwardButton: ButtonProps = {
    className: "mb-0",
    children: forwardLabel,
    priority: "primary",
    linkProps: forwardRoute().link,
  };
  const buttons: [ButtonProps, ...ButtonProps[]] = previousRoute
    ? [
        {
          className: "mb-0",
          children: "Retour",
          priority: "secondary",
          linkProps: previousRoute().link,
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
          alignment={previousRoute ? "between" : "right"}
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
