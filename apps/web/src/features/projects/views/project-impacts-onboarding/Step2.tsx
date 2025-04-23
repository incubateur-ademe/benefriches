import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { useState } from "react";

import classNames from "@/shared/views/clsx";

import EmojiListItem from "./StepEmojiListItem";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  skipStepByStepAnimation?: boolean;
};

const TRANSITION_CLASSES = ["tw-transition", "tw-ease-in-out", "tw-duration-1000"] as const;
const VISIBLE_CLASSES = ["tw-opacity-100", "tw-visible"] as const;
const INVISIBLE_CLASSES = ["md:tw-opacity-0", "md:tw-invisible"] as const;

const EMOJI_CLASSNAME = "tw-bg-[#FCEEAC]";

export default function Step3({ onNextClick, onBackClick, skipStepByStepAnimation }: Props) {
  const [innerStep, setInnerStep] = useState(skipStepByStepAnimation ? 2 : 0);

  const onNextInnerStep = () => {
    setInnerStep((current) => current + 1);
  };

  return (
    <>
      <h1 className="tw-text-[32px]">
        Bénéfriches prend en compte <span className="tw-bg-[#FFC72780]">plusieurs entités</span>.
      </h1>
      <ul className="tw-font-bold">
        <li
          className={classNames(
            "tw-text-xl",
            TRANSITION_CLASSES,
            innerStep > 0 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Les acteurs liés au projet d’aménagement :
          <ul className="tw-text-base tw-list-none">
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
            "tw-text-xl",
            TRANSITION_CLASSES,
            innerStep > 1 ? VISIBLE_CLASSES : INVISIBLE_CLASSES,
          )}
        >
          Les groupes de population pouvant être concernés par le projet ou ses retombées :
          <ul className="tw-text-base tw-list-none">
            <EmojiListItem emoji="🏘️" emojiClassName={EMOJI_CLASSNAME}>
              La population locale <span>→</span>{" "}
              <span className="tw-font-normal">
                Concernées, par exemple, par la valeur patrimoniale des bâtiments
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🏬" emojiClassName={EMOJI_CLASSNAME}>
              Les structures locales <span>→</span>{" "}
              <span className="tw-font-normal">
                Concernées, par exemple, par les dépenses de climatisation évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🇫🇷" emojiClassName={EMOJI_CLASSNAME}>
              La société française <span>→</span>{" "}
              <span className="tw-font-normal">
                Concernée, par exemple, par les dépenses de santé évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🌍" emojiClassName={EMOJI_CLASSNAME}>
              La société humaine <span>→</span>{" "}
              <span className="tw-font-normal">
                Concernée, par exemple, par les services écosystémiques
              </span>
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
