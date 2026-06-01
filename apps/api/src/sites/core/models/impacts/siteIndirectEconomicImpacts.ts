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
  SiteIndirectEconomicImpact,
} from "shared";

import { computeCumulativeByYear } from "src/reconversion-projects/core/model/project-impacts/break-even-level/projectIndirectEconomicImpacts";
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
import { FRICHE_COST_PURPOSES } from "../../../../reconversion-projects/core/model/project-impacts/break-even-level/indirect-economic-impacts/siteReconversionRelatedEconomicImpacts";
import { SumOnEvolutionPeriodService } from "../../../../reconversion-projects/core/model/sum-on-evolution-period/SumOnEvolutionPeriodService";

type Props = {
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  siteData: {
    nature: SiteNature;
    yearlyExpenses: SiteYearlyExpense[];
    yearlyIncomes: SiteYearlyIncome[];
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorage;
    contaminatedSoilSurface?: number;
  };
};

export const getSiteStatuQuoIndirectsEconomicImpacts = ({
  siteData,
  sumOnEvolutionPeriodService,
}: Props): GetSiteImpactsDto["indirectEconomicImpacts"] => {
  const impacts: SiteIndirectEconomicImpact[] = [];

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
    impacts.push(...fricheCostsImpacts);
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
    impacts.push(...taxesImpacts);
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
      impacts.push({
        detailsByYear,
        cumulativeByYear: computeCumulativeByYear(detailsByYear),
        total: sumList(detailsByYear),
        name: "waterRegulation",
      });
    }
  }

  if (siteData.soilsCarbonStorage) {
    const co2eqDetailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      convertCarbonToCO2eq(siteData.soilsCarbonStorage.total),
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

  const surfaceWithEcosystemBenefits = sumSoilsSurfaceAreasWhere(
    siteData.soilsDistribution,
    isSurfaceWithEcosystemBenefits,
  );
  const prairieSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isPrairie);
  const forestSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isForest);
  const wetLandSurface = sumSoilsSurfaceAreasWhere(siteData.soilsDistribution, isWetLand);

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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
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
    impacts.push({
      detailsByYear: detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "rentalIncome",
    });
  }

  return { total: roundToInteger(sumListWithKey(impacts, "total")), details: impacts };
};
