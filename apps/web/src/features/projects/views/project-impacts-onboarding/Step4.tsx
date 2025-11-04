import { useState } from "react";

import classNames from "@/shared/views/clsx";

import StepView from "./StepView";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible"] as const;

export default function Step4({
  onNextClick,
  onBackClick,
  skipStepByStepAnimation,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 1 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <StepView
      title={
        <>
          Votre site et votre projet sont{" "}
          <span className="bg-[#FBB8F6] dark:text-black">sauvegardés automatiquement</span>.
        </>
      }
      onNextClick={innerStep === 2 ? onNextClick : onNextInnerStep}
      nextButtonLabel={innerStep === 2 ? "Consulter les impacts" : "Suivant"}
      onBackClick={onBackClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div
          className={classNames(
            "flex-2",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="text-xl font-bold">Ils se trouvent dans "Mes projets".</p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step4-my-projects.svg"
            aria-hidden="true"
            alt=""
          />
        </div>
        <div
          className={classNames(
            "my-auto",
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p>
            Avec vos identifiants Bénéfriches, connectez-vous depuis n'importe quel ordinateur et
            retrouvez ici tous vos sites et vos projets créés.
          </p>
        </div>
      </div>
    </StepView>
  );
}
