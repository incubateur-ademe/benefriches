import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible"] as const;

export default function Step4({ onNextClick, onBackClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 1 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="text-[32px] mb-14">
        Votre site et votre projet sont{" "}
        <span className="bg-[#FBB8F6] dark:text-black">sauvegardés automatiquement</span>.
      </h1>

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
      <div className="mt-8">
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
