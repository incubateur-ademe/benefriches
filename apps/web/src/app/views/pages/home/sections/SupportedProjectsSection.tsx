import { ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import classNames from "@/shared/views/clsx";

type SupportedProjectCardProps = {
  formerActivity: string;
  projectType: ReactNode;
  projectLocation: string;
  economicBalanceInMillionEuros: number;
  socioEconomicImpactAmountInMillionEuros: number;
  imgUrl: string;
  reportUrl: string;
};

function SupportedProjectCard({
  formerActivity,
  projectType,
  projectLocation,
  economicBalanceInMillionEuros,
  socioEconomicImpactAmountInMillionEuros,
  imgUrl,
  reportUrl,
}: SupportedProjectCardProps) {
  return (
    <div>
      <Card
        background
        classes={{ root: "tw-w-96" }}
        badge={<Badge>{formerActivity}</Badge>}
        border
        footer={
          <Button
            priority="primary"
            linkProps={{ href: reportUrl, rel: "noopener noreferrer", target: "_blank" }}
          >
            Télécharger le cas d'étude
          </Button>
        }
        desc={
          <div>
            <div className={fr.cx("fr-text--md")}>
              <span aria-hidden="true" className={fr.cx("fr-icon-map-pin-2-line", "fr-icon--sm")} />{" "}
              {projectLocation}
            </div>
            <div className="tw-flex tw-justify-between">
              <span className={fr.cx("fr-text--sm", "fr-m-0")}>Bilan de l'opération :</span>
              <span
                className={classNames(
                  fr.cx("fr-text--sm", "fr-m-0", "fr-text--bold"),
                  economicBalanceInMillionEuros > 0
                    ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                    : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
                )}
              >
                {economicBalanceInMillionEuros > 0 ? "+" : ""}
                &nbsp;
                {formatNumberFr(economicBalanceInMillionEuros)}&nbsp;M&nbsp;€
              </span>
            </div>
            <div className="tw-flex tw-justify-between">
              <span className={fr.cx("fr-text--sm", "fr-m-0")}>Impacts socio-économiques :</span>
              <span
                className={classNames(
                  fr.cx("fr-text--sm", "fr-m-0", "fr-text--bold"),
                  socioEconomicImpactAmountInMillionEuros > 0
                    ? "tw-text-impacts-positive-main dark:tw-text-impacts-positive-light"
                    : "tw-text-impacts-negative-main dark:tw-text-impacts-negative-light",
                )}
              >
                {socioEconomicImpactAmountInMillionEuros > 0 ? "+" : ""}
                &nbsp;
                {formatNumberFr(socioEconomicImpactAmountInMillionEuros)}&nbsp;M&nbsp;€
              </span>
            </div>
          </div>
        }
        imageAlt={`Illustration du projet à ${projectLocation} (${formerActivity})`}
        imageUrl={imgUrl}
        size="small"
        title={projectType}
        titleAs="h3"
        className={fr.cx("fr-mr-3w")}
      />
    </div>
  );
}

export default function SupportedProjectsSection() {
  return (
    <section className={classNames(fr.cx("fr-py-10w"), "tw-bg-grey-light", "dark:tw-bg-grey-dark")}>
      <div className={fr.cx("fr-container")}>
        <h2>Les projets accompagnés par Bénéfriches</h2>
        <div className={classNames("tw-flex", "tw-overflow-x-scroll", fr.cx("fr-mt-5w"))}>
          <SupportedProjectCard
            projectType="Voirie, parking relais, espaces paysagers et ZMEL"
            projectLocation="Balaruc-les-Bains (34)"
            formerActivity="Ancienne raffinerie"
            economicBalanceInMillionEuros={-11.4}
            socioEconomicImpactAmountInMillionEuros={1.4}
            imgUrl="/img/friche-balaruc.jpeg"
            reportUrl="https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-balaruc.pdf"
          />
          <SupportedProjectCard
            projectType={
              // this style makes sure the title takes as much height as other cards which are longer
              <span className="tw-block tw-mb-[28px]">Zone d'activité économique</span>
            }
            projectLocation="Melun Val de Seine (77)"
            formerActivity="Friche partielle"
            economicBalanceInMillionEuros={-4.1}
            socioEconomicImpactAmountInMillionEuros={1.7}
            imgUrl="/img/friche-melun.jpeg"
            reportUrl="https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-camvs-site-a.pdf"
          />
          <SupportedProjectCard
            projectType="Zone d'activité, dépôt bus et maraîchage"
            projectLocation="Grand Paris Sud Est Avenir"
            formerActivity="Friche industrielle"
            economicBalanceInMillionEuros={-6.5}
            socioEconomicImpactAmountInMillionEuros={10.1}
            imgUrl="/img/friche-paris-sud-avenir.jpeg"
            reportUrl="https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-gpsea.pdf"
          />
          <SupportedProjectCard
            projectType="Bureaux, commerces et espace vert"
            projectLocation="Melun Val de Seine (77)"
            formerActivity="Friche administrative"
            economicBalanceInMillionEuros={-3.8}
            socioEconomicImpactAmountInMillionEuros={26.8}
            imgUrl="/img/friche-melun-2.jpeg"
            reportUrl="https://librairie.ademe.fr/ged/3687/benefriches-fiche-presentation-resultats-camvs-site-b.pdf"
          />
        </div>
      </div>
    </section>
  );
}
