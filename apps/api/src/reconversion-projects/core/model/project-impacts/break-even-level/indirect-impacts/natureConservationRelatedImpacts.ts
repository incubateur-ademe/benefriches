import {
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
  SoilsDistribution,
  sumList,
  typedObjectEntries,
} from "shared";

import { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { NatureConservationImpactsService } from "../../nature-conservation/NatureConservationImpactsService";
import { getPermeableSurfaceImpact } from "../../nature-conservation/permeableSurfaceAreaImpact";
import { computeSoilsCo2eqStorageImpact } from "../../soils-co2eq-storage/soilsCo2eqStorage";
import { computeCumulativeByYear } from "../projectIndirectImpacts";

type Props = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistributionByType: SoilsDistribution;
  baseSoilsCarbonStorage?: SoilsCarbonStorage;
  projectSoilsCarbonStorage?: SoilsCarbonStorage;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  projectDecontaminatedSoilSurface?: number;
};

export const getNatureConservationRelatedImpacts = ({
  siteSoilsDistribution,
  projectSoilsDistributionByType,
  baseSoilsCarbonStorage,
  projectSoilsCarbonStorage,
  projectDecontaminatedSoilSurface,
  sumOnEvolutionPeriodService,
}: Props): {
  impactMetrics: ProjectOnSiteImpactMetric[];
  economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[];
} => {
  const economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];
  const impactMetrics: ProjectOnSiteImpactMetric[] = [];

  const soilsCo2eqStorage = computeSoilsCo2eqStorageImpact(
    baseSoilsCarbonStorage?.total,
    projectSoilsCarbonStorage?.total,
  );

  if (soilsCo2eqStorage && soilsCo2eqStorage?.difference !== 0) {
    const co2eqDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      soilsCo2eqStorage?.difference,
      ["co2_value"],
      { endYearIndex: 1 },
    );
    economicImpacts.push({
      detailsByYear: co2eqDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(co2eqDetailsByYear),
      total: sumList(co2eqDetailsByYear),
      name: "newStoredCo2Eq",
    });
    impactMetrics.push({
      total: soilsCo2eqStorage?.difference,
      name: "newStoredCo2Eq",
    });
  }

  const natureConservationImpactsService = new NatureConservationImpactsService({
    baseSoilsDistribution: siteSoilsDistribution,
    forecastSoilsDistribution: projectSoilsDistributionByType,
    baseDecontaminatedSurfaceArea: 0,
    forecastDecontaminedSurfaceArea: projectDecontaminatedSoilSurface,
    sumOnEvolutionPeriodService,
  });

  const natureConservationImpactList = typedObjectEntries(
    natureConservationImpactsService.getAll(),
  ).filter(([, value]) => value?.difference);

  const newPermeableSurface = getPermeableSurfaceImpact(
    siteSoilsDistribution,
    projectSoilsDistributionByType,
  ).difference;
  if (newPermeableSurface) {
    impactMetrics.push({
      name: "newPermeableSurface",
      total: getPermeableSurfaceImpact(siteSoilsDistribution, projectSoilsDistributionByType)
        .difference,
    });
  }

  if (projectDecontaminatedSoilSurface) {
    impactMetrics.push({
      name: "decontaminatedSurface",
      total: projectDecontaminatedSoilSurface,
    });
  }

  return {
    impactMetrics: impactMetrics,
    economicImpacts: economicImpacts.concat(
      natureConservationImpactList.map(([key, value]) => {
        const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
          value?.difference ?? 0,
          ["discount", "gdp_evolution"],
        );
        return {
          detailsByYear,
          cumulativeByYear: computeCumulativeByYear(detailsByYear),
          total: sumList(detailsByYear),
          name: key,
        };
      }),
    ),
  };
};
