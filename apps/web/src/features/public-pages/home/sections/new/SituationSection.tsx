import Button from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/shared/views/router";

import SectionTitle from "./SectionTitle";

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="font-medium relative pl-6 before:content-['✔️'] before:absolute before:left-0">
    {children}
  </li>
);

export default function SituationSection() {
  return (
    <section className="bg-white dark:bg-grey-dark py-20" id="votre-projet-d-amenagement">
      <div className="fr-container">
        <SectionTitle>Où en êtes-vous de votre projet d'aménagement ?</SectionTitle>
        <div className="md:grid md:grid-cols-2 gap-6 mt-[60px]">
          <article className="bg-[#EEE9F4] p-10 rounded-xl">
            <img
              className="mb-6"
              src="/img/pictograms/site-nature/friche.svg"
              alt=""
              height="100"
            />
            <h3 className="text-2xl">
              J'ai une friche et je souhaite trouver l'usage le plus adapté.
            </h3>
            <Button disabled>Analyser la compatibilité de ma friche</Button>
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <ul className="list-none p-0">
              <ListItem>7 usages potentiels analysés</ListItem>
              <ListItem>Score de compatibilité entre votre friche et les usages</ListItem>
              <ListItem>
                Possibilité de consulter les impacts socio-économiques de certains usages
              </ListItem>
            </ul>
          </article>
          <article className="bg-[#E2EEF3] p-10 rounded-xl">
            <img className="mb-6" src="/img/pictograms/all-projects.svg" alt="" height="100" />
            <h3 className="text-2xl">
              J'ai un projet sur un site et je souhaite savoir quelles seraient ses retombées.
            </h3>
            <Button linkProps={{ ...routes.onBoardingIntroductionWhy().link }}>
              Évaluer les impacts de mon projet
            </Button>
            <p className="mt-6 mb-2 font-bold">POINTS FORTS :</p>
            <ul className="list-none p-0">
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
