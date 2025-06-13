import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { ReactNode } from "react";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import classNames from "@/shared/views/clsx";
import Badge from "@/shared/views/components/Badge/Badge";

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
        badge={
          <Badge small style="default">
            {formerActivity}
          </Badge>
        }
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
          <span>
            <span className={fr.cx("fr-text--md")}>
              <span aria-hidden="true" className={fr.cx("fr-icon-map-pin-2-line", "fr-icon--sm")} />{" "}
              {projectLocation}
            </span>
            <span className="tw-flex tw-justify-between">
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
            </span>
            <span className="tw-flex tw-justify-between">
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
            </span>
          </span>
        }
        imageAlt={`Illustration du projet à ${projectLocation} (${formerActivity})`}
        imageUrl={imgUrl}
        size="small"
        title={projectType}
        titleAs="h3"
        className="tw-mr-6"
      />
    </div>
  );
}

export default function SupportedProjectsSection() {
  return (
    <section className={classNames("tw-py-20", "tw-bg-grey-light", "dark:tw-bg-grey-dark")}>
      <div className={fr.cx("fr-container")}>
        <h2>Les projets accompagnés par Bénéfriches</h2>
        <div className={classNames("tw-flex", "tw-overflow-x-scroll", "tw-mt-10")}>
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
