import { fr } from "@codegouvfr/react-dsfr";

export default function DataSourcesSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div
          className={"fr-col-12 fr-col-md-6 fr-pr-md-6w fr-m-auto tw-order-last md:tw-order-first"}
        >
          <div className="fr-mb-5w tw-hidden md:tw-flex tw-justify-between tw-items-center">
            <img src="/img/logos/logo-ademe.svg" alt="Logo de l'ADEME" height="80px" />
            <img src="/img/logos/logo-aldo.svg" alt="Logo de l'outil Aldo" height="50px" />
            <img src="/img/logos/logo-insee.svg" alt="Logo de l'INSEE" height="80px" />
          </div>
          <div className="tw-hidden md:tw-flex tw-justify-between">
            <img src="/img/logos/logo-brgm.svg" alt="Logo du BRGM" height="80px" />
            <img
              src="/img/logos/logo-shift-project.svg"
              alt="Logo du Shift Project"
              height="80px"
            />
            <img
              src="/img/logos/logo-france-strategie.svg"
              alt="Logo de France Stratégie"
              height="80px"
            />
          </div>
          <div className="tw-flex md:tw-hidden tw-gap-8 tw-flex-wrap tw-justify-center">
            <img src="/img/logos/logo-ademe.svg" alt="Logo de l'ADEME" height="60px" />
            <img src="/img/logos/logo-aldo.svg" alt="Logo de l'outil Aldo" height="40px" />
            <img src="/img/logos/logo-insee.svg" alt="Logo de l'INSEE" height="60px" />
            <img src="/img/logos/logo-brgm.svg" alt="Logo du BRGM" height="60px" />
            <img
              src="/img/logos/logo-shift-project.svg"
              alt="Logo du Shift Project"
              height="60px"
            />
            <img
              src="/img/logos/logo-france-strategie.svg"
              alt="Logo de France Stratégie"
              height="60px"
            />
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-6", "fr-pl-md-6w")}>
          <h2>Des données de haute qualité</h2>
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
      </div>
    </section>
  );
}
