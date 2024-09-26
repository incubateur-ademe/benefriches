import ImpactSynthesisAvoidedCo2eqEmissions from "./impacts/AvoidedCo2eqEmissions";
import ImpactSynthesisAvoidedFricheCostsForLocalAuthority from "./impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSynthesisFullTimeJobs from "./impacts/FullTimeJobs";
import ImpactSynthesisHouseholdsPoweredByRenewableEnergy from "./impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSynthesisLocalPropertyValueIncrease from "./impacts/LocalPropertyValueIncrease";
import ImpactSynthesisNonContaminatedSurfaceArea from "./impacts/NonContaminatedSurfaceArea";
import ImpactSynthesisPermeableSurfaceArea from "./impacts/PermeableSurfaceArea";
import ImpactSynthesisProjectBalance from "./impacts/ProjectBalance";
import ImpactSynthesisTaxesIncome from "./impacts/TaxesIncome";
import ImpactSynthesisZanCompliance from "./impacts/ZanCompliance";

import { ImpactCategoryFilter } from "@/features/projects/application/projectImpacts.reducer";
import { SyntheticImpact } from "@/features/projects/application/projectImpactsSynthetics.selectors";

type Props = {
  categoryFilter: ImpactCategoryFilter;
  syntheticImpactsList: SyntheticImpact[];
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

const ImpactSynthesisView = ({ categoryFilter, syntheticImpactsList }: Props) => {
  const displayAll = categoryFilter === "all";
  const displayEconomicCards = displayAll || categoryFilter === "economic";
  const displayEnvironmentCards = displayAll || categoryFilter === "environment";
  const displaySocialCards = displayAll || categoryFilter === "social";

  return (
    <div className="tw-grid tw-grid-rows-1 lg:tw-grid-cols-3 tw-gap-6 tw-mb-8">
      {syntheticImpactsList
        .sort(
          ({ name: aName }, { name: bName }) =>
            PRIORITY_ORDER.indexOf(aName) - PRIORITY_ORDER.indexOf(bName),
        )
        .map(({ name, value, isSuccess }) => {
          switch (name) {
            case "zanCompliance":
              return (
                <ImpactSynthesisZanCompliance
                  {...value}
                  isSuccess={isSuccess}
                  descriptionDisplayMode="tooltip"
                />
              );
            case "projectImpactBalance":
              return (
                <ImpactSynthesisProjectBalance
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              );

            case "avoidedFricheCostsForLocalAuthority":
              return displayEconomicCards ? (
                <ImpactSynthesisAvoidedFricheCostsForLocalAuthority
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "taxesIncomesImpact":
              return displayEconomicCards ? (
                <ImpactSynthesisTaxesIncome
                  isSuccess={isSuccess}
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "fullTimeJobs":
              return displaySocialCards ? (
                <ImpactSynthesisFullTimeJobs
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "avoidedCo2eqEmissions":
              return displayEnvironmentCards ? (
                <ImpactSynthesisAvoidedCo2eqEmissions
                  isSuccess={isSuccess}
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "nonContaminatedSurfaceArea":
              return displayEnvironmentCards ? (
                <ImpactSynthesisNonContaminatedSurfaceArea
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "permeableSurfaceArea":
              return displayEnvironmentCards ? (
                <ImpactSynthesisPermeableSurfaceArea
                  isSuccess={isSuccess}
                  {...value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "householdsPoweredByRenewableEnergy":
              return displayEnvironmentCards ? (
                <ImpactSynthesisHouseholdsPoweredByRenewableEnergy
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
            case "localPropertyValueIncrease":
              return displayEconomicCards ? (
                <ImpactSynthesisLocalPropertyValueIncrease
                  value={value}
                  descriptionDisplayMode="tooltip"
                />
              ) : null;
          }
        })}
    </div>
  );
};

export default ImpactSynthesisView;
