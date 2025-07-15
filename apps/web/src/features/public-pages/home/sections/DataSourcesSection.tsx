import { fr } from "@codegouvfr/react-dsfr";

export default function DataSourcesSection() {
  return (
    <section className={fr.cx("fr-container", "fr-py-10w")}>
      <div className="md:tw-flex md:tw-gap-4">
        <div className="md:tw-pr-12 tw-m-auto tw-order-last md:tw-order-first">
          <div className="tw-mb-10 tw-hidden md:tw-flex tw-justify-between tw-items-center">
            <img src="/img/logos/logo-ademe.svg" aria-hidden="true" alt="" height="80px" />
            <img src="/img/logos/logo-aldo.svg" aria-hidden="true" alt="" height="50px" />
            <img src="/img/logos/logo-insee.svg" aria-hidden="true" alt="" height="80px" />
          </div>
          <div className="tw-hidden md:tw-flex tw-justify-between">
            <img src="/img/logos/logo-brgm.svg" aria-hidden="true" alt="" height="80px" />
            <img src="/img/logos/logo-shift-project.svg" aria-hidden="true" alt="" height="80px" />
            <img
              src="/img/logos/logo-france-strategie.svg"
              aria-hidden="true"
              alt=""
              height="80px"
            />
          </div>
          <div className="tw-flex md:tw-hidden tw-gap-8 tw-flex-wrap tw-justify-center">
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
        <div className="md:tw-pl-12 tw-pt-8 md:tw-pt-0">
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
