import { SiteNature } from "shared";

import { AvoidedInactionCostsAnalysisDataView } from "@/features/projects/application/project-impacts/projectAvoidedCostsAnalysis.selectors";
import { groupIndirectEconomicImpactsByBearer } from "@/features/projects/domain/groupIndirectImpactsByBearer";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import Badge from "@/shared/views/components/Badge/Badge";
import { getPictogramUrlForSiteNature } from "@/shared/views/siteNature";

import { getScenarioPictoUrl } from "../../shared/scenarioType";
import ComparisionDetailsMonetaryRow from "../layout/ComparisionDetailsMonetaryRow";
import ComparisonCell from "../layout/ComparisonCell";
import ComparisonGrid from "../layout/ComparisonGrid";
import ComparisonMonetaryRow from "../layout/ComparisonMonetaryRow";
import ScenarioHeader from "../layout/ScenarioHeader";
import SectionHeader from "../layout/SectionHeader";
import {
  AVOIDED_HEALTH_EXPENSE_NAMES,
  BUYING_POWER_NAMES,
  ECOSYSTEM_SERVICE_NAMES,
  ENVIRONMENTAL_ACTION_NAMES,
  extractByName,
  FRICHE_COST_NAMES,
  PROJECT_MUNICIPALITY_EXPENSE_NAMES,
  SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES,
  TAX_INCOME_NAMES,
} from "../layout/byBearer.helper";

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
  projectEconomicBalance: Exclude<
    AvoidedInactionCostsAnalysisDataView["projectEconomicBalance"],
    undefined
  >;
  siteStatuQuoImpacts: Exclude<
    AvoidedInactionCostsAnalysisDataView["siteStatuQuoIndirectEconomicImpactsData"],
    undefined
  >;
  projectImpacts: Exclude<
    AvoidedInactionCostsAnalysisDataView["projectOnSiteIndirectEconomicImpactsData"],
    undefined
  >;
  stakeholders: Exclude<AvoidedInactionCostsAnalysisDataView["stakeholders"], undefined>;
};

const getTextForSiteNature = (siteNature: SiteNature) => {
  switch (siteNature) {
    case "FRICHE":
      return "la friche";
    case "AGRICULTURAL_OPERATION":
      return "l'exploitation agricole";
    case "NATURAL_AREA":
      return "l'espace de nature";
  }
};

export default function ProjectAvoidedInactionCosts({
  projectType,
  siteNature,
  siteStatuQuoImpacts,
  projectImpacts,
  projectEconomicBalance,
  stakeholders,
}: Props) {
  const siteStatuQuoImpactsByBearer = groupIndirectEconomicImpactsByBearer(
    siteStatuQuoImpacts.details,
    stakeholders,
  );
  const projectImpactsByBearer = groupIndirectEconomicImpactsByBearer(
    projectImpacts.details,
    stakeholders,
  );

  const isBearerSectionVisible = (
    bearer: "local_authority" | "local_people_or_company" | "humanity",
  ) =>
    siteStatuQuoImpactsByBearer[bearer].total !== 0 || projectImpactsByBearer[bearer].total !== 0;

  return (
    <ComparisonGrid>
      <ComparisonCell />
      <ScenarioHeader
        pictoUrl={getScenarioPictoUrl(projectType)}
        label={`Projet sur ${getTextForSiteNature(siteNature)}`}
      />
      <ScenarioHeader
        pictoUrl={getPictogramUrlForSiteNature(siteNature)}
        label="Friche non reconvertie"
        badge={
          siteNature === "FRICHE" && (
            <Badge small style="mutability">
              Coût de l'inaction
            </Badge>
          )
        }
      />

      <SectionHeader>Coût-bénéfice</SectionHeader>

      <ComparisonMonetaryRow
        label="Bilan de l'opération"
        labelBold
        projectValue={projectEconomicBalance.total}
        scenarioValue={0}
      />
      <ComparisonMonetaryRow
        label="Impacts socio-économiques"
        labelBold
        projectValue={projectImpacts.total}
        scenarioValue={siteStatuQuoImpacts.total}
      />
      <ComparisonMonetaryRow
        label="Total coût-bénéfice"
        totalRow
        projectValue={projectEconomicBalance.total + projectImpacts.total}
        scenarioValue={siteStatuQuoImpacts.total}
      />

      <SectionHeader>Détails des impacts socio-économiques</SectionHeader>

      <ComparisonMonetaryRow
        label="🏛️ Pour la collectivité locale"
        labelBold
        projectValue={projectImpactsByBearer.local_authority.total}
        scenarioValue={siteStatuQuoImpactsByBearer.local_authority.total}
      />
      <ComparisonMonetaryRow
        label="🏘 Pour les riverains"
        labelBold
        projectValue={projectImpactsByBearer.local_people_or_company.total}
        scenarioValue={siteStatuQuoImpactsByBearer.local_people_or_company.total}
      />
      <ComparisonMonetaryRow
        label="🌍 Pour la société"
        labelBold
        projectValue={projectImpactsByBearer.humanity.total}
        scenarioValue={siteStatuQuoImpactsByBearer.humanity.total}
      />

      {isBearerSectionVisible("local_authority") && (
        <>
          <SectionHeader>Impacts économiques pour la collectivité locale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={[]}
            right={extractByName(
              siteStatuQuoImpactsByBearer.local_authority.details,
              FRICHE_COST_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔧 Dépenses communales"
            left={extractByName(
              projectImpactsByBearer.local_authority.details,
              PROJECT_MUNICIPALITY_EXPENSE_NAMES,
            )}
            right={extractByName(
              siteStatuQuoImpactsByBearer.local_authority.details,
              SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏛 Recettes fiscales"
            left={extractByName(projectImpactsByBearer.local_authority.details, TAX_INCOME_NAMES)}
            right={extractByName(siteStatuQuoImpactsByBearer.local_authority.details, [
              "taxesIncome",
            ])}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={extractByName(projectImpactsByBearer.local_authority.details, [
              "projectOperatingEconomicBalance",
            ])}
            right={extractByName(siteStatuQuoImpactsByBearer.local_authority.details, [
              "operatingEconomicBalance",
            ])}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={extractByName(projectImpactsByBearer.local_authority.details, [
              "projectedRentalIncome",
            ])}
            right={extractByName(siteStatuQuoImpactsByBearer.local_authority.details, [
              "rentalIncome",
            ])}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la collectivité locale"
            labelBold
            totalRow
            projectValue={projectImpactsByBearer.local_authority.total}
            scenarioValue={siteStatuQuoImpactsByBearer.local_authority.total}
          />
        </>
      )}

      {isBearerSectionVisible("local_people_or_company") && (
        <>
          <SectionHeader>Impacts économiques pour les riverains</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={[]}
            right={extractByName(
              siteStatuQuoImpactsByBearer.local_people_or_company.details,
              FRICHE_COST_NAMES,
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="👛 Pouvoir d'achat supplémentaire"
            left={extractByName(
              projectImpactsByBearer.local_people_or_company.details,
              BUYING_POWER_NAMES,
            )}
            right={[]}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={extractByName(projectImpactsByBearer.local_people_or_company.details, [
              "projectOperatingEconomicBalance",
            ])}
            right={extractByName(siteStatuQuoImpactsByBearer.local_people_or_company.details, [
              "operatingEconomicBalance",
            ])}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={extractByName(projectImpactsByBearer.local_people_or_company.details, [
              "projectedRentalIncome",
            ])}
            right={extractByName(siteStatuQuoImpactsByBearer.local_people_or_company.details, [
              "rentalIncome",
            ])}
          />

          <ComparisionDetailsMonetaryRow
            label="🏡 Valeur patrimoniale supplémentaire autour de la friche"
            left={extractByName(projectImpactsByBearer.local_people_or_company.details, [
              "localPropertyValueIncrease",
            ])}
            right={[]}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour les riverains"
            labelBold
            totalRow
            projectValue={projectImpactsByBearer.local_people_or_company.total}
            scenarioValue={siteStatuQuoImpactsByBearer.local_people_or_company.total}
          />
        </>
      )}

      {isBearerSectionVisible("humanity") && (
        <>
          <SectionHeader>Impacts économiques pour la société française et mondiale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🫀 Économies sur les dépenses de santé"
            left={extractByName(
              projectImpactsByBearer.humanity.details,
              AVOIDED_HEALTH_EXPENSE_NAMES,
            )}
            right={[]}
          />

          <ComparisionDetailsMonetaryRow
            label="🌿 Valeur de l'action environnementale"
            left={extractByName(
              projectImpactsByBearer.humanity.details,
              ENVIRONMENTAL_ACTION_NAMES,
            )}
            right={extractByName(
              siteStatuQuoImpactsByBearer.humanity.details,
              ECOSYSTEM_SERVICE_NAMES,
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la société"
            labelBold
            totalRow
            projectValue={projectImpactsByBearer.humanity.total}
            scenarioValue={siteStatuQuoImpactsByBearer.humanity.total}
          />
        </>
      )}
    </ComparisonGrid>
  );
}
