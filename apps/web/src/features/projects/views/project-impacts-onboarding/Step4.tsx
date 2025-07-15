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
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 1 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="tw-text-[32px] tw-mb-14">
        Votre site et votre projet sont{" "}
        <span className="tw-bg-[#FBB8F6] dark:tw-text-black">sauvegardés automatiquement</span>.
      </h1>

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-8">
        <div
          className={classNames(
            "tw-flex-2",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <p className="tw-text-xl tw-font-bold">Ils se trouvent dans "Mes projets".</p>
          <img
            src="/img/pictograms/project-impacts-onboarding/step4-my-projects.svg"
            aria-hidden="true"
            alt=""
          />
        </div>
        <div
          className={classNames(
            "tw-my-auto",
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
      <div className="tw-mt-8">
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
