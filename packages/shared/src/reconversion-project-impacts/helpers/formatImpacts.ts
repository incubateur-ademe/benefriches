import { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { RecurringExpensePurpose } from "../../reconversion-projects";
import { roundToInteger, sumListWithKey } from "../../services";
import {
  AvoidedFricheCostsIndirectEconomicImpacts,
  ProjectDevelopmentEconomicBalanceItem,
  ProjectOperatingEconomicBalanceItem,
} from "../projectImpactsDataView.types";
import {
  AvoidedCO2EqEmissions,
  AvoidedFricheCostsImpact,
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  SocioEconomicImpact,
  TaxesIncomeImpact,
} from "../socioEconomic.types";
import { EconomicBalanceImpactResult, ReconversionProjectImpacts } from "../types";

type ProjectOperatingEconomicBalanceItemWithDetails<
  D extends ProjectOperatingEconomicBalanceItem["details"],
> = Omit<ProjectOperatingEconomicBalanceItem, "details"> & { details: D };

export const formatEconomicBalanceImpact = (
  projectEconomicBalance: GetReconversionProjectImpactsResultDto["impacts"]["projectEconomicBalance"],
  developmentPlanDeveloperName: string,
): EconomicBalanceImpactResult => {
  const siteReinstatement = projectEconomicBalance.details
    .filter(
      (
        item,
      ): item is Extract<ProjectDevelopmentEconomicBalanceItem, { name: "siteReinstatement" }> =>
        item.name === "siteReinstatement",
    )
    .map((item) => ({
      amount: item.total * -1,
      purpose: item.details,
    }));

  const developmentPlanInstallation = projectEconomicBalance.details
    .filter(
      (
        item,
      ): item is Extract<ProjectDevelopmentEconomicBalanceItem, { name: "projectInstallation" }> =>
        item.name === "projectInstallation",
    )
    .map((item) => ({
      amount: item.total * -1,
      purpose: item.details,
    }));

  const buildingsConstructionAndRehabilitation = projectEconomicBalance.details
    .filter(
      (
        item,
      ): item is Extract<
        ProjectDevelopmentEconomicBalanceItem,
        { name: "projectBuildingsInstallation" }
      > => item.name === "projectBuildingsInstallation",
    )
    .map((item) => ({
      amount: item.total * -1,
      purpose: item.details,
    }));

  const financialAssistance = projectEconomicBalance.details
    .filter(
      (
        item,
      ): item is Extract<
        ProjectDevelopmentEconomicBalanceItem,
        { name: "financialAssistanceRevenues" }
      > => item.name === "financialAssistanceRevenues",
    )
    .map((item) => ({
      amount: item.total,
      source: item.details,
    }));

  const sitePurchase = projectEconomicBalance.details.find(
    ({ name }) => name === "sitePurchase",
  )?.total;

  const siteReinstatementTotal = sumListWithKey(siteReinstatement, "amount");
  const developmentPlanInstallationTotal = sumListWithKey(developmentPlanInstallation, "amount");

  const buildingsConstructionAndRehabilitationTotal = sumListWithKey(
    buildingsConstructionAndRehabilitation,
    "amount",
  );

  const siteResale = projectEconomicBalance.details.find(
    ({ name }) => name === "siteResaleRevenue",
  )?.total;
  const buildingsResale = projectEconomicBalance.details.find(
    ({ name }) => name === "buildingsResaleRevenue",
  )?.total;

  const financialAssistanceTotal = roundToInteger(sumListWithKey(financialAssistance, "amount"));

  const sitePurchaseTotal = sitePurchase ? sitePurchase * -1 : undefined;

  const operationEconomicBalance = projectEconomicBalance.details.filter(
    (item): item is ProjectOperatingEconomicBalanceItem =>
      item.name === "projectOperatingEconomicBalance",
  );
  if (operationEconomicBalance.length > 0) {
    const costs = operationEconomicBalance.filter(
      (item): item is ProjectOperatingEconomicBalanceItemWithDetails<RecurringExpensePurpose> =>
        item.total < 0,
    );
    const revenues = operationEconomicBalance.filter(
      (
        item,
      ): item is ProjectOperatingEconomicBalanceItemWithDetails<"other" | "operations" | "rent"> =>
        item.total > 0,
    );
    const operationCostsTotal =
      costs.length > 0 ? roundToInteger(sumListWithKey(costs, "total")) * -1 : 0;
    const operationsRevenuesTotal = roundToInteger(sumListWithKey(revenues, "total"));

    return {
      total: roundToInteger(projectEconomicBalance.total),
      bearer: developmentPlanDeveloperName,
      costs: {
        total:
          siteReinstatementTotal +
          developmentPlanInstallationTotal +
          operationCostsTotal +
          buildingsConstructionAndRehabilitationTotal +
          (sitePurchaseTotal ?? 0),
        operationsCosts: {
          total: operationCostsTotal,
          costs: costs.map(({ details, total }) => ({
            purpose: details,
            amount: roundToInteger(total * -1),
          })),
        },
        developmentPlanInstallation:
          developmentPlanInstallation.length > 0
            ? {
                total: developmentPlanInstallationTotal,
                costs: developmentPlanInstallation,
              }
            : undefined,
        buildingsConstructionAndRehabilitation:
          buildingsConstructionAndRehabilitation.length > 0
            ? {
                total: buildingsConstructionAndRehabilitationTotal,
                costs: buildingsConstructionAndRehabilitation,
              }
            : undefined,
        siteReinstatement:
          siteReinstatement.length > 0
            ? {
                total: siteReinstatementTotal,
                costs: siteReinstatement,
              }
            : undefined,
        sitePurchase: sitePurchaseTotal,
      },
      revenues: {
        total:
          (siteResale ?? 0) +
          (buildingsResale ?? 0) +
          operationsRevenuesTotal +
          financialAssistanceTotal,
        siteResale: projectEconomicBalance.details.find(({ name }) => name === "siteResaleRevenue")
          ?.total,
        buildingsResale: projectEconomicBalance.details.find(
          ({ name }) => name === "buildingsResaleRevenue",
        )?.total,
        operationsRevenues: {
          total: roundToInteger(sumListWithKey(revenues, "total")),
          revenues: revenues.map((item) => ({
            amount: roundToInteger(item.total),
            source: item.details,
          })),
        },
        financialAssistance:
          financialAssistance.length > 0
            ? {
                total: financialAssistanceTotal,
                revenues: financialAssistance,
              }
            : undefined,
      },
    };
  }

  return {
    total: projectEconomicBalance.total,
    bearer: developmentPlanDeveloperName,
    costs: {
      total:
        siteReinstatementTotal +
        developmentPlanInstallationTotal +
        (sitePurchaseTotal ?? 0) +
        buildingsConstructionAndRehabilitationTotal,
      developmentPlanInstallation:
        developmentPlanInstallation.length > 0
          ? {
              total: sumListWithKey(developmentPlanInstallation, "amount"),
              costs: developmentPlanInstallation,
            }
          : undefined,
      buildingsConstructionAndRehabilitation:
        buildingsConstructionAndRehabilitation.length > 0
          ? {
              total: sumListWithKey(buildingsConstructionAndRehabilitation, "amount"),
              costs: buildingsConstructionAndRehabilitation,
            }
          : undefined,
      siteReinstatement:
        siteReinstatement.length > 0
          ? {
              total: sumListWithKey(siteReinstatement, "amount"),
              costs: siteReinstatement,
            }
          : undefined,
      sitePurchase: sitePurchase ? sitePurchase * -1 : undefined,
    },
    revenues: {
      total: (siteResale ?? 0) + (buildingsResale ?? 0) + financialAssistanceTotal,
      siteResale: projectEconomicBalance.details.find(({ name }) => name === "siteResaleRevenue")
        ?.total,
      buildingsResale: projectEconomicBalance.details.find(
        ({ name }) => name === "buildingsResaleRevenue",
      )?.total,
      financialAssistance:
        financialAssistance.length > 0
          ? {
              total: financialAssistanceTotal,
              revenues: financialAssistance,
            }
          : undefined,
    },
  };
};

export const formatAsSocioEconomicImpacts = (
  impactsData?: GetReconversionProjectImpactsResultDto["impacts"],
): ReconversionProjectImpacts["socioeconomic"] => {
  if (!impactsData) {
    return {
      total: 0,
      impacts: [],
    };
  }
  const socioEconomicImpacts: SocioEconomicImpact[] = [];

  const accidents =
    impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
      (item) =>
        item.name === "avoidedAccidentsDeathsExpenses" ||
        item.name === "avoidedAccidentsMinorInjuriesExpenses" ||
        item.name === "avoidedAccidentsSevereInjuriesExpenses",
    );
  if (accidents && accidents?.length > 0) {
    socioEconomicImpacts.push({
      impact: "avoided_traffic_accidents",
      impactCategory: "social_monetary",
      amount: sumListWithKey(accidents, "total"),
      actor: "french_society",
      details: accidents.reduce<
        {
          amount: number;
          impact: AvoidedTrafficAccidentsImpact["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.name) {
          case "avoidedAccidentsDeathsExpenses":
            return result.concat({
              impact: "avoided_traffic_deaths",
              amount: roundToInteger(item.total),
            });
          case "avoidedAccidentsMinorInjuriesExpenses":
            return result.concat({
              impact: "avoided_traffic_minor_injuries",
              amount: roundToInteger(item.total),
            });

          case "avoidedAccidentsSevereInjuriesExpenses":
            return result.concat({
              impact: "avoided_traffic_severe_injuries",
              amount: roundToInteger(item.total),
            });
          default:
            return result;
        }
      }, []),
    });
  }

  const co2 = impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
    (item) =>
      [
        "avoidedAirConditioningCo2eqEmissions",
        "avoidedCo2eqWithEnergyProduction",
        "avoidedTrafficCo2EqEmissions",
      ].some((name) => name === item.name),
  );
  if (co2 && co2?.length > 0) {
    socioEconomicImpacts.push({
      impact: "avoided_co2_eq_emissions",
      impactCategory: "environmental_monetary",
      actor: "human_society",
      amount: roundToInteger(sumListWithKey(co2, "total")),
      details: co2.reduce<
        {
          amount: number;
          impact: AvoidedCO2EqEmissions["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.name) {
          case "avoidedAirConditioningCo2eqEmissions":
            return result.concat({
              impact: "avoided_air_conditioning_co2_eq_emissions",
              amount: roundToInteger(item.total),
            });
          case "avoidedCo2eqWithEnergyProduction":
            return result.concat({
              impact: "avoided_co2_eq_with_enr",
              amount: roundToInteger(item.total),
            });

          case "avoidedTrafficCo2EqEmissions":
            return result.concat({
              impact: "avoided_traffic_co2_eq_emissions",
              amount: roundToInteger(item.total),
            });
          default:
            return result;
        }
      }, []),
    });
  }

  const ecosystemServices =
    impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter((item) =>
      [
        "forestRelatedProduct",
        "invasiveSpeciesRegulation",
        "natureRelatedWelnessAndLeisure",
        "newStoredCo2Eq",
        "nitrogenCycle",
        "pollination",
        "waterCycle",
        "soilErosion",
        "storedCo2Eq",
      ].some((name) => name === item.name),
    );
  if (ecosystemServices && ecosystemServices?.length > 0) {
    socioEconomicImpacts.push({
      impact: "ecosystem_services",
      impactCategory: "environmental_monetary",
      actor: "human_society",
      amount: roundToInteger(sumListWithKey(ecosystemServices, "total")),
      details: ecosystemServices.reduce<
        {
          amount: number;
          impact: EcosystemServicesImpact["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.name) {
          case "forestRelatedProduct":
            return result.concat({
              impact: "forest_related_product",
              amount: roundToInteger(item.total),
            });
          case "invasiveSpeciesRegulation":
            return result.concat({
              impact: "invasive_species_regulation",
              amount: roundToInteger(item.total),
            });

          case "natureRelatedWelnessAndLeisure":
            return result.concat({
              impact: "nature_related_wellness_and_leisure",
              amount: roundToInteger(item.total),
            });
          case "newStoredCo2Eq":
            return result.concat({
              impact: "soils_co2_eq_storage",
              amount: roundToInteger(item.total),
            });
          case "nitrogenCycle":
            return result.concat({ impact: "nitrogen_cycle", amount: roundToInteger(item.total) });
          case "pollination":
            return result.concat({ impact: "pollination", amount: roundToInteger(item.total) });

          case "waterCycle":
            return result.concat({ impact: "water_cycle", amount: roundToInteger(item.total) });
          case "soilErosion":
            return result.concat({ impact: "soil_erosion", amount: roundToInteger(item.total) });
          default:
            return result;
        }
      }, []),
    });
  }

  const taxes = impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
    (item) =>
      [
        "projectNewCompanyTaxationIncome",
        "projectNewHousesTaxesIncome",
        "projectPhotovoltaicTaxesIncome",
      ].some((name) => name === item.name),
  );
  if (taxes && taxes?.length > 0) {
    socioEconomicImpacts.push({
      impact: "taxes_income",
      impactCategory: "economic_indirect",
      actor: "community",
      amount: roundToInteger(sumListWithKey(taxes, "total")),
      details: taxes.reduce<
        {
          amount: number;
          impact: TaxesIncomeImpact["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.name) {
          case "projectNewCompanyTaxationIncome":
            return result.concat({
              impact: "project_new_company_taxation_income",
              amount: roundToInteger(item.total),
            });
          case "projectNewHousesTaxesIncome":
            return result.concat({
              impact: "project_new_houses_taxes_income",
              amount: roundToInteger(item.total),
            });

          case "projectPhotovoltaicTaxesIncome":
            return result.concat({
              impact: "project_photovoltaic_taxes_income",
              amount: roundToInteger(item.total),
            });
          default:
            return result;
        }
      }, []),
    });
  }

  const frichesCostsForOwner =
    impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
      (item): item is AvoidedFricheCostsIndirectEconomicImpacts =>
        "avoidedFricheMaintenanceAndSecuringCostsForOwner" === item.name,
    );
  if (frichesCostsForOwner && frichesCostsForOwner?.length > 0) {
    socioEconomicImpacts.push({
      impact: "avoided_friche_costs",
      impactCategory: "economic_direct",
      actor: impactsData?.stakeholders.current.owner.structureName ?? "Propriétaire",
      amount: roundToInteger(sumListWithKey(frichesCostsForOwner, "total")),
      details: frichesCostsForOwner.reduce<
        {
          amount: number;
          impact: AvoidedFricheCostsImpact["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.details) {
          case "accidentsCost":
            return result.concat({
              impact: "avoided_accidents_costs",
              amount: roundToInteger(item.total),
            });
          case "illegalDumpingCost":
            return result.concat({
              impact: "avoided_illegal_dumping_costs",
              amount: roundToInteger(item.total),
            });

          case "maintenance":
            return result.concat({
              impact: "avoided_maintenance_costs",
              amount: roundToInteger(item.total),
            });
          case "otherSecuringCosts":
            return result.concat({
              impact: "avoided_other_securing_costs",
              amount: roundToInteger(item.total),
            });
          case "security":
            return result.concat({
              impact: "avoided_security_costs",
              amount: roundToInteger(item.total),
            });
          default:
            return result;
        }
      }, []),
    });
  }

  const frichesCostsForTenant =
    impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.filter(
      (item): item is AvoidedFricheCostsIndirectEconomicImpacts =>
        "avoidedFricheMaintenanceAndSecuringCostsForTenant" === item.name,
    );
  if (frichesCostsForTenant && frichesCostsForTenant?.length > 0) {
    socioEconomicImpacts.push({
      impact: "avoided_friche_costs",
      impactCategory: "economic_direct",
      actor: impactsData?.stakeholders.current.tenant?.structureName ?? "Locataire",
      amount: roundToInteger(sumListWithKey(frichesCostsForTenant, "total")),
      details: frichesCostsForTenant.reduce<
        {
          amount: number;
          impact: AvoidedFricheCostsImpact["details"][number]["impact"];
        }[]
      >((result, item) => {
        switch (item.details) {
          case "accidentsCost":
            return result.concat({
              impact: "avoided_accidents_costs",
              amount: roundToInteger(item.total),
            });
          case "illegalDumpingCost":
            return result.concat({
              impact: "avoided_illegal_dumping_costs",
              amount: roundToInteger(item.total),
            });

          case "maintenance":
            return result.concat({
              impact: "avoided_maintenance_costs",
              amount: roundToInteger(item.total),
            });
          case "otherSecuringCosts":
            return result.concat({
              impact: "avoided_other_securing_costs",
              amount: roundToInteger(item.total),
            });
          case "security":
            return result.concat({
              impact: "avoided_security_costs",
              amount: roundToInteger(item.total),
            });
          default:
            return result;
        }
      }, []),
    });
  }

  socioEconomicImpacts.push(
    ...impactsData?.aggregatedReconversionImpacts.indirectEconomicImpacts.details.reduce<
      SocioEconomicImpact[]
    >((result, item) => {
      switch (item.name) {
        case "avoidedAirConditioningExpenses":
          return result.concat({
            impact: "avoided_air_conditioning_expenses",
            impactCategory: "economic_indirect",
            actor: "local_people",
            amount: roundToInteger(item.total),
          });

        case "avoidedAirPollutionHealthExpenses":
          return result.concat({
            impact: "avoided_air_pollution",
            impactCategory: "social_monetary",
            actor: "french_society",
            amount: roundToInteger(item.total),
          });

        case "avoidedCarRelatedExpenses":
          return result.concat({
            impact: "avoided_car_related_expenses",
            impactCategory: "economic_indirect",
            actor: "local_people",
            amount: roundToInteger(item.total),
          });

        case "avoidedPropertyDamageExpenses":
          return result.concat({
            impact: "avoided_property_damages_expenses",
            impactCategory: "economic_indirect",
            actor: "french_society",
            amount: roundToInteger(item.total),
          });

        case "fricheRoadsAndUtilitiesExpenses":
          return result.concat({
            impact: "roads_and_utilities_maintenance_expenses",
            impactCategory: "economic_direct",
            actor: "community",
            amount: roundToInteger(item.total),
          });

        case "localPropertyValueIncrease":
          return result.concat({
            amount: roundToInteger(item.total),
            impact: "local_property_value_increase",
            impactCategory: "economic_indirect",
            actor: "local_people",
          });

        case "localTransferDutiesIncrease":
          return result.concat({
            impact: "local_transfer_duties_increase",
            impactCategory: "economic_indirect",
            actor: "community",
            amount: roundToInteger(item.total),
          });

        case "oldRentalIncomeLoss":
          return result.concat({
            impact: "site_rental_income_loss",
            impactCategory: "economic_direct",
            amount: roundToInteger(item.total),
            actor: impactsData.stakeholders.current.owner?.structureName ?? "Ancien Propriétaire",
          });

        case "previousSiteOperationBenefitLoss":
          return result.concat({
            impact: "site_operation_benefits_loss",
            impactCategory: "economic_indirect",
            amount: roundToInteger(item.total),
            actor: impactsData.stakeholders.current.operator?.structureName ?? "Ancien exploitant",
          });

        case "projectedRentalIncome":
          return result.concat({
            impact: "rental_income",
            impactCategory: "economic_direct",
            amount: roundToInteger(item.total),
            actor: impactsData.stakeholders.future.owner?.structureName ?? "Nouveau Propriétaire",
          });

        // case "projectOperatingEconomicBalance":
        //   return result.concat({
        //     impact: "project_operation_benefits",
        //     impactCategory: "economic_indirect",
        //     amount: roundToInteger(item.total),
        //     actor: impactsData.stakeholders.future.operator?.structureName ?? "Futur exploitant",
        //   });

        case "propertyTransferDutiesIncome":
          return result.concat({
            impact: "property_transfer_duties_income",
            impactCategory: "economic_direct",
            actor: "community",
            amount: roundToInteger(item.total),
          });

        case "travelTimeSavedPerTravelerExpenses":
          return result.concat({
            impact: "travel_time_saved",
            impactCategory: "social_monetary",
            actor: "local_people",
            amount: roundToInteger(item.total),
          });

        case "waterRegulation":
          return result.concat({
            amount: roundToInteger(item.total),
            actor: "community",
            impactCategory: "environmental_monetary",
            impact: "water_regulation",
          });
        default:
          return result;
      }
    }, []),
  );
  return {
    impacts: socioEconomicImpacts,
    total: roundToInteger(impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total),
  };
};
