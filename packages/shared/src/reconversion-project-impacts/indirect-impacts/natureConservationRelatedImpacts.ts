import { convertCarbonToCO2eq } from "../../co2eq";
import { typedObjectEntries } from "../../object-entries";
import { sumList } from "../../services";
import { SoilsCarbonStorage, SoilsDistribution } from "../../soils";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../sum-on-evolution-period/computeCumulativeByYear";
import {
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
} from "../projectImpacts.types";
import { NatureConservationImpactsService } from "./nature-conservation/NatureConservationImpactsService";
import { getPermeableSurfaceImpact } from "./nature-conservation/permeableSurfaceAreaImpact";

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

  impactMetrics.push(
    ...typedObjectEntries(projectSoilsDistributionByType).map(([soilType, surface]) => ({
      soilType,
      total: surface ?? 0,
      name: "soilsDistribution" as const,
    })),
  );

  if (baseSoilsCarbonStorage?.total && projectSoilsCarbonStorage?.total) {
    const difference =
      convertCarbonToCO2eq(projectSoilsCarbonStorage.total) -
      convertCarbonToCO2eq(baseSoilsCarbonStorage.total);

    if (difference !== 0) {
      const co2eqDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        difference,
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
        total: difference,
        name: "newStoredCo2Eq",
      });
    }
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
  );
  if (newPermeableSurface.greenSoil.difference) {
    impactMetrics.push({
      name: "newPermeableGreenSurface",
      total: newPermeableSurface.greenSoil.difference,
    });
  }
  if (newPermeableSurface.mineralSoil.difference) {
    impactMetrics.push({
      name: "newPermeableMineralSurface",
      total: newPermeableSurface.mineralSoil.difference,
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
