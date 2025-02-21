import {
  convertCarbonToCO2eq,
  isForest,
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  SocioEconomicImpact,
  SoilsCarbonStorageImpactResult,
  SoilsDistribution,
  SoilType,
  sumListWithKey,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { PartialImpactsServiceInterface } from "../ReconversionProjectImpactsServiceInterface";
import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";

type EcosystemServiceImpact =
  | "nature_related_wellness_and_leisure"
  | "forest_related_product"
  | "pollination"
  | "invasive_species_regulation"
  | "water_cycle"
  | "nitrogen_cycle"
  | "soil_erosion"
  | "carbon_storage";

export type SoilsCarbonStorage = {
  totalCarbonStorage: number;
  soilsCarbonStorage: {
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
    type: SoilType;
  }[];
};

type Props = {
  siteTotalSurfaceArea: number;
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  baseSoilsCarbonStorage?: SoilsCarbonStorage;
  forecastSoilsCarbonStorage?: SoilsCarbonStorage;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  siteContaminatedSurfaceArea?: number;
  projectDecontaminedSurfaceArea?: number;
};

export class EnvironmentalSoilsRelatedImpactsService implements PartialImpactsServiceInterface {
  private readonly siteTotalSurfaceArea: number;
  private readonly baseSoilsDistribution: SoilsDistribution;
  private readonly forecastSoilsDistribution: SoilsDistribution;

  private readonly baseSoilsCarbonStorage?: SoilsCarbonStorage;
  private readonly forecastSoilsCarbonStorage?: SoilsCarbonStorage;

  private readonly siteContaminatedSurfaceArea: number;
  private readonly projectDecontaminedSurfaceArea: number;

  private readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    siteTotalSurfaceArea,
    baseSoilsDistribution,
    forecastSoilsDistribution,
    baseSoilsCarbonStorage,
    forecastSoilsCarbonStorage,
    sumOnEvolutionPeriodService,
    siteContaminatedSurfaceArea,
    projectDecontaminedSurfaceArea,
  }: Props) {
    this.siteTotalSurfaceArea = siteTotalSurfaceArea;

    this.baseSoilsDistribution = baseSoilsDistribution;
    this.forecastSoilsDistribution = forecastSoilsDistribution;

    this.baseSoilsCarbonStorage = baseSoilsCarbonStorage;
    this.forecastSoilsCarbonStorage = forecastSoilsCarbonStorage;

    this.siteContaminatedSurfaceArea = siteContaminatedSurfaceArea ?? 0;
    this.projectDecontaminedSurfaceArea = projectDecontaminedSurfaceArea ?? 0;

    this.sumOnEvolutionPeriodService = sumOnEvolutionPeriodService;
  }

  private get soilsDifferential() {
    const soilTypes = Array.from(
      new Set([
        ...Object.keys(this.baseSoilsDistribution),
        ...Object.keys(this.forecastSoilsDistribution),
      ]),
    ) as SoilType[];

    return soilTypes.reduce(
      (difference, soilType) => ({
        ...difference,
        [soilType]:
          (this.forecastSoilsDistribution[soilType] ?? 0) -
          (this.baseSoilsDistribution[soilType] ?? 0),
      }),
      {},
    );
  }

  private get soilsCarbonStorage(): SoilsCarbonStorageImpactResult {
    if (!this.baseSoilsCarbonStorage || !this.forecastSoilsCarbonStorage) {
      return { isSuccess: false };
    }

    return {
      isSuccess: true,
      current: {
        total: this.baseSoilsCarbonStorage.totalCarbonStorage,
        soils: this.baseSoilsCarbonStorage.soilsCarbonStorage.map((soil) => ({
          type: soil.type,
          surfaceArea: soil.surfaceArea,
          carbonStorage: soil.carbonStorage,
        })),
      },
      forecast: {
        total: this.forecastSoilsCarbonStorage.totalCarbonStorage,
        soils: this.forecastSoilsCarbonStorage.soilsCarbonStorage.map((soil) => ({
          type: soil.type,
          surfaceArea: soil.surfaceArea,
          carbonStorage: soil.carbonStorage,
        })),
      },
    };
  }

  private get carbonStorageMonetaryImpact() {
    if (!this.baseSoilsCarbonStorage || !this.forecastSoilsCarbonStorage) {
      return undefined;
    }
    const co2eqMonetaryValue = SumOnEvolutionPeriodService.getYearCO2MonetaryValue(
      this.sumOnEvolutionPeriodService.operationsFirstYear,
    );

    const soilsCarbonStorageDifference =
      this.forecastSoilsCarbonStorage.totalCarbonStorage -
      this.baseSoilsCarbonStorage.totalCarbonStorage;
    return {
      amount: Math.round(convertCarbonToCO2eq(soilsCarbonStorageDifference) * co2eqMonetaryValue),
      impact: "carbon_storage",
    };
  }

  private get forestSurfaceDifference() {
    return sumSoilsSurfaceAreasWhere(this.soilsDifferential, isForest);
  }
  private get prairieSurfaceDifference() {
    return sumSoilsSurfaceAreasWhere(this.soilsDifferential, isPrairie);
  }
  private get wetLandSurfaceDifference() {
    return sumSoilsSurfaceAreasWhere(this.soilsDifferential, isWetLand);
  }
  private get surfaceWithEcosystemBenefitsDifference() {
    return sumSoilsSurfaceAreasWhere(this.soilsDifferential, isSurfaceWithEcosystemBenefits);
  }

  private get natureRelatedWellnessAndLeisure() {
    const ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0071;
    const ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0315;
    const WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0234;

    const prairieEnvironmentalAmenities =
      this.prairieSurfaceDifference *
      ENVIRONMENTAL_AMENITIES_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
    const forestEnvironmentalAmenities =
      this.forestSurfaceDifference *
      ENVIRONMENTAL_AMENITIES_FOREST_MONETARY_VALUE_EURO_PER_SQUARE_METER;

    const environmentalAmenities = prairieEnvironmentalAmenities + forestEnvironmentalAmenities;
    const wetLandEcosystemServices =
      this.wetLandSurfaceDifference *
      WET_LAND_ECOSYSTEMIC_SERVICES_MONETARY_VALUE_EURO_PER_SQUARE_METER;

    return environmentalAmenities + wetLandEcosystemServices;
  }

  private get natureRelatedWellnessAndLeisureImpact() {
    if (this.natureRelatedWellnessAndLeisure === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.natureRelatedWellnessAndLeisure,
      ),
      impact: "nature_related_wellness_and_leisure",
    };
  }

  private get forestRelatedProduct() {
    const FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0157;
    return Math.max(
      0,
      this.forestSurfaceDifference * FOREST_RELATED_PRODUCT_MONETARY_VALUE_EURO_PER_SQUARE_METER,
    );
  }

  private get forestRelatedProductImpact() {
    if (this.forestRelatedProduct === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.forestRelatedProduct,
      ),
      impact: "forest_related_product",
    };
  }

  private get pollinisation() {
    const POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0092;
    return (
      this.surfaceWithEcosystemBenefitsDifference * POLLINATION_MONETARY_VALUE_EURO_PER_SQUARE_METER
    );
  }

  private get pollinisationImpact() {
    if (this.pollinisation === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.pollinisation,
      ),
      impact: "pollination",
    };
  }

  private get invasiveSpeciesRegulation() {
    const INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0034;
    return Math.max(
      0,
      this.surfaceWithEcosystemBenefitsDifference *
        INVASIVE_SPECIES_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER,
    );
  }
  private get invasiveSpeciesRegulationImpact() {
    if (this.invasiveSpeciesRegulation === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.invasiveSpeciesRegulation,
      ),
      impact: "invasive_species_regulation",
    };
  }

  private get waterCycle() {
    const WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.1356;
    const WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0254;
    const permanentVegetation =
      sumSoilsSurfaceAreasWhere(this.soilsDifferential, isSurfaceWithPermanentVegetation) *
      WATER_CYCLE_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;
    const other =
      sumSoilsSurfaceAreasWhere(
        this.soilsDifferential,
        isPermeableSurfaceWithoutPermanentVegetation,
      ) * WATER_CYCLE_NON_PERMANENT_VEGETATION_MONETARY_VALUE_EURO_PER_SQUARE_METER;

    return permanentVegetation + other;
  }
  private get waterCycleImpact() {
    if (this.waterCycle === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.waterCycle,
      ),
      impact: "water_cycle",
    };
  }

  private get nitrogenCycle() {
    const NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0069;
    const NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0913;
    const prairie =
      this.prairieSurfaceDifference * NITROGEN_CYCLE_PRAIRIE_MONETARY_VALUE_EURO_PER_SQUARE_METER;
    const wetLand =
      this.wetLandSurfaceDifference * NITROGEN_CYCLE_WET_LAND_MONETARY_VALUE_EURO_PER_SQUARE_METER;

    return prairie + wetLand;
  }
  private get nitrogenCycleImpact() {
    if (this.nitrogenCycle === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.nitrogenCycle,
      ),
      impact: "nitrogen_cycle",
    };
  }

  private get soilErosion() {
    const SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.025;
    return Math.max(
      0,
      this.surfaceWithEcosystemBenefitsDifference *
        SOIL_EROSION_MONETARY_VALUE_EURO_PER_SQUARE_METER,
    );
  }

  private get soilErosionImpact() {
    if (this.soilErosion === 0) {
      return undefined;
    }
    return {
      amount: this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
        this.soilErosion,
      ),
      impact: "soil_erosion",
    };
  }

  private get waterRegulation() {
    const WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER = 0.0118;

    return (
      (this.forestSurfaceDifference +
        this.prairieSurfaceDifference +
        this.wetLandSurfaceDifference +
        this.projectDecontaminedSurfaceArea) *
      WATER_REGULATION_MONETARY_VALUE_EURO_PER_SQUARE_METER
    );
  }

  private get waterRegulationMonetaryImpact() {
    if (this.waterRegulation === 0) {
      return undefined;
    }
    return this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(
      this.waterRegulation,
    );
  }

  private get ecosystemServicesMonetaryImpact() {
    const ecosystemServicesImpacts = [
      this.carbonStorageMonetaryImpact,
      this.natureRelatedWellnessAndLeisureImpact,
      this.forestRelatedProductImpact,
      this.pollinisationImpact,
      this.invasiveSpeciesRegulationImpact,
      this.waterCycleImpact,
      this.nitrogenCycleImpact,
      this.soilErosionImpact,
    ].filter((item) => item && item.amount !== 0) as {
      amount: number;
      impact: EcosystemServiceImpact;
    }[];

    if (ecosystemServicesImpacts.length > 0) {
      return ecosystemServicesImpacts;
    }
    return undefined;
  }

  private get basePermeableSoilsSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isPermeableSoil);
  }

  private get forecastPermeableSoilsSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isPermeableSoil);
  }

  private get baseGreenSoilsSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isGreenSoil);
  }

  private get forecastGreenSoilsSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isGreenSoil);
  }

  private get baseMineralSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isMineralSoil);
  }

  private get forecastMineralSurfaceArea() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isMineralSoil);
  }

  private get permeableSurfaceImpact() {
    return {
      base: this.basePermeableSoilsSurfaceArea,
      forecast: this.forecastPermeableSoilsSurfaceArea,
      difference: this.forecastPermeableSoilsSurfaceArea - this.basePermeableSoilsSurfaceArea,
      greenSoil: {
        base: this.baseGreenSoilsSurfaceArea,
        forecast: this.forecastGreenSoilsSurfaceArea,
        difference: this.forecastGreenSoilsSurfaceArea - this.baseGreenSoilsSurfaceArea,
      },
      mineralSoil: {
        base: this.baseMineralSurfaceArea,
        forecast: this.forecastMineralSurfaceArea,
        difference: this.forecastMineralSurfaceArea - this.baseMineralSurfaceArea,
      },
    };
  }

  private get nonContaminatedSurfaceAreaImpact() {
    const currentNonContaminatedSurfaceArea =
      this.siteTotalSurfaceArea - this.siteContaminatedSurfaceArea;
    const forecastNonContaminatedSurfaceArea =
      currentNonContaminatedSurfaceArea + this.projectDecontaminedSurfaceArea;
    return {
      current: currentNonContaminatedSurfaceArea,
      forecast: forecastNonContaminatedSurfaceArea,
      difference: forecastNonContaminatedSurfaceArea - currentNonContaminatedSurfaceArea,
    };
  }

  getSocioEconomicList() {
    const socioEconomicList: SocioEconomicImpact[] = [];

    if (this.waterRegulationMonetaryImpact) {
      socioEconomicList.push({
        impact: "water_regulation",
        impactCategory: "environmental_monetary",
        actor: "community",
        amount: this.waterRegulationMonetaryImpact,
      });
    }

    if (this.ecosystemServicesMonetaryImpact) {
      socioEconomicList.push({
        impact: "ecosystem_services",
        impactCategory: "environmental_monetary",
        actor: "human_society",
        amount: sumListWithKey(this.ecosystemServicesMonetaryImpact, "amount"),
        details: this.ecosystemServicesMonetaryImpact,
      });
    }
    return socioEconomicList;
  }

  getEnvironmentalImpacts() {
    return {
      nonContaminatedSurfaceArea: this.nonContaminatedSurfaceAreaImpact,
      permeableSurfaceArea: this.permeableSurfaceImpact,
      soilsCarbonStorage: this.soilsCarbonStorage,
    };
  }
}
