import { fr } from "@codegouvfr/react-dsfr";
import CallToActionSection from "./sections/CallToActionSection";
import DataSourcesSection from "./sections/DataSourcesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import IntroSection from "./sections/IntroSection";
import MilestonesSection from "./sections/MilestonesSection";
import TargetsSection from "./sections/TargetsSection";

function HomePage() {
  return (
    <>
      <IntroSection />
      <TargetsSection />
      <DataSourcesSection />
      <HowItWorksSection />
      <section className={fr.cx("fr-container", "fr-py-10w")}>
        <div className={fr.cx("fr-grid-row")}>
          <div className={fr.cx("fr-col-6")}>
            <h2>Bénéfriches aide les collectivités à préserver les sols</h2>
            <p>
              La reconquête des friches est une opportunité pour atteindre les objectifs de{" "}
              <strong>zéro artificialisation nette</strong>. Toutefois, le passé et l’état de
              celles-ci nécessitent une remise en état qui coûte cher. Cela bloque bon nombre de
              projets, notamment dans les zones où le marché immobilier est peu porteur et pour des
              projets dont les usages ne génèrent pas ou peu de recettes (renaturation, production
              d’énergies renouvelables, etc.)
            </p>
            <p>
              Ce constat repose sur un prisme d’analyse uniquement fondé sur un bilan économique ;
              il ne prend pas en considération les nombreux{" "}
              <strong>effets et retombées positifs</strong> que la réalisation d’un projet
              d’aménagement sur une friche génère à court, moyen et long terme (ex : amélioration de
              l’attractivité d’un quartier, réduction du besoin en infrastructures et en
              déplacements et effets GES associés, maintien de capacité de stockage de carbone dans
              les sols, etc.)
            </p>
            <p>
              Ainsi de nombreux projets de reconversion de friche restent bloqués et{" "}
              <strong>la consommation d’espaces naturels, agricoles et forestiers progresse</strong>
              .
            </p>
            <p>
              Bénéfriches a été développé pour quantifier et monétariser les impacts
              socio-économiques de la reconversion de friche afin que les acteurs de l’aménagement,
              au premier rang desquels les collectivités,{" "}
              <strong>en prennent conscience et les utilisent dans la prise de décision</strong>.
            </p>
          </div>
          <div className={fr.cx("fr-col-6", "fr-my-auto", "fr-pl-10w")}>
            <img src="/img/project-illustration.jpeg" className={fr.cx("fr-responsive-img")} />
          </div>
        </div>
      </section>
      <MilestonesSection />
      <CallToActionSection />
    </>
  );
}

export default HomePage;
