import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["tw-transition", "tw-ease-in-out", "tw-duration-1000"] as const;
const VISIBLE_CLASSES = ["tw-opacity-100", "tw-visible"] as const;
const INVISIBLE_CLASSES = ["md:tw-opacity-0", "md:tw-invisible"] as const;

export default function Step4({ onNextClick, onBackClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };
  return (
    <>
      <h1 className="tw-text-[32px]">
        Vous avez accès au{" "}
        <span className="tw-bg-[#96ECFF] dark:tw-text-black">calcul de tous les impacts</span>.
      </h1>

      <div className="tw-flex tw-justify-between tw-gap-6">
        <div
          className={classNames(
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="tw-text-xl tw-font-bold tw-max-w-72">
            Les indicateurs d’impact sont cliquables.
          </p>
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
            "dark:tw-invert",
          )}
          src="/img/pictograms/project-impacts-onboarding/step3-arrows.svg"
          aria-hidden="true"
          alt="pictogramme flèches"
        />

        <div
          className={classNames(
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="tw-max-w-96">
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

      <div className="tw-mt-5">
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="between"
          buttons={[
            {
              children: "Retour",
              priority: "secondary",
              onClick: onBackClick,
            },
            {
              priority: "primary",
              children: innerStep === 2 ? "Consulter les impacts" : "Suivant",
              onClick: innerStep === 2 ? onNextClick : onNextInnerStep,
            },
          ]}
        />
      </div>
    </>
  );
}
