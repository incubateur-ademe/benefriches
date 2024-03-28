import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { Card } from "@codegouvfr/react-dsfr/Card";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type SupportedProjectCardProps = {
  formerActivity: string;
  projectType: string;
  projectLocation: string;
  economicBalanceInMillionEuros: number;
  socioEconomicImpactAmountInMillionEuros: number;
  imgUrl: string;
};

function SupportedProjectCard({
  formerActivity,
  projectType,
  projectLocation,
  economicBalanceInMillionEuros,
  socioEconomicImpactAmountInMillionEuros,
  imgUrl,
}: SupportedProjectCardProps) {
  return (
    <div>
      <Card
        background
        badge={<Badge>{formerActivity}</Badge>}
        style={{ width: "360px", minHeight: "480px" }}
        border
        desc={
          <div>
            <div className={fr.cx("fr-text--md")}>
              <span aria-hidden="true" className={fr.cx("fr-icon-map-pin-2-line", "fr-icon--sm")} />{" "}
              {projectLocation}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={fr.cx("fr-text--sm", "fr-m-0")}>Bilan de l'opération :</span>
              <span
                className={fr.cx("fr-text--sm", "fr-m-0", "fr-text--bold")}
                style={{ color: economicBalanceInMillionEuros > 0 ? "#18753C" : "#CE0500" }}
              >
                {economicBalanceInMillionEuros > 0 ? "+" : ""}
                &nbsp;
                {formatNumberFr(economicBalanceInMillionEuros)}&nbsp;M&nbsp;€
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className={fr.cx("fr-text--sm", "fr-m-0")}>Impacts socio-économiques :</span>
              <span
                className={fr.cx("fr-text--sm", "fr-m-0", "fr-text--bold")}
                style={{
                  color: socioEconomicImpactAmountInMillionEuros > 0 ? "#18753C" : "#CE0500",
                }}
              >
                {socioEconomicImpactAmountInMillionEuros > 0 ? "+" : ""}
                &nbsp;
                {formatNumberFr(socioEconomicImpactAmountInMillionEuros)}&nbsp;M&nbsp;€
              </span>
            </div>
          </div>
        }
        imageAlt={`Illustration du projet ${projectType} à ${projectLocation}`}
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
    <section className={fr.cx("fr-py-10w")} style={{ background: "#F6F6F6" }}>
      <div className={fr.cx("fr-container")}>
        <h2>Les projets accompagnés par Bénéfriches</h2>
        <div style={{ display: "flex", overflowX: "scroll" }} className={fr.cx("fr-mt-5w")}>
          <SupportedProjectCard
            projectType="Voirie, parking relais, espaces paysagers et ZMEL"
            projectLocation="Balaruc-les-Bains (34)"
            formerActivity="Ancienne raffinerie"
            economicBalanceInMillionEuros={-11.4}
            socioEconomicImpactAmountInMillionEuros={1.4}
            imgUrl="/img/friche-balaruc.jpeg"
          />
          <SupportedProjectCard
            projectType="Zone d'activité économique"
            projectLocation="Melun Val de Seine (77)"
            formerActivity="Friche partielle"
            economicBalanceInMillionEuros={-4.1}
            socioEconomicImpactAmountInMillionEuros={1.7}
            imgUrl="/img/friche-melun.jpeg"
          />
          <SupportedProjectCard
            projectType="Zone d'activité, dépôt bus et maraîchage"
            projectLocation="Grand Paris Sud Est Avenir"
            formerActivity="Friche industrielle"
            economicBalanceInMillionEuros={-6.5}
            socioEconomicImpactAmountInMillionEuros={10.1}
            imgUrl="/img/friche-paris-sud-avenir.jpeg"
          />
          <SupportedProjectCard
            projectType="Bureaux, commerces et espace vert"
            projectLocation="Melun Val de Seine (77)"
            formerActivity="Friche administrative"
            economicBalanceInMillionEuros={-3.8}
            socioEconomicImpactAmountInMillionEuros={26.8}
            imgUrl="/img/friche-melun-2.jpeg"
          />
        </div>
      </div>
    </section>
  );
}
