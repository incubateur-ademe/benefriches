import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SpeechBubble from "@/shared/views/components/SpeechBubble/SpeechBubble";

type Props = {
  showsAvoidedCosts: boolean;
  onNext: () => void;
  onBack: () => void;
};

const HEADING_ID = "site-impacts-introduction-heading";

type ImpactCard = {
  emoji: string;
  emojiBackgroundClassName: string;
  text: string;
};

const IMPACTS_CARD: ImpactCard = {
  emoji: "📊",
  emojiBackgroundClassName: "bg-[#E6F1FE]",
  text: "Les impacts sur les finances de la collectivité, l'emploi, l'environnement et la qualité de vie des riverains",
};

const OFFSET_YEAR_CARD: ImpactCard = {
  emoji: "📅",
  emojiBackgroundClassName: "bg-[#F2E3E3]",
  text: "L'année où les impacts compensent le bilan de l'opération",
};

const AVOIDED_COSTS_CARD: ImpactCard = {
  emoji: "💰",
  emojiBackgroundClassName: "bg-[#F6ECC0]",
  text: "Les coûts évités grâce à la reconversion de la friche",
};

function SiteImpactsIntroduction({ showsAvoidedCosts, onNext, onBack }: Props) {
  const cards = showsAvoidedCosts
    ? [IMPACTS_CARD, OFFSET_YEAR_CARD, AVOIDED_COSTS_CARD]
    : [IMPACTS_CARD, OFFSET_YEAR_CARD];

  return (
    <section className="px-6 lg:max-w-3xl">
      <SpeechBubble>
        <h2 id={HEADING_ID} className={classNames(fr.cx("fr-text--lg", "fr-text--bold"), "mb-4")}>
          Voilà ce que Bénéfriches va analyser pour vous&nbsp;:
        </h2>
        <ul aria-labelledby={HEADING_ID} className="list-none m-0 p-0 flex flex-col gap-3">
          {cards.map(({ emoji, emojiBackgroundClassName, text }) => (
            <li
              key={emoji}
              className="flex items-center gap-4 p-3 m-0 rounded-[8px] border border-solid border-border-grey"
            >
              <span
                aria-hidden="true"
                className={classNames(
                  "flex size-12 shrink-0 items-center justify-center rounded-[8px] text-2xl",
                  emojiBackgroundClassName,
                )}
              >
                {emoji}
              </span>
              <span className="font-bold">{text}</span>
            </li>
          ))}
        </ul>
      </SpeechBubble>
      <div className="mt-8">
        <BackNextButtonsGroup onBack={onBack} onNext={onNext} />
      </div>
    </section>
  );
}

export default SiteImpactsIntroduction;
