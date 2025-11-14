import { useState } from "react";

import classNames from "@/shared/views/clsx";

import EmojiListItem from "./StepEmojiListItem";
import StepView from "./StepView";

type Props = {
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible"] as const;

const EMOJI_CLASSNAME = "bg-success-ultralight";

export default function Step1({
  onNextClick,
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
      htmlTitle="Types d'impacts - Introduction - Impacts du projet"
      title={
        <>
          Bénéfriches calcule{" "}
          <span className="bg-success-ultralight dark:text-black">6 types d'impacts</span>.
        </>
      }
      onNextClick={innerStep === 2 ? onNextClick : onNextInnerStep}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <ul className="font-bold space-y-4">
        <li
          className={classNames(
            "text-xl",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          <div className="mb-4">Des impacts monétaires :</div>
          <ul className="text-base list-none space-y-2">
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
          <div className="mb-4">Des impacts non-monétaires :</div>
          <ul className="text-base list-none space-y-2">
            <EmojiListItem emoji="🏘️️" emojiClassName={EMOJI_CLASSNAME}>
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
    </StepView>
  );
}
