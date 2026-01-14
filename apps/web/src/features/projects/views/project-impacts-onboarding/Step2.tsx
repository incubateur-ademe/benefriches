import EmojiListItem from "../shared/emoji-li-item/StepEmojiListItem";
import StepView from "./StepView";

type Props = {
  onBackClick: () => void;
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

const EMOJI_CLASSES = { emoji: "bg-[#FCEEAC]" };

export default function Step2({
  onNextClick,
  onBackClick,
  canSkipOnboarding,
  skipOnboarding,
}: Props) {
  return (
    <StepView
      htmlTitle="Types d'entités - Introduction - Impacts du projet"
      title={
        <>
          Bénéfriches prend en compte <span className="bg-[#FFC72780]">plusieurs entités</span>.
        </>
      }
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <ul className="font-bold space-y-4">
        <li className="text-xl">
          Les acteurs liés au projet d'aménagement :
          <ul className="text-base list-none space-y-2">
            <EmojiListItem emoji="👨‍🌾" classes={EMOJI_CLASSES}>
              L'actuel propriétaire et/ou exploitant du site
            </EmojiListItem>
            <EmojiListItem emoji="👨‍💼" classes={EMOJI_CLASSES}>
              Le futur propriétaire et/ou exploitant du site
            </EmojiListItem>
            <EmojiListItem emoji="👷‍♀️" classes={EMOJI_CLASSES}>
              L'aménageur ou le promoteur
            </EmojiListItem>
            <EmojiListItem emoji="🏛️️" classes={EMOJI_CLASSES}>
              La collectivité
            </EmojiListItem>
          </ul>
        </li>

        <li className="text-xl">
          Les groupes de population pouvant être concernés par le projet ou ses retombées :
          <ul className="text-base list-none space-y-2">
            <EmojiListItem emoji="🏘️️" classes={EMOJI_CLASSES}>
              La population locale <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par la valeur patrimoniale des bâtiments
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🏬" classes={EMOJI_CLASSES}>
              Les structures locales <span>→</span>{" "}
              <span className="font-normal">
                Concernées, par exemple, par les dépenses de climatisation évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🇫🇷" classes={EMOJI_CLASSES}>
              La société française <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par les dépenses de santé évitées
              </span>
            </EmojiListItem>
            <EmojiListItem emoji="🌍" classes={EMOJI_CLASSES}>
              La société humaine <span>→</span>{" "}
              <span className="font-normal">
                Concernée, par exemple, par les services écosystémiques
              </span>
            </EmojiListItem>
          </ul>
        </li>
      </ul>
    </StepView>
  );
}
