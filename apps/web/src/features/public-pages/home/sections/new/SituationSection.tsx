import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/shared/views/router";

import SectionTitle from "./SectionTitle";

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="tw-font-medium tw-relative tw-pl-6 before:tw-content-['✔️'] before:tw-absolute before:tw-left-0">
    {children}
  </li>
);

export default function SituationSection() {
  return (
    <section className="tw-bg-white tw-py-20" id="votre-projet-d-amenagement">
      <div className="fr-container">
        <SectionTitle>Où en êtes-vous de votre projet d'aménagement ?</SectionTitle>
        <div className="md:tw-grid md:tw-grid-cols-2 tw-gap-6 tw-mt-[60px]">
          <article className="tw-bg-[#EEE9F4] tw-p-10 tw-rounded-xl">
            <img
              className="tw-mb-6"
              src="/img/pictograms/site-nature/friche.svg"
              alt=""
              height="100"
            />
            <h3 className="tw-text-2xl">
              J'ai une friche et je souhaite trouver l'usage le plus adapté.
            </h3>
            <Button disabled>Analyser la compatibilité de ma friche</Button>
            <p className="tw-mt-6 tw-mb-2 tw-font-bold">POINTS FORTS :</p>
            <ul className="tw-list-none tw-p-0">
              <ListItem>7 usages potentiels analysés</ListItem>
              <ListItem>Score de compatibilité entre votre friche et les usages</ListItem>
              <ListItem>
                Possibilité de consulter les impacts socio-économiques de certains usages
              </ListItem>
            </ul>
          </article>
          <article className="tw-bg-[#E2EEF3] tw-p-10 tw-rounded-xl">
            <img className="tw-mb-6" src="/img/pictograms/all-projects.svg" alt="" height="100" />
            <h3 className="tw-text-2xl">
              J'ai un projet sur un site et je souhaite savoir quelles seraient ses retombées.
            </h3>
            <Button linkProps={{ ...routes.onBoardingIntroductionWhy().link }}>
              Évaluer les impacts de mon projet
            </Button>
            <p className="tw-mt-6 tw-mb-2 tw-font-bold">POINTS FORTS :</p>
            <ul className="tw-list-none tw-p-0">
              <ListItem>Jusqu'à 90 indicateurs calculés</ListItem>
              <ListItem>Sur une durée de 1 à 50 ans</ListItem>
              <ListItem>
                Possibilité de comparer les impacts du projet avec ceux d'autres projets
              </ListItem>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
