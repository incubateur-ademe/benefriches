import { SiteNature, sumListWithKey } from "shared";

import { AvoidedInactionCostsAnalysisDataView } from "@/features/projects/application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";
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

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
  projectEconomicBalance: Exclude<
    AvoidedInactionCostsAnalysisDataView["projectEconomicBalance"],
    undefined
  >;
  siteStatuQuoImpactsByBearerAndCategory: Exclude<
    AvoidedInactionCostsAnalysisDataView["siteStatuQuoIndirectEconomicImpactsByBearerAndCategory"],
    undefined
  >;
  projectImpactsByBearerAndCategory: Exclude<
    AvoidedInactionCostsAnalysisDataView["projectOnSiteIndirectEconomicImpactsByBearerAndCategory"],
    undefined
  >;
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
  siteStatuQuoImpactsByBearerAndCategory,
  projectImpactsByBearerAndCategory,
  projectEconomicBalance,
}: Props) {
  const isBearerSectionVisible = (bearer: "localAuthority" | "localPeopleOrCompany" | "humanity") =>
    siteStatuQuoImpactsByBearerAndCategory[bearer].total !== 0 ||
    projectImpactsByBearerAndCategory[bearer].total !== 0;

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
        projectValue={projectImpactsByBearerAndCategory.total}
        scenarioValue={siteStatuQuoImpactsByBearerAndCategory.total}
      />
      <ComparisonMonetaryRow
        label="Total coût-bénéfice"
        totalRow
        projectValue={projectEconomicBalance.total + projectImpactsByBearerAndCategory.total}
        scenarioValue={siteStatuQuoImpactsByBearerAndCategory.total}
      />

      <SectionHeader>Détails des impacts socio-économiques</SectionHeader>

      <ComparisonMonetaryRow
        label="🏛️ Pour la collectivité locale"
        labelBold
        projectValue={projectImpactsByBearerAndCategory.localAuthority.total}
        scenarioValue={siteStatuQuoImpactsByBearerAndCategory.localAuthority.total}
      />
      <ComparisonMonetaryRow
        label="🏘 Pour les riverains"
        labelBold
        projectValue={projectImpactsByBearerAndCategory.localPeopleOrCompany.total}
        scenarioValue={siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total}
      />
      <ComparisonMonetaryRow
        label="🌍 Pour la société"
        labelBold
        projectValue={projectImpactsByBearerAndCategory.humanity.total}
        scenarioValue={siteStatuQuoImpactsByBearerAndCategory.humanity.total}
      />

      {isBearerSectionVisible("localAuthority") && (
        <>
          <SectionHeader>Impacts économiques pour la collectivité locale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={0}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localAuthority.fricheCosts ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔧 Dépenses communales"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localAuthority.municipalityExpenses ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localAuthority.municipalityExpenses ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏛 Recettes fiscales"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localAuthority.taxesIncome ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localAuthority.taxesIncome ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localAuthority.operatingEconomicBalance ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localAuthority.operatingEconomicBalance ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localAuthority.rentalIncome ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localAuthority.rentalIncome ?? [],
              "total",
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la collectivité locale"
            labelBold
            totalRow
            projectValue={projectImpactsByBearerAndCategory.localAuthority.total}
            scenarioValue={siteStatuQuoImpactsByBearerAndCategory.localAuthority.total}
          />
        </>
      )}

      {isBearerSectionVisible("localPeopleOrCompany") && (
        <>
          <SectionHeader>Impacts économiques pour les riverains</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🏚️ Dépenses liées à la friche"
            left={0}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.fricheCosts ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="👛 Pouvoir d'achat supplémentaire"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localPeopleOrCompany.purchasingPowerIncrease ?? [],
              "total",
            )}
            right={0}
          />

          <ComparisionDetailsMonetaryRow
            label="💰 Bénéfice d'exploitation"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localPeopleOrCompany.operatingEconomicBalance ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany
                .operatingEconomicBalance ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🔑 Revenu locatif"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localPeopleOrCompany.rentalIncome ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.rentalIncome ?? [],
              "total",
            )}
          />

          <ComparisionDetailsMonetaryRow
            label="🏡 Valeur patrimoniale supplémentaire autour de la friche"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.localPeopleOrCompany.localPropertyValueIncrease ??
                [],
              "total",
            )}
            right={0}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour les riverains"
            labelBold
            totalRow
            projectValue={projectImpactsByBearerAndCategory.localPeopleOrCompany.total}
            scenarioValue={siteStatuQuoImpactsByBearerAndCategory.localPeopleOrCompany.total}
          />
        </>
      )}

      {isBearerSectionVisible("humanity") && (
        <>
          <SectionHeader>Impacts économiques pour la société française et mondiale</SectionHeader>

          <ComparisionDetailsMonetaryRow
            label="🫀 Économies sur les dépenses de santé"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.humanity.avoidedHealthExpenses ?? [],
              "total",
            )}
            right={0}
          />

          <ComparisionDetailsMonetaryRow
            label="🌿 Valeur de l'action environnementale"
            left={sumListWithKey(
              projectImpactsByBearerAndCategory.humanity.environmentalAction ?? [],
              "total",
            )}
            right={sumListWithKey(
              siteStatuQuoImpactsByBearerAndCategory.humanity.environmentalAction ?? [],
              "total",
            )}
          />

          <ComparisonMonetaryRow
            label="Total des impacts pour la société"
            labelBold
            totalRow
            projectValue={projectImpactsByBearerAndCategory.humanity.total}
            scenarioValue={siteStatuQuoImpactsByBearerAndCategory.humanity.total}
          />
        </>
      )}
    </ComparisonGrid>
  );
}
