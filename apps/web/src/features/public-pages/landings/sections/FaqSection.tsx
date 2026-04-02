import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

import Accordion from "@/shared/views/components/Accordion/Accordion";

import SectionTitle from "./SectionTitle";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

const faqData: FaqItem[] = [
  {
    question: "🏗️️ Quels projets d'aménagement sont évaluables sur Bénéfriches ?",
    answer: (
      <div>
        <p>Sur Bénéfriches, vous pouvez évaluer les projets suivants :</p>
        <ul>
          <li>Projets urbains (quartier résidentiel, nouvelle centralité, équipement public...)</li>
          <li>Zone d'activités économiques (zone commerciale, zone industrielle, bureaux...)</li>
          <li>Centrale photovoltaïque</li>
          <li>Espace de nature</li>
        </ul>
        <p>À partir de 2025, d'autres viendront : ferme urbaine, centrale agrivoltaïque.</p>
      </div>
    ),
  },
  {
    question: "🏭 J'ai une friche mais je ne sais pas quoi en faire. Pouvez-vous me conseiller ?",
    answer:
      "Tout à fait ! Bénéfriches est capable de calculer la compatibilité de votre friche, c'est-à-dire la pertinence que pourrait avoir chaque projet d'aménagement (projet urbain, renaturation, photovoltaïque...) sur votre friche.",
  },
  {
    question: "🌾 Puis-je évaluer un projet ailleurs que sur une friche ?",
    answer: (
      <div>
        <p>
          Sur Bénéfriches, vous pouvez créer les sites suivants, sur lesquels vous pourrez évaluer
          votre projet :
        </p>
        <ul>
          <li>Friche</li>
          <li>Zone urbaine (zone d'habitation, zone d'activités économiques...)</li>
          <li>Espace de nature (prairie, forêt...)</li>
          <li>Exploitation agricole (culture, maraîchage, élevage...)</li>
        </ul>
      </div>
    ),
  },
  {
    question: "🗓️ À quelle phase de mon projet Bénéfriches est-il le plus adapté ?",
    answer:
      "À n'importe quel moment ! Que vous soyez en phase de montage, de programmation ou de conception, Bénéfriches s'adapte à votre niveau d'avancement. Mais plus vous l'utiliserez en phases amont, plus vous aurez de marges de manœuvre pour adapter votre projet pour en maximiser les impacts !",
  },
  {
    question:
      "📁 J'ai peu d'informations concernant mon site ou mon projet, puis-je quand même utiliser Bénéfriches ?",
    answer: (
      <>
        <p>
          Oui ! Bénéfriches vous propose un maximum de données pré-remplies au moment de renseigner
          votre site et votre projet.
        </p>
        <p>
          Et si vous manquez vraiment d'info, vous pouvez même créer un site démo et un projet démo
          en seulement 3 questions (sur la base du retour d'expérience de l'ADEME et de données de
          référence) !
        </p>
      </>
    ),
  },
  {
    question: "⚙️ Comment fonctionne Bénéfriches ?",
    answer: (
      <>
        <p>
          Bénéfriches repose sur les principes de l'analyse coûts-bénéfices, qui a pour objet
          d'apprécier l'intérêt d'une opération (projet ou investissement), sur une période donnée.
          Elle est réalisée en analysant les impacts du projet sur les différents types d'acteurs
          directement ou indirectement concernés, que ces impacts soient positifs ou négatifs (ex :
          tonnes de CO2 évitées, surfaces désimperméabilisées).
        </p>
        <p>
          Puis en les comparant au bilan de l'opération (recettes vs. dépenses nécessaires à sa
          réalisation) qui est exprimé en €.
        </p>
        <p>
          Pour pouvoir effectuer cette comparaison il est nécessaire de convertir les valeurs
          d'impacts en valeurs monétaires. On parle alors de "monétarisation".
        </p>
      </>
    ),
  },
  {
    question: "📊 Quels sont les impacts calculés par Bénéfriches ?",
    answer: (
      <>
        <p>
          Bénéfriches calcule tous les impacts de votre projet, regroupés au sein de 6 familles, sur
          la base d'un ou plusieurs indicateurs.
        </p>
        <p>4 familles d'impacts sont exprimées sous forme monétaire :</p>
        <ul>
          <li>Impacts économiques directs (exemple d'indicateur : fiscalité)</li>
          <li>
            Impacts économiques indirects (exemple d'indicateur : dépenses de sécurisation d'un
            site)
          </li>
          <li>
            Impacts sociaux monétarisés (exemple d'indicateur : temps passé en moins dans les
            transports)
          </li>
          <li>
            Impacts environnementaux monétarisés (exemple d'indicateur : valeur monétaire des
            services écosystémiques)
          </li>
        </ul>
        <p>2 autres familles proposent des impacts non-monétarisés :</p>
        <ul>
          <li>Impacts sociaux (exemple d'indicateur : emplois)</li>
          <li>Impacts environnementaux (exemple d'indicateur : surface polluée)</li>
        </ul>
        <p>
          Ces 2 impacts non-monétarisés sont utilisés pour calculer les 2 impacts monétarisés
          (sociaux et environnementaux).
        </p>
      </>
    ),
  },
];

export default function FaqSection() {
  return (
    <section className="py-20 bg-grey-light dark:bg-blue-ultradark">
      <div className="fr-container mx-auto">
        <SectionTitle>Questions fréquentes</SectionTitle>
        <div className="space-y-6">
          {faqData.map((item) => (
            <Accordion key={item.question} label={item.question}>
              {item.answer}
            </Accordion>
          ))}
        </div>
        <div className="flex mt-6 gap-2 items-center">
          <p className="my-0 text-sm font-medium">D'autres questions ? </p>
          <Button
            data-tally-open="mOVXLY"
            data-tally-width="400"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
            data-tally-auto-close="0"
            data-url={window.location.href}
            size="small"
            priority="tertiary no outline"
            aria-label="Besoin d'aide ?"
          >
            Contactez l'équipe Bénéfriches
          </Button>
        </div>
      </div>
    </section>
  );
}
