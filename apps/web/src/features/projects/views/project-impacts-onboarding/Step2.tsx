import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

import EmojiListItem from "./StepEmojiListItem";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["transition", "ease-in-out", "duration-1000"] as const;
const VISIBLE_CLASSES = ["opacity-100", "visible"] as const;
const INVISIBLE_CLASSES = ["md:opacity-0", "md:invisible"] as const;

const EMOJI_CLASSNAME = "bg-[#FCEEAC]";

export default function Step2({ onNextClick, onBackClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="text-[32px]">
        Bénéfriches prend en compte <span className="bg-[#FFC72780]">plusieurs entités</span>.
      </h1>
      <ul className="font-bold">
        <li
          className={classNames(
            "text-xl",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Les acteurs liés au projet d’aménagement :
          <ul className="text-base list-none">
            <EmojiListItem emoji="👨‍🌾" emojiClassName={EMOJI_CLASSNAME}>
              L’actuel propriétaire et/ou exploitant du site
            </EmojiListItem>
            <EmojiListItem emoji="👨‍💼" emojiClassName={EMOJI_CLASSNAME}>
              Le futur propriétaire et/ou exploitant du site
            </EmojiListItem>
            <EmojiListItem emoji="👷‍♀️" emojiClassName={EMOJI_CLASSNAME}>
              L’aménageur ou le promoteur
            </EmojiListItem>
            <EmojiListItem emoji="🏛️" emojiClassName={EMOJI_CLASSNAME}>
              La collectivité
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
          Les groupes de population pouvant être concernés par le projet ou ses retombées :
          <ul className="text-base list-none">
            <EmojiListItem emoji="🏘️" emojiClassName={EMOJI_CLASSNAME}>
              La population locale <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par la valeur patrimoniale des bâtiments
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🏬" emojiClassName={EMOJI_CLASSNAME}>
              Les structures locales <span>→</span>{" "}
              <span className="font-normal">
                Concernées, par exemple, par les dépenses de climatisation évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🇫🇷" emojiClassName={EMOJI_CLASSNAME}>
              La société française <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par les dépenses de santé évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🌍" emojiClassName={EMOJI_CLASSNAME}>
              La société humaine <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par les services écosystémiques
              </span>
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
              onClick: onBackClick,
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
