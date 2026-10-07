import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { typedObjectEntries } from "../../object-entries";
import type { BuildingsUseDistribution } from "../../reconversion-projects";
import { roundToInteger, sumListWithKey } from "../../services";
import type { SiteStatuQuoImpactMetric } from "../../site";
import { isGreenSoil, type SoilType } from "../../soils";
import type {
  AggregatedProjectImpactMetric,
  ProjectOnSiteImpactMetric,
} from "../projectImpacts.types";
import { sumMetricsTotalByName } from "./scoring.helpers";

export type ContextData = GetReconversionProjectImpactsResultDto["contextData"];

export const getEvolutionAsPercentage = (props: { before: number; difference: number }): number => {
  const before = Math.abs(props.before);
  if (before === 0) {
    return roundToInteger((props.difference / (before + 1)) * 100);
  }
  return roundToInteger((props.difference / before) * 100);
};

const getPermeableSurfaceDifference = ({
  siteStatuQuoImpactMetrics,
  aggregatedReconversionImpactMetrics,
}: {
  siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[];
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
}) => {
  const permeableSurfaceBefore = sumMetricsTotalByName(
    siteStatuQuoImpactMetrics,
    "permeableGreenSurface",
    "permeableMineralSurface",
  );
  const permeableSurfaceDifference = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "newPermeableGreenSurface",
    "newPermeableMineralSurface",
  );

  return {
    difference: permeableSurfaceDifference,
    percentVariation: getEvolutionAsPercentage({
      before: permeableSurfaceBefore,
      difference: permeableSurfaceDifference,
    }),
  };
};

const getContaminatedSurfaceDifference = ({
  siteStatuQuoImpactMetrics,
  aggregatedReconversionImpactMetrics,
}: {
  siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[];
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
}) => {
  const contaminatedSurface = sumMetricsTotalByName(
    siteStatuQuoImpactMetrics,
    "contaminatedSurface",
  );
  const decontaminatedSurface = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "decontaminatedSurface",
  );

  return {
    siteContaminatedSurface: contaminatedSurface,
    difference: decontaminatedSurface,
    percentVariation: getEvolutionAsPercentage({
      before: contaminatedSurface,
      difference: decontaminatedSurface,
    }),
  };
};

const getProjectSoilsDistribution = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
) =>
  aggregatedReconversionImpactMetrics.filter(
    (item): item is Extract<ProjectOnSiteImpactMetric, { name: "soilsDistribution" }> =>
      item.name === "soilsDistribution",
  );

const getNewGreenSoilSurfaces = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
) =>
  sumListWithKey(
    getProjectSoilsDistribution(aggregatedReconversionImpactMetrics).filter((item) =>
      isGreenSoil(item.soilType),
    ),
    "total",
  );

export type SoilEvolutionDetails = {
  soilsDistribution: { soilType: SoilType; total: number }[];
  permeableSurfaceDifference: { difference: number; percentVariation: number };
  contamination: { siteContaminatedSurface: number; difference: number; percentVariation: number };
  newGreenSoilSurfaces: number;
};

export const getSoilEvolutionDetails = (props: {
  siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[];
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
}): SoilEvolutionDetails => {
  return {
    contamination: getContaminatedSurfaceDifference(props),
    soilsDistribution: getProjectSoilsDistribution(props.aggregatedReconversionImpactMetrics),
    permeableSurfaceDifference: getPermeableSurfaceDifference(props),
    newGreenSoilSurfaces: getNewGreenSoilSurfaces(props.aggregatedReconversionImpactMetrics),
  };
};

export type SiteReconversionType = "friche" | "enaf" | "friche_agricole" | undefined;

export const getSiteReconversionType = (contextData: ContextData): SiteReconversionType => {
  if (contextData.siteNature === "FRICHE" && contextData.fricheActivity === "AGRICULTURE") {
    return "friche_agricole";
  } else if (
    contextData.siteNature === "AGRICULTURAL_OPERATION" ||
    contextData.siteNature === "NATURAL_AREA"
  ) {
    return "enaf";
  } else if (contextData.siteNature === "FRICHE") {
    return "friche";
  }
  return undefined;
};

export type BuildingUseSurface = {
  buildingUse: keyof BuildingsUseDistribution;
  floorSurfaceArea: number;
};
export const filterBuildingsUses = (
  buildingsUseDistribution: BuildingsUseDistribution,
  usesToKeep: ReadonlySet<keyof BuildingsUseDistribution>,
): BuildingUseSurface[] => {
  return typedObjectEntries(buildingsUseDistribution).flatMap(([buildingUse, floorSurfaceArea]) =>
    floorSurfaceArea && floorSurfaceArea > 0 && usesToKeep.has(buildingUse)
      ? [{ buildingUse, floorSurfaceArea }]
      : [],
  );
};
