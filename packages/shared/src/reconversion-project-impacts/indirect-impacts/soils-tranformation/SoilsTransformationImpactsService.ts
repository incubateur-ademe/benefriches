import { convertCarbonToCO2eq } from "../../../co2eq";
import { typedObjectEntries } from "../../../object-entries";
import { sumList } from "../../../services";
import {
  sumSoilsSurfaceAreasWhere,
  isForest,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  SoilsDistribution,
  isGreenSoil,
  isMineralSoil,
} from "../../../soils";
import {
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computeNitrogenCycleMonetaryValue,
  computePollinisationMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterCycleMonetaryValue,
  computeWaterRegulationMonetaryValue,
} from "../../../soils/impacts/natureConservationYearlyMonetaryValue";
import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../../sum-on-evolution-period/computeCumulativeByYear";
import {
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
} from "../../projectImpacts.types";

type Props = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  siteSoilsCarbonStorage?: number;
  projectSoilsCarbonStorage?: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  projectDecontaminedSurfaceArea?: number;
};

export class SoilsTransformationImpactsService {
  private readonly siteSoilsDistribution: SoilsDistribution;
  private readonly projectSoilsDistribution: SoilsDistribution;

  private readonly siteSoilsCarbonStorage: number;
  private readonly projectSoilsCarbonStorage: number;

  private readonly projectDecontaminedSurfaceArea: number;

  private readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    siteSoilsDistribution,
    projectSoilsDistribution,
    siteSoilsCarbonStorage,
    projectSoilsCarbonStorage,
    projectDecontaminedSurfaceArea,
    sumOnEvolutionPeriodService,
  }: Props) {
    this.siteSoilsDistribution = siteSoilsDistribution;
    this.projectSoilsDistribution = projectSoilsDistribution;

    this.siteSoilsCarbonStorage = siteSoilsCarbonStorage ?? 0;
    this.projectSoilsCarbonStorage = projectSoilsCarbonStorage ?? 0;

    this.projectDecontaminedSurfaceArea = projectDecontaminedSurfaceArea ?? 0;

    this.sumOnEvolutionPeriodService = sumOnEvolutionPeriodService;
  }

  private get forestSurfaceDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isForest) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isForest)
    );
  }

  private get prairieSurfaceDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isPrairie) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isPrairie)
    );
  }

  private get wetLandSurfaceDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isWetLand) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isWetLand)
    );
  }

  private get surfaceWithEcosystemBenefitsDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isSurfaceWithEcosystemBenefits) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isSurfaceWithEcosystemBenefits)
    );
  }

  private get greenSoilDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isGreenSoil) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isGreenSoil)
    );
  }

  private get mineralSoilDifference() {
    return (
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isMineralSoil) -
      sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isMineralSoil)
    );
  }

  get waterRegulation() {
    return computeWaterRegulationMonetaryValue({
      prairieSurfaceArea: this.prairieSurfaceDifference,
      forestSurfaceArea: this.forestSurfaceDifference,
      wetLandSurfaceArea: this.wetLandSurfaceDifference,
      decontaminatedSurfaceArea: this.projectDecontaminedSurfaceArea,
    });
  }

  get storedCo2EqDifference() {
    return (
      convertCarbonToCO2eq(this.projectSoilsCarbonStorage) -
      convertCarbonToCO2eq(this.siteSoilsCarbonStorage)
    );
  }

  get natureRelatedWelnessAndLeisure() {
    return computeNatureRelatedWellnessAndLeisureMonetaryValue({
      prairieSurfaceArea: this.prairieSurfaceDifference,
      forestSurfaceArea: this.forestSurfaceDifference,
      wetLandSurfaceArea: this.wetLandSurfaceDifference,
    });
  }

  get forestRelatedProduct() {
    if (this.forestSurfaceDifference <= 0) {
      return undefined;
    }
    return computeForestRelatedProductMonetaryValue(this.forestSurfaceDifference);
  }

  get pollination() {
    if (this.surfaceWithEcosystemBenefitsDifference <= 0) {
      return undefined;
    }
    return computePollinisationMonetaryValue(this.surfaceWithEcosystemBenefitsDifference);
  }

  get invasiveSpeciesRegulation() {
    if (this.surfaceWithEcosystemBenefitsDifference <= 0) {
      return undefined;
    }
    return computeInvasiveSpeciesRegulationMonetaryValue(
      this.surfaceWithEcosystemBenefitsDifference,
    );
  }

  get waterCycle() {
    return computeWaterCycleMonetaryValue(
      sumSoilsSurfaceAreasWhere(this.projectSoilsDistribution, isSurfaceWithPermanentVegetation) -
        sumSoilsSurfaceAreasWhere(this.siteSoilsDistribution, isSurfaceWithPermanentVegetation),
      sumSoilsSurfaceAreasWhere(
        this.projectSoilsDistribution,
        isPermeableSurfaceWithoutPermanentVegetation,
      ) -
        sumSoilsSurfaceAreasWhere(
          this.siteSoilsDistribution,
          isPermeableSurfaceWithoutPermanentVegetation,
        ),
    );
  }

  get nitrogenCycle() {
    const newPrairieSurface = Math.max(0, this.prairieSurfaceDifference);
    const newWetLandSurface = Math.max(0, this.wetLandSurfaceDifference);
    if (newPrairieSurface === 0 && newWetLandSurface === 0) {
      return undefined;
    }
    return computeNitrogenCycleMonetaryValue({
      prairieSurfaceArea: newPrairieSurface > 0 ? newPrairieSurface : 0,
      wetLandSurfaceArea: newWetLandSurface > 0 ? newWetLandSurface : 0,
    });
  }

  get soilErosion() {
    if (this.surfaceWithEcosystemBenefitsDifference <= 0) {
      return undefined;
    }
    return computeSoilErosionMonetaryValue(this.surfaceWithEcosystemBenefitsDifference);
  }

  getEconomicImpacts() {
    const economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];

    if (this.storedCo2EqDifference) {
      const co2eqDetailsByYear = this.sumOnEvolutionPeriodService.getWeightedYearlyValues(
        this.storedCo2EqDifference,
        ["co2_value"],
        { endYearIndex: 1 },
      );
      economicImpacts.push({
        detailsByYear: co2eqDetailsByYear,
        cumulativeByYear: computeCumulativeByYear(co2eqDetailsByYear),
        total: sumList(co2eqDetailsByYear),
        name: "newStoredCo2Eq",
      });
    }

    (
      [
        { name: "natureRelatedWelnessAndLeisure", value: this.natureRelatedWelnessAndLeisure },
        {
          name: "pollination",
          value: this.pollination,
        },
        { name: "invasiveSpeciesRegulation", value: this.invasiveSpeciesRegulation },
        {
          name: "waterCycle",
          value: this.waterCycle,
        },
        { name: "nitrogenCycle", value: this.nitrogenCycle },

        { name: "forestRelatedProduct", value: this.forestRelatedProduct },
        {
          name: "soilErosion",
          value: this.soilErosion,
        },
        {
          name: "waterRegulation",
          value: this.waterRegulation,
        },
      ] as const
    ).forEach(({ name, value }) => {
      if (value) {
        const detailsByYear = this.sumOnEvolutionPeriodService.getWeightedYearlyValues(value, [
          "discount",
          "gdp_evolution",
        ]);
        economicImpacts.push({
          detailsByYear: detailsByYear,
          cumulativeByYear: computeCumulativeByYear(detailsByYear),
          total: sumList(detailsByYear),
          name,
        });
      }
    });

    return economicImpacts;
  }

  getImpactMetrics() {
    const impactMetrics: ProjectOnSiteImpactMetric[] = typedObjectEntries(
      this.projectSoilsDistribution,
    ).map(([soilType, surface]) => ({
      soilType,
      total: surface ?? 0,
      name: "soilsDistribution" as const,
    }));

    if (this.storedCo2EqDifference) {
      impactMetrics.push({
        total: this.storedCo2EqDifference,
        name: "newStoredCo2Eq",
      });
    }

    if (this.greenSoilDifference) {
      impactMetrics.push({
        name: "newPermeableGreenSurface",
        total: this.greenSoilDifference,
      });
    }
    if (this.mineralSoilDifference) {
      impactMetrics.push({
        name: "newPermeableMineralSurface",
        total: this.mineralSoilDifference,
      });
    }

    if (this.projectDecontaminedSurfaceArea) {
      impactMetrics.push({
        name: "decontaminatedSurface",
        total: this.projectDecontaminedSurfaceArea,
      });
    }

    return impactMetrics;
  }
}
