import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

import EmojiListItem from "./StepEmojiListItem";

type Props = {
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["tw-transition", "tw-ease-in-out", "tw-duration-1000"] as const;
const VISIBLE_CLASSES = ["tw-opacity-100", "tw-visible"] as const;
const INVISIBLE_CLASSES = ["md:tw-opacity-0", "md:tw-invisible"] as const;

const EMOJI_CLASSNAME = "tw-bg-[#B8FEC9]";

export default function Step1({ onNextClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="tw-text-[32px]">
        Bénéfriches calcule{" "}
        <span className="tw-bg-[#B8FEC9] dark:tw-text-black">6 types d'impacts</span>.
      </h1>
      <ul className="tw-font-bold">
        <li
          className={classNames(
            "tw-text-xl",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Des impacts monétaires :
          <ul className="tw-text-base tw-list-none">
            <EmojiListItem emoji="💰" emojiClassName={EMOJI_CLASSNAME}>
              Impact économiques directs <span>→</span>{" "}
              <span className="tw-font-normal">
                Exemple : dépenses de sécurisation de la friche évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🏦" emojiClassName={EMOJI_CLASSNAME}>
              Impact économiques indirects <span>→</span>{" "}
              <span className="tw-font-normal">Exemple : recettes fiscales</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰👩🏻" small emojiClassName={EMOJI_CLASSNAME}>
              Impact sociaux monétarisés <span>→</span>{" "}
              <span className="tw-font-normal">Exemple : dépenses de santé évitées</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰🌳" small emojiClassName={EMOJI_CLASSNAME}>
              Impact environnementaux monétarisés <span>→</span>{" "}
              <span className="tw-font-normal">Exemple : valeur monétaire de la décarbonation</span>
            </EmojiListItem>
          </ul>
        </li>

        <li
          className={classNames(
            "tw-text-xl",
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Des impacts non-monétaires :
          <ul className="tw-text-base tw-list-none">
            <EmojiListItem emoji="🏘️" emojiClassName={EMOJI_CLASSNAME}>
              Impact sociaux <span>→</span>{" "}
              <span className="tw-font-normal">Exemple : nombre d’emplois</span>
            </EmojiListItem>
            <EmojiListItem emoji="🏬" emojiClassName={EMOJI_CLASSNAME}>
              Impact environnementaux <span>→</span>{" "}
              <span className="tw-font-normal">Exemple : émissions de CO2-eq évitées </span>
            </EmojiListItem>
          </ul>
        </li>
      </ul>

      <div className="tw-mt-5">
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
