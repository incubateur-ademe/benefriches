import ImpactSummaryAvoidedCo2eqEmissions from "./impacts/AvoidedCo2eqEmissions";
import ImpactSummaryAvoidedFricheCostsForLocalAuthority from "./impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSummaryFullTimeJobs from "./impacts/FullTimeJobs";
import ImpactSummaryHouseholdsPoweredByRenewableEnergy from "./impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSummaryLocalPropertyValueIncrease from "./impacts/LocalPropertyValueIncrease";
import ImpactSummaryNonContaminatedSurfaceArea from "./impacts/NonContaminatedSurfaceArea";
import ImpactSummaryPermeableSurfaceArea from "./impacts/PermeableSurfaceArea";
import ImpactSummaryProjectBalance from "./impacts/ProjectBalance";
import ImpactSummaryTaxesIncome from "./impacts/TaxesIncome";
import ImpactSummaryZanCompliance from "./impacts/ZanCompliance";

import { ImpactCategoryFilter } from "@/features/projects/application/projectImpacts.reducer";
import { KeyImpactIndicatorData } from "@/features/projects/application/projectKeyImpactIndicators.selectors";

type Props = {
  categoryFilter: ImpactCategoryFilter;
  keyImpactIndicatorsList: KeyImpactIndicatorData[];
};

const PRIORITY_ORDER = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "localPropertyValueIncrease",
  "fullTimeJobs",
  "householdsPoweredByRenewableEnergy",
  "avoidedCo2eqEmissions",
  "permeableSurfaceArea",
  "nonContaminatedSurfaceArea",
];

const ImpactSummaryView = ({ categoryFilter, keyImpactIndicatorsList }: Props) => {
  const displayAll = categoryFilter === "all";
  const displayEconomicCards = displayAll || categoryFilter === "economic";
  const displayEnvironmentCards = displayAll || categoryFilter === "environment";
  const displaySocialCards = displayAll || categoryFilter === "social";

  return (
    <div className="tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8">
      {keyImpactIndicatorsList
        .sort(
          ({ name: aName }, { name: bName }) =>
            PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
        )
        .map(({ name, value, isSuccess }) => {
          switch (name) {
            case "zanCompliance":
              return (
                <ImpactSummaryZanCompliance
                  {...value}
                  isSuccess={isSuccess}
                  descriptionDisplayMode="tooltip"
                />
              );
            case "projectImpactBalance":
              return (
                <ImpactSummaryProjectBalance
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              );

            case "avoidedFricheCostsForLocalAuthority":
              return displayEconomicCards ? (
                <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "taxesIncomesImpact":
              return displayEconomicCards ? (
                <ImpactSummaryTaxesIncome
                  isSuccess={isSuccess}
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "fullTimeJobs":
              return displaySocialCards ? (
                <ImpactSummaryFullTimeJobs
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "avoidedCo2eqEmissions":
              return displayEnvironmentCards ? (
                <ImpactSummaryAvoidedCo2eqEmissions
                  isSuccess={isSuccess}
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "nonContaminatedSurfaceArea":
              return displayEnvironmentCards ? (
                <ImpactSummaryNonContaminatedSurfaceArea
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "permeableSurfaceArea":
              return displayEnvironmentCards ? (
                <ImpactSummaryPermeableSurfaceArea
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "householdsPoweredByRenewableEnergy":
              return displayEnvironmentCards ? (
                <ImpactSummaryHouseholdsPoweredByRenewableEnergy
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "localPropertyValueIncrease":
              return displayEconomicCards ? (
                <ImpactSummaryLocalPropertyValueIncrease
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
          }
        })}
    </div>
  );
};

export default ImpactSummaryView;
