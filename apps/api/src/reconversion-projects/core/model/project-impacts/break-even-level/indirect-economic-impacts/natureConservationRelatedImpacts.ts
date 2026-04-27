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
  const soilsCo2eqStorage = computeSoilsCo2eqStorageImpact(
    baseSoilsCarbonStorage?.total,
    projectSoilsCarbonStorage?.total,
  );
  const natureConservationImpactsService = new NatureConservationImpactsService({
    baseSoilsDistribution: siteSoilsDistribution,
    forecastSoilsDistribution: projectSoilsDistributionByType,
    baseDecontaminatedSurfaceArea: 0,
    forecastDecontaminedSurfaceArea: projectDecontaminatedSoilSurface,
    baseSoilsCo2eqStorage: soilsCo2eqStorage?.base,
    forecastSoilsCo2eqStorage: soilsCo2eqStorage?.forecast,
    sumOnEvolutionPeriodService,
  });

  return typedObjectEntries(natureConservationImpactsService.getAll())
    .filter(([, value]) => value?.difference)
    .map(([key, value]) => {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        value?.difference ?? 0,
        ["discount", "gdp_evolution"],
        { endYearIndex: key === "storedCo2Eq" ? 1 : undefined },
      );

      const total = sumList(detailsByYear);

      return {
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total,
        name: key,
      };
    });
};
