import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

import EmojiListItem from "./StepEmojiListItem";

type Props = {
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible"] as const;

const EMOJI_CLASSNAME = "bg-[#B8FEC9]";

export default function Step1({ onNextClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="text-[32px]">
        Bénéfriches calcule <span className="bg-[#B8FEC9] dark:text-black">6 types d'impacts</span>.
      </h1>
      <ul className="font-bold">
        <li
          className={classNames(
            "text-xl",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Des impacts monétaires :
          <ul className="text-base list-none">
            <EmojiListItem emoji="💰" emojiClassName={EMOJI_CLASSNAME}>
              Impacts économiques directs <span>→</span>{" "}
              <span className="font-normal">
                Exemple : dépenses de sécurisation de la friche évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🏦" emojiClassName={EMOJI_CLASSNAME}>
              Impacts économiques indirects <span>→</span>{" "}
              <span className="font-normal">Exemple : recettes fiscales</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰👩🏻" small emojiClassName={EMOJI_CLASSNAME}>
              Impacts sociaux monétarisés <span>→</span>{" "}
              <span className="font-normal">Exemple : dépenses de santé évitées</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰🌳" small emojiClassName={EMOJI_CLASSNAME}>
              Impacts environnementaux monétarisés <span>→</span>{" "}
              <span className="font-normal">Exemple : dépenses de traitement de l'eau évitées</span>
            </EmojiListItem>
          </ul>
        </li>

        <li
          className={classNames(
            "text-xl",
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Des impacts non-monétaires :
          <ul className="text-base list-none">
            <EmojiListItem emoji="🏘️" emojiClassName={EMOJI_CLASSNAME}>
              Impacts sociaux <span>→</span>{" "}
              <span className="font-normal">Exemple : nombre d’emplois</span>
            </EmojiListItem>
            <EmojiListItem emoji="🌳" emojiClassName={EMOJI_CLASSNAME}>
              Impacts environnementaux <span>→</span>{" "}
              <span className="font-normal">Exemple : émissions de CO2-eq évitées </span>
            </EmojiListItem>
          </ul>
        </li>
      </ul>

      <div className="mt-8">
        <ButtonsGroup
          inlineLayoutWhen="always"
          alignment="between"
          buttons={[
            {
              children: "Retour",
              priority: "secondary",
            },
            {
              priority: "primary",
              children: "Suivant",
              onClick: innerStep === 2 ? onNextClick : onNextInnerStep,
            },
          ]}
        />
      </div>
    </>
  );
}
