import { GetReconversionProjectImpactsResultDto } from "shared";

import { ExtractDetailsKeyName } from "./group-impacts/extractDetailsKeyName.type";
import { filterNonEmptyImpacts } from "./group-impacts/filterNonEmpty";
import { findTotalByName } from "./group-impacts/findTotalByName";
import { groupImpactsByName } from "./group-impacts/groupImpactsByName";
import { withBreakdown } from "./group-impacts/withBreakdown";

export type EnvironmentalImpactMetricsByListViewCategory = ReturnType<
  typeof groupEnvironmentalMetricsByListViewCategory
>;

type SoilsSectionImpacts = EnvironmentalImpactMetricsByListViewCategory["soils"][number];
type Co2EqSectionImpacts = EnvironmentalImpactMetricsByListViewCategory["co2eq"][number];

export type EnvironmentalImpactMetricMainKeyName =
  | SoilsSectionImpacts["keyName"]
  | Co2EqSectionImpacts["keyName"];

export type EnvironmentalImpactMetricDetailsKeyName =
  | ExtractDetailsKeyName<SoilsSectionImpacts, "newPermeableSurface">
  | ExtractDetailsKeyName<Co2EqSectionImpacts, "avoidedCo2eqEmissions">;

export type EnvironmentalImpactMetricKeyName =
  | EnvironmentalImpactMetricMainKeyName
  | EnvironmentalImpactMetricDetailsKeyName;

export const groupEnvironmentalMetricsByListViewCategory = (
  impactsData?: GetReconversionProjectImpactsResultDto["impacts"],
  siteSurfaceArea?: number,
) => {
  if (!impactsData || !siteSurfaceArea) {
    return { soils: [], co2eq: [] };
  }

  const { siteStatuQuoImpactMetrics, projectIndirectImpactMetrics } =
    impactsData.reconversionImpactsBreakdown;

  const baseStoredCo2Eq = findTotalByName(siteStatuQuoImpactMetrics, "storedCo2Eq");

  const co2Eq = groupImpactsByName(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
    "avoidedCo2eqEmissions",
    "newStoredCo2Eq",
    "avoidedCO2TonsWithEnergyProduction",
    "avoidedAirConditioningCo2eqEmissions",
    "avoidedTrafficCo2EqEmissions",
  );

  const basePermeableGreenSurface = findTotalByName(
    siteStatuQuoImpactMetrics,
    "permeableGreenSurface",
  );
  const basePermeableMineralSurface = findTotalByName(
    siteStatuQuoImpactMetrics,
    "permeableMineralSurface",
  );
  const basePermeableSurface = basePermeableGreenSurface + basePermeableMineralSurface;

  const permeableSurface = groupImpactsByName(
    impactsData.aggregatedReconversionImpacts.impactsMetrics,
    "newPermeableSurface",
    "newPermeableGreenSurface",
    "newPermeableMineralSurface",
  );

  const contaminated = findTotalByName(siteStatuQuoImpactMetrics, "contaminatedSurface");
  const decontamined = findTotalByName(projectIndirectImpactMetrics, "decontaminatedSurface");

  return {
    co2eq:
      co2Eq.details.length > 0
        ? [
            {
              ...withBreakdown(co2Eq, baseStoredCo2Eq),
              details: co2Eq.details.map((item) =>
                item.name === "newStoredCo2Eq" ? withBreakdown(item, baseStoredCo2Eq) : item,
              ),
            },
          ]
        : [],
    soils: filterNonEmptyImpacts([
      {
        ...withBreakdown(permeableSurface, basePermeableSurface),
        details: permeableSurface.details.map((item) => {
          if (item.name === "newPermeableGreenSurface") {
            return withBreakdown(item, basePermeableGreenSurface);
          }
          if (item.name === "newPermeableMineralSurface") {
            return withBreakdown(item, basePermeableMineralSurface);
          }
          return item;
        }),
      },
      withBreakdown(
        { keyName: "nonContaminatedSurfaceArea" as const, total: decontamined },
        siteSurfaceArea - contaminated,
      ),
    ]),
  };
};
