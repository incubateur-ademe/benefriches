import {
  isForest,
  isPermeableSurfaceWithoutPermanentVegetation,
  isPrairie,
  isSurfaceWithEcosystemBenefits,
  isSurfaceWithPermanentVegetation,
  isWetLand,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";
import { Impact } from "../impact";
import {
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computeNitrogenCycleMonetaryValue,
  computePollinisationMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterCycleMonetaryValue,
  computeWaterRegulationMonetaryValue,
} from "./natureConservationYearlyMonetaryValue";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  baseSoilsCo2eqStorage?: number;
  forecastSoilsCo2eqStorage?: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  baseDecontaminatedSurfaceArea?: number;
  forecastDecontaminedSurfaceArea?: number;
};

export class NatureConservationImpactsService {
  private readonly baseSoilsDistribution: SoilsDistribution;
  private readonly forecastSoilsDistribution: SoilsDistribution;

  private readonly baseSoilsCo2eqStorage: number;
  private readonly forecastSoilsCo2eqStorage: number;

  private readonly baseDecontaminatedSurfaceArea: number;
  private readonly forecastDecontaminedSurfaceArea: number;

  private readonly sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;

  constructor({
    baseSoilsDistribution,
    forecastSoilsDistribution,
    baseSoilsCo2eqStorage,
    forecastSoilsCo2eqStorage,
    baseDecontaminatedSurfaceArea,
    forecastDecontaminedSurfaceArea,
    sumOnEvolutionPeriodService,
  }: Props) {
    this.baseSoilsDistribution = baseSoilsDistribution;
    this.forecastSoilsDistribution = forecastSoilsDistribution;

    this.baseSoilsCo2eqStorage = baseSoilsCo2eqStorage ?? 0;
    this.forecastSoilsCo2eqStorage = forecastSoilsCo2eqStorage ?? 0;

    this.baseDecontaminatedSurfaceArea = baseDecontaminatedSurfaceArea ?? 0;
    this.forecastDecontaminedSurfaceArea = forecastDecontaminedSurfaceArea ?? 0;

    this.sumOnEvolutionPeriodService = sumOnEvolutionPeriodService;
  }

  private get baseForestSurface() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isForest);
  }

  private get basePrairieSurface() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isPrairie);
  }

  private get baseWetLandSurface() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isWetLand);
  }

  private get baseSurfaceWithEcosystemBenefits() {
    return sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isSurfaceWithEcosystemBenefits);
  }

  private get forecastForestSurface() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isForest);
  }

  private get forecastPrairieSurface() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isPrairie);
  }

  private get forecastWetLandSurface() {
    return sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isWetLand);
  }

  private get forecastSurfaceWithEcosystemBenefits() {
    return sumSoilsSurfaceAreasWhere(
      this.forecastSoilsDistribution,
      isSurfaceWithEcosystemBenefits,
    );
  }

  private get waterRegulation() {
    return Impact.create({
      base: computeWaterRegulationMonetaryValue({
        prairieSurfaceArea: this.basePrairieSurface,
        forestSurfaceArea: this.baseForestSurface,
        wetLandSurfaceArea: this.baseWetLandSurface,
        decontaminatedSurfaceArea: this.baseDecontaminatedSurfaceArea,
      }),
      forecast: computeWaterRegulationMonetaryValue({
        prairieSurfaceArea: this.forecastPrairieSurface,
        forestSurfaceArea: this.forecastForestSurface,
        wetLandSurfaceArea: this.forecastWetLandSurface,
        decontaminatedSurfaceArea: this.forecastDecontaminedSurfaceArea,
      }),
    });
  }

  private get storedCo2Eq() {
    return Impact.create({
      base: Math.round(
        this.baseSoilsCo2eqStorage *
          SumOnEvolutionPeriodService.getYearCO2MonetaryValue(
            this.sumOnEvolutionPeriodService.operationsFirstYear,
          ),
      ),
      forecast: Math.round(
        this.forecastSoilsCo2eqStorage *
          SumOnEvolutionPeriodService.getYearCO2MonetaryValue(
            this.sumOnEvolutionPeriodService.operationsFirstYear,
          ),
      ),
    });
  }

  private get natureRelatedWelnessAndLeisure() {
    return Impact.create({
      base: computeNatureRelatedWellnessAndLeisureMonetaryValue({
        prairieSurfaceArea: this.basePrairieSurface,
        forestSurfaceArea: this.baseForestSurface,
        wetLandSurfaceArea: this.baseWetLandSurface,
      }),
      forecast: computeNatureRelatedWellnessAndLeisureMonetaryValue({
        prairieSurfaceArea: this.forecastPrairieSurface,
        forestSurfaceArea: this.forecastForestSurface,
        wetLandSurfaceArea: this.forecastWetLandSurface,
      }),
    });
  }

  private get forestRelatedProduct() {
    if (this.forecastForestSurface - this.baseForestSurface <= 0) {
      return undefined;
    }
    return Impact.create({
      base: computeForestRelatedProductMonetaryValue(this.baseForestSurface),
      forecast: computeForestRelatedProductMonetaryValue(this.forecastForestSurface),
    });
  }

  private get pollination() {
    if (this.forecastSurfaceWithEcosystemBenefits - this.baseSurfaceWithEcosystemBenefits <= 0) {
      return undefined;
    }
    return Impact.create({
      base: computePollinisationMonetaryValue(this.baseSurfaceWithEcosystemBenefits),
      forecast: computePollinisationMonetaryValue(this.forecastSurfaceWithEcosystemBenefits),
    });
  }

  private get invasiveSpeciesRegulation() {
    if (this.forecastSurfaceWithEcosystemBenefits - this.baseSurfaceWithEcosystemBenefits <= 0) {
      return undefined;
    }
    return Impact.create({
      base: computeInvasiveSpeciesRegulationMonetaryValue(this.baseSurfaceWithEcosystemBenefits),
      forecast: computeInvasiveSpeciesRegulationMonetaryValue(
        this.forecastSurfaceWithEcosystemBenefits,
      ),
    });
  }

  private get waterCycle() {
    return Impact.create({
      base: computeWaterCycleMonetaryValue(
        sumSoilsSurfaceAreasWhere(this.baseSoilsDistribution, isSurfaceWithPermanentVegetation),
        sumSoilsSurfaceAreasWhere(
          this.baseSoilsDistribution,
          isPermeableSurfaceWithoutPermanentVegetation,
        ),
      ),
      forecast: computeWaterCycleMonetaryValue(
        sumSoilsSurfaceAreasWhere(this.forecastSoilsDistribution, isSurfaceWithPermanentVegetation),
        sumSoilsSurfaceAreasWhere(
          this.forecastSoilsDistribution,
          isPermeableSurfaceWithoutPermanentVegetation,
        ),
      ),
    });
  }

  private get nitrogenCycle() {
    const newPrairieSurface = Math.max(0, this.forecastPrairieSurface - this.basePrairieSurface);
    const newWetLandSurface = Math.max(0, this.forecastWetLandSurface - this.baseWetLandSurface);
    if (newPrairieSurface === 0 && newWetLandSurface === 0) {
      return undefined;
    }
    return Impact.create({
      base: computeNitrogenCycleMonetaryValue({
        prairieSurfaceArea: newPrairieSurface > 0 ? this.basePrairieSurface : 0,
        wetLandSurfaceArea: newWetLandSurface > 0 ? this.baseWetLandSurface : 0,
      }),
      forecast: computeNitrogenCycleMonetaryValue({
        prairieSurfaceArea: newPrairieSurface > 0 ? this.forecastPrairieSurface : 0,
        wetLandSurfaceArea: newWetLandSurface > 0 ? this.forecastWetLandSurface : 0,
      }),
    });
  }

  private get soilErosion() {
    if (this.forecastSurfaceWithEcosystemBenefits - this.baseSurfaceWithEcosystemBenefits <= 0) {
      return undefined;
    }
    return Impact.create({
      base: computeSoilErosionMonetaryValue(this.baseSurfaceWithEcosystemBenefits),
      forecast: computeSoilErosionMonetaryValue(this.forecastSurfaceWithEcosystemBenefits),
    });
  }

  private get sumOnEvolutionPeriod() {
    return (value: number) =>
      this.sumOnEvolutionPeriodService.sumWithDiscountFactorAndGDPEvolution(value);
  }

  getEcosystemServicesMonetaryImpact() {
    return {
      storedCo2Eq: this.storedCo2Eq.computeTotal(),
      natureRelatedWelnessAndLeisure: this.natureRelatedWelnessAndLeisure.computeTotal(
        this.sumOnEvolutionPeriod,
      ),
      forestRelatedProduct: this.forestRelatedProduct?.computeTotal(this.sumOnEvolutionPeriod),
      pollination: this.pollination?.computeTotal(this.sumOnEvolutionPeriod),
      invasiveSpeciesRegulation: this.invasiveSpeciesRegulation?.computeTotal(
        this.sumOnEvolutionPeriod,
      ),
      waterCycle: this.waterCycle.computeTotal(this.sumOnEvolutionPeriod),
      nitrogenCycle: this.nitrogenCycle?.computeTotal(this.sumOnEvolutionPeriod),
      soilErosion: this.soilErosion?.computeTotal(this.sumOnEvolutionPeriod),
    };
  }

  getWaterRegulationMonetaryImpact() {
    return this.waterRegulation.computeTotal(this.sumOnEvolutionPeriod);
  }
}
