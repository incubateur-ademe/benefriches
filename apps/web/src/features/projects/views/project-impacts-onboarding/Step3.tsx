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

export default function Step3({
  onNextClick,
  onBackClick,
  skipStepByStepAnimation,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };
  return (
    <StepView
      title={
        <>
          Vous avez accès au{" "}
          <span className="bg-[#96ECFF] dark:text-black">calcul de tous les impacts</span>.
        </>
      }
      onNextClick={innerStep === 2 ? onNextClick : onNextInnerStep}
      onBackClick={onBackClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <div className="flex justify-between gap-6">
        <div
          className={classNames(
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="text-xl font-bold max-w-72">Les indicateurs d’impact sont cliquables.</p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step3-indicateur.svg"
            aria-hidden="true"
            alt="pictogramme indicateur"
          />
        </div>

        <img
          className={classNames(
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
            "dark:invert",
          )}
          src="/img/pictograms/project-impacts-onboarding/step3-arrows.svg"
          aria-hidden="true"
          alt="pictogramme flèches"
        />

        <div
          className={classNames(
            "my-auto",
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="max-w-96 mx-auto">
            Ils ouvrent une fenêtre qui contient toutes les informations sur l’impact : définition,
            données utilisées, mode de calcul, sources, etc.
          </p>{" "}
          <img
            src="/img/pictograms/project-impacts-onboarding/step3-popin.png"
            aria-hidden="true"
            alt="pictogramme popin"
          />
        </div>
      </div>
    </StepView>
  );
}
