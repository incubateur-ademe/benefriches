import { IndirectEconomicImpact, SoilsDistribution, sumList, typedObjectEntries } from "shared";

import { SoilsCarbonStorage } from "src/reconversion-projects/core/gateways/SoilsCarbonStorageService";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { NatureConservationImpactsService } from "../../nature-conservation/NatureConservationImpactsService";
import { computeSoilsCo2eqStorageImpact } from "../../soils-co2eq-storage/soilsCo2eqStorage";
import { computeCumulativeByYear } from "../projectIndirectEconomicImpacts";

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
}: Props): IndirectEconomicImpact[] => {
  const impacts: IndirectEconomicImpact[] = [];

  const soilsCo2eqStorage = computeSoilsCo2eqStorageImpact(
    baseSoilsCarbonStorage?.total,
    projectSoilsCarbonStorage?.total,
  );

  if (soilsCo2eqStorage && soilsCo2eqStorage?.difference !== 0) {
    const co2eqDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      soilsCo2eqStorage?.difference ?? 0,
      ["co2_value"],
      { endYearIndex: 1 },
    );
    impacts.push({
      detailsByYear: co2eqDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(co2eqDetailsByYear),
      total: sumList(co2eqDetailsByYear),
      name: "storedCo2Eq",
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

  return impacts.concat(
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
  );
};
