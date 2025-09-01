import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useState } from "react";

import classNames from "@/shared/views/clsx";

import SectionTitle from "./SectionTitle";

type AccordionProps = {
  label: string;
  children: ReactNode;
};

function Accordion({ label, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <div>
      <div
        className={classNames(
          "py-2 px-4 mb-4",
          "rounded-sm border border-solid border-transparent",
          "bg-impacts-main dark:bg-black",
          "cursor-pointer",
          "transition ease-in-out duration-500",
          "hover:border-grey-dark hover:dark:border-white",
          "flex items-center gap-2",
        )}
        onClick={toggle}
      >
        <Button
          className={classNames("text-black dark:text-white")}
          iconId={isOpen ? "fr-icon-arrow-up-s-fill" : "fr-icon-arrow-down-s-fill"}
          onClick={toggle}
          size="small"
          priority="tertiary no outline"
          title={isOpen ? "Fermer la section" : "Afficher la section"}
        />
        <h2 className="text-lg mb-0">{label}</h2>
      </div>
      {isOpen && <div className="px-4">{children}</div>}
    </div>
  );
}

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const faqData: FaqItem[] = [
  {
    question: "🏗️ Quels projets d'aménagement sont évaluables sur Bénéfriches ?",
    answer: (
      <div>
        <p>Sur Bénéfriches, vous pouvez créer les projets suivants :</p>
        <ul>
          <li>Projets urbains (quartier résidentiel, nouvelle centralité, équipement public...)</li>
          <li>Zone d'activité économique (zone commerciale, zone industrielle, bureaux...)</li>
          <li>Centrale photovoltaïque</li>
          <li>Espace de nature</li>
        </ul>
        <p>
          À partir de 2025, d'autres viendront : ferme urbaine, centrale agrivoltaïque, centrale
          géothermique, centrale biomasse.
        </p>
      </div>
    ),
  },
  {
    question: "🏭 J'ai une friche mais je ne sais pas quoi en faire. Pouvez-vous me conseiller ?",
    answer: "À rédiger",
  },
  {
    question: "🌾 Puis-je évaluer un projet ailleurs que sur une friche ?",
    answer: "À rédiger",
  },
  {
    question: "🗓️ À quelle phase de mon projet Bénéfriches est-il le plus adapté ?",
    answer: "À rédiger",
  },
  {
    question:
      "📁 J'ai peu d'informations concernant mon site ou mon projet, puis-je quand même utiliser Bénéfriches ?",
    answer: "À rédiger",
  },
  {
    question: "⚙️ Comment fonctionne Bénéfriches ?",
    answer: "À rédiger",
  },
  {
    question: "📊 Quels sont les impacts calculés par Bénéfriches ?",
    answer: "À rédiger",
  },
];

export default function FaqSection() {
  return (
    <section className="py-20 bg-grey-light dark:bg-grey-dark">
      <div className="fr-container mx-auto">
        <SectionTitle>Questions fréquentes</SectionTitle>
        <div className="space-y-6">
          {faqData.map((item, index) => (
            <Accordion key={index} label={item.question}>
              {item.answer}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
