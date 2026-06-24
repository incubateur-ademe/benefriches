import {
  SiteYearlyExpense,
  SoilsDistribution,
  SiteYearlyIncome,
  SiteNature,
  sumListWithKey,
  roundToInteger,
  sumList,
  GetSiteImpactsDto,
  sumSoilsSurfaceAreasWhere,
  isSurfaceWithEcosystemBenefits,
  isPrairie,
  isForest,
  isWetLand,
  convertCarbonToCO2eq,
  isSurfaceWithPermanentVegetation,
  isPermeableSurfaceWithoutPermanentVegetation,
  FricheCostsIndirectEconomicImpacts,
  TaxesIncomeIndirectEconomicImpacts,
  SiteStatuQuoEconomicImpact,
  SiteStatuQuoImpactMetric,
  computeAgriculturalOperationEtpFromSurface,
  isPermeableSoil,
  AgriculturalOperationActivity,
} from "shared";

import { computeCumulativeByYear } from "src/reconversion-projects/core/model/project-impacts/break-even-level/projectIndirectImpacts";
import {
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computeNitrogenCycleMonetaryValue,
  computePollinisationMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterCycleMonetaryValue,
  computeWaterRegulationMonetaryValue,
} from "src/reconversion-projects/core/model/project-impacts/nature-conservation/natureConservationYearlyMonetaryValue";

import { SoilsCarbonStorage } from "../../../../reconversion-projects/core/gateways/SoilsCarbonStorageService";
import { SumOnEvolutionPeriodService } from "../../../../reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

const FRICHE_COST_PURPOSES = [
  "security",
  "illegalDumpingCost",
  "accidentsCost",
  "otherSecuringCosts",
  "maintenance",
] as const;

type Props = {
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  siteData: {
    nature: SiteNature;
    yearlyExpenses: SiteYearlyExpense[];
    yearlyIncomes: SiteYearlyIncome[];
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorage;
    contaminatedSoilSurface?: number;
    accidentsDeaths?: number;
    accidentsSevereInjuries?: number;
    accidentsMinorInjuries?: number;
    agriculturalOperationActivity?: AgriculturalOperationActivity;
    isSiteOperated?: boolean;
    surfaceArea: number;
  };
};

export const getSiteStatuQuoIndirectsImpacts = ({
  siteData,
  sumOnEvolutionPeriodService,
}: Props): {
  impactMetrics: SiteStatuQuoImpactMetric[];
  economicImpacts: GetSiteImpactsDto["economicImpacts"];
} => {
  const economicImpacts: SiteStatuQuoEconomicImpact[] = [];
  const impactMetrics: SiteStatuQuoImpactMetric[] = [];

  // --- Impacts liés à la nature du site ---
  if (siteData.nature === "FRICHE") {
    const fricheCostsImpacts: FricheCostsIndirectEconomicImpacts[] = siteData.yearlyExpenses
      .filter(
        (expense) =>
          FRICHE_COST_PURPOSES.some((purpose) => purpose === expense.purpose) &&
          expense.amount !== 0,
      )
      .map((expense): FricheCostsIndirectEconomicImpacts => {
        const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
          -1 * expense.amount,
          ["discount"],
        );
        return {
          name:
            expense.bearer === "owner"
              ? "fricheMaintenanceAndSecuringCostsForOwner"
              : "fricheMaintenanceAndSecuringCostsForTenant",
          total: sumList(detailsByYear),
          detailsByYear,
          details: expense.purpose as FricheCostsIndirectEconomicImpacts["details"],
          cumulativeByYear: computeCumulativeByYear(detailsByYear),
        };
      });
    economicImpacts.push(...fricheCostsImpacts);

    if (siteData.accidentsDeaths) {
      impactMetrics.push({
        name: "fricheAccidentsDeaths",
        total: siteData.accidentsDeaths,
      });
    }

    if (siteData.accidentsSevereInjuries) {
      impactMetrics.push({
        name: "fricheAccidentsSevereInjuries",
        total: siteData.accidentsSevereInjuries,
      });
    }

    if (siteData.accidentsMinorInjuries) {
      impactMetrics.push({
        name: "fricheAccidentsMinorInjuries",
        total: siteData.accidentsMinorInjuries,
      });
    }
  }

  if (siteData.agriculturalOperationActivity && siteData.isSiteOperated) {
    impactMetrics.push({
      name: "operationsFullTimeJobs",
      total: computeAgriculturalOperationEtpFromSurface({
        operationActivity: siteData.agriculturalOperationActivity,
        surfaceArea: siteData.surfaceArea,
      }),
    });
  }

  // taxes
  const taxes = siteData.yearlyExpenses.filter(
    ({ purpose }) =>
      purpose === "taxes" || purpose === "operationsTaxes" || purpose === "propertyTaxes",
  );
  if (taxes.length !== 0) {
    const taxesImpacts: TaxesIncomeIndirectEconomicImpacts[] = taxes.map(
      (expense): TaxesIncomeIndirectEconomicImpacts => {
        const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(expense.amount, [
          "discount",
          "gdp_evolution",
        ]);
        return {
          name: "taxesIncome",
          total: sumList(detailsByYear),
          details: expense.purpose as TaxesIncomeIndirectEconomicImpacts["details"],
          detailsByYear,
          cumulativeByYear: computeCumulativeByYear(detailsByYear),
        };
      },
    );
    economicImpacts.push(...taxesImpacts);
  }

  if (siteData.contaminatedSoilSurface) {
    const waterRegulationMonetaryImpact = computeWaterRegulationMonetaryValue({
      decontaminatedSurfaceArea: -siteData.contaminatedSoilSurface,
    });

    if (waterRegulationMonetaryImpact !== 0) {
      const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
        waterRegulationMonetaryImpact,
        ["discount", "gdp_evolution"],
      );
      economicImpacts.push({
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total: sumList(detailsByYear),
        name: "waterRegulation",
      });
    }

    impactMetrics.push({
      name: "contaminatedSurface",
      total: siteData.contaminatedSoilSurface,
    });
  }

  if (siteData.soilsCarbonStorage) {
    const storedCo2Eq = convertCarbonToCO2eq(siteData.soilsCarbonStorage.total);
    const co2eqDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      storedCo2Eq,
      ["co2_value"],
      { endYearIndex: 1 },
    );
    economicImpacts.push({
      detailsByYear: co2eqDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(co2eqDetailsByYear),
      total: sumList(co2eqDetailsByYear),
      name: "storedCo2Eq",
    });

    impactMetrics.push({
      name: "storedCo2Eq",
      total: storedCo2Eq,
    });
  }

  const surfaceWithEcosystemBenefits = sumSoilsSurfaceAreasWhere(
    siteData.soilsDistribution,
    isSurfaceWithEcosystemBenefits,
  );
  const prairieSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isPrairie);
  const forestSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isForest);
  const wetLandSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isWetLand);

  const permeableSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isPermeableSoil);
  if (permeableSurface) {
    impactMetrics.push({
      name: "permeableSurface",
      total: permeableSurface,
    });
  }

  const natureRelatedWelnessAndLeisure = computeNatureRelatedWellnessAndLeisureMonetaryValue({
    prairieSurfaceArea: prairieSurface,
    forestSurfaceArea: forestSurface,
    wetLandSurfaceArea: wetLandSurface,
  });
  if (natureRelatedWelnessAndLeisure) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      natureRelatedWelnessAndLeisure,
      ["discount", "gdp_evolution"],
    );
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "natureRelatedWelnessAndLeisure",
    });
  }

  const forestRelatedProduct = computeForestRelatedProductMonetaryValue(forestSurface);
  if (forestRelatedProduct) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      forestRelatedProduct,
      ["discount", "gdp_evolution"],
    );
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "forestRelatedProduct",
    });
  }

  const pollination = computePollinisationMonetaryValue(surfaceWithEcosystemBenefits);
  if (pollination) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(pollination, [
      "discount",
      "gdp_evolution",
    ]);
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "pollination",
    });
  }

  const invasiveSpeciesRegulation = computeInvasiveSpeciesRegulationMonetaryValue(
    surfaceWithEcosystemBenefits,
  );
  if (invasiveSpeciesRegulation) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      invasiveSpeciesRegulation,
      ["discount", "gdp_evolution"],
    );
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "invasiveSpeciesRegulation",
    });
  }

  const waterCycle = computeWaterCycleMonetaryValue(
    sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isSurfaceWithPermanentVegetation),
    sumSoilsSurfaceAreasWhere(
      siteData.soilsDistribution,
      isPermeableSurfaceWithoutPermanentVegetation,
    ),
  );
  if (waterCycle) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(waterCycle, [
      "discount",
      "gdp_evolution",
    ]);
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "waterCycle",
    });
  }

  const nitrogenCycle = computeNitrogenCycleMonetaryValue({
    prairieSurfaceArea: prairieSurface,
    wetLandSurfaceArea: wetLandSurface,
  });
  if (nitrogenCycle) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(nitrogenCycle, [
      "discount",
      "gdp_evolution",
    ]);
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "nitrogenCycle",
    });
  }

  const soilErosion = computeSoilErosionMonetaryValue(surfaceWithEcosystemBenefits);
  if (soilErosion) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(soilErosion, [
      "discount",
      "gdp_evolution",
    ]);
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "soilErosion",
    });
  }

  // -- Revenus liés à la location du site
  const currentRentCost = siteData.yearlyExpenses.find(({ purpose }) => purpose === "rent");

  if (currentRentCost) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      currentRentCost.amount,
      ["discount"],
    );
    economicImpacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "rentalIncome",
    });
  }

  return {
    impactMetrics,
    economicImpacts: {
      total: roundToInteger(sumListWithKey(economicImpacts, "total")),
      details: economicImpacts,
    },
  };
};
