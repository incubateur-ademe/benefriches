import EmojiListItem from "../shared/emoji-li-item/StepEmojiListItem";
import MonetizedImpactInfoModal from "./MonetizedImpactInfoModal";
import StepView from "./StepView";

type Props = {
  onNextClick: () => void;
  canSkipOnboarding: boolean;
  skipOnboarding: () => void;
};

const EMOJI_CLASSES = { emoji: "bg-success-ultralight" };

export default function Step1({ onNextClick, canSkipOnboarding, skipOnboarding }: Props) {
  return (
    <StepView
      htmlTitle="Types d'impacts - Introduction - Impacts du projet"
      title={
        <>
          Bénéfriches calcule{" "}
          <span className="bg-success-ultralight dark:text-black">5 types d'impacts</span>.
        </>
      }
      onNextClick={onNextClick}
      canSkipOnboarding={canSkipOnboarding}
      skipOnboarding={skipOnboarding}
    >
      <ul className="font-bold space-y-4">
        <li className="text-xl">
          <div className="mb-4">Des impacts monétaires :</div>
          <ul className="text-base list-none space-y-2">
            <EmojiListItem emoji="🏦" classes={EMOJI_CLASSES}>
              Impacts économiques pour la collectivité <span>→</span>{" "}
              <span className="font-normal">Exemple : recettes fiscales</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰👩🏻" smallText classes={EMOJI_CLASSES}>
              Impacts sociaux monétarisés pour les riverains <span>→</span>{" "}
              <span className="font-normal">Exemple : dépenses de déplacement évitées</span>
            </EmojiListItem>
            <EmojiListItem emoji="💰🌳" smallText classes={EMOJI_CLASSES}>
              Impacts environnementaux monétarisés pour l'humanité et la société française{" "}
              <span>→</span>{" "}
              <span className="font-normal">Exemple : valeur monétaire de la décarbonation</span>
            </EmojiListItem>
          </ul>
          <MonetizedImpactInfoModal />
        </li>

        <li className="text-xl">
          <div className="mb-4">Des impacts non-monétaires :</div>
          <ul className="text-base list-none space-y-2">
            <EmojiListItem emoji="🏘️️" classes={EMOJI_CLASSES}>
              Impacts sociaux <span>→</span>{" "}
              <span className="font-normal">Exemple : nombre d'emplois</span>
            </EmojiListItem>
            <EmojiListItem emoji="🌳" classes={EMOJI_CLASSES}>
              Impacts environnementaux <span>→</span>{" "}
              <span className="font-normal">Exemple : émissions de CO2-eq évitées </span>
            </EmojiListItem>
          </ul>
        </li>
      </ul>
    </StepView>
  );
}
