import { fr } from "@codegouvfr/react-dsfr";

import SectionTitle from "./SectionTitle";

export default function DataSourcesSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w")}>
      <div className="md:flex md:gap-4">
        <div className="md:pr-6 pt-8 md:pt-0">
          <SectionTitle>Des données de haute qualité</SectionTitle>
          <p className={fr.cx("fr-text--xl")}>
            <strong>
              Pour pouvoir calculer les impacts, Bénéfriches utilise des données et des valeurs
              monétaires reconnues, fiables et sourcées.
            </strong>
          </p>
          <p className={fr.cx("fr-text--sm")}>
            Instructions du gouvernement, rapports de France Stratégie ou du Secrétariat général
            pour l'investissement, enquêtes et statistiques de l'INSEE, publications du
            Commissiariat Général au Développement Durable, de l'EFESE, de l'ADEME, du Shift
            Project, outils de l'ADEME (ALDO, Base Empreinte), rapports scientifiques... Au total,
            ce sont plus de 50 sources qui sont utilisées par l'outil.
          </p>
        </div>
        <div className="md:pl-6 m-auto">
          <div className="mb-10 hidden md:flex justify-between items-center">
            <img src="/img/logos/logo-ademe.svg" aria-hidden="true" alt="" height="80px" />
            <img src="/img/logos/logo-aldo.svg" aria-hidden="true" alt="" height="50px" />
            <img src="/img/logos/logo-insee.svg" aria-hidden="true" alt="" height="80px" />
          </div>
          <div className="hidden md:flex justify-between gap-6">
            <img src="/img/logos/logo-brgm.svg" aria-hidden="true" alt="" height="80px" />
            <img src="/img/logos/logo-shift-project.svg" aria-hidden="true" alt="" height="80px" />
            <img
              src="/img/logos/logo-france-strategie.svg"
              aria-hidden="true"
              alt=""
              height="80px"
            />
          </div>
          <div className="flex md:hidden gap-8 flex-wrap justify-center">
            <img src="/img/logos/logo-ademe.svg" aria-hidden="true" alt="" height="60px" />
            <img src="/img/logos/logo-aldo.svg" aria-hidden="true" alt="" height="40px" />
            <img src="/img/logos/logo-insee.svg" aria-hidden="true" alt="" height="60px" />
            <img src="/img/logos/logo-brgm.svg" aria-hidden="true" alt="" height="60px" />
            <img src="/img/logos/logo-shift-project.svg" aria-hidden="true" alt="" height="60px" />
            <img
              src="/img/logos/logo-france-strategie.svg"
              aria-hidden="true"
              alt=""
              height="60px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
