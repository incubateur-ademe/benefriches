import {
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  sumListWithKey,
  AvoidedFricheCostsImpact,
  ReconversionProjectImpacts,
  SocioEconomicImpact,
  AvoidedCO2EqEmissions,
  TaxesIncomeImpact,
  AvoidedFricheCostsIndirectEconomicImpacts,
} from "shared";

import { ProjectImpactsState } from "../application/project-impacts/projectImpacts.reducer";

export type SocioEconomicImpactByCategory = {
  total: number;
  impacts: {
    name: SocioEconomicMainImpactName;
    actors: {
      name: string;
      value: number;
      details?: {
        name: SocioEconomicDetailsName;
        value: number;
      }[];
    }[];
  }[];
};

export type SocioEconomicDetailedImpact = {
  total: number;
  economicDirect: SocioEconomicImpactByCategory;
  economicIndirect: SocioEconomicImpactByCategory;
  socialMonetary: SocioEconomicImpactByCategory;
  environmentalMonetary: SocioEconomicImpactByCategory;
};

export type SocioEconomicImpactName = SocioEconomicMainImpactName | SocioEconomicDetailsName;
export type SocioEconomicMainImpactName = SocioEconomicImpact["impact"];

export type SocioEconomicDetailsName =
  | TaxesIncomeImpact["details"][number]["impact"]
  | AvoidedCO2EqEmissions["details"][number]["impact"]
  | EcosystemServicesImpact["details"][number]["impact"]
  | AvoidedTrafficAccidentsImpact["details"][number]["impact"]
  | AvoidedFricheCostsImpact["details"][number]["impact"];

type Impact = {
  impact: SocioEconomicMainImpactName;
  impactCategory: SocioEconomicImpact["actor"];
  actor: string;
  amount: number;
  details?: {
    amount: number;
    impact: SocioEconomicDetailsName;
  }[];
};

const formatImpactsWithActors = (impacts: Impact[]) => {
  return Array.from(new Set(impacts.map(({ impact }) => impact))).map((impactName) => {
    return {
      name: impactName,
      actors: impacts
        .filter((impact) => impact.impact === impactName)
        .map((impact) => {
          if (!impact.details) {
            return {
              value: impact.amount,
              name: impact.actor,
            };
          }
          return {
            value: impact.amount,
            name: impact.actor,
            details: impact.details.map(({ amount, impact }) => ({ name: impact, value: amount })),
          };
        }),
    };
  });
};

export const getSocioEconomicProjectImpacts = (
  impactsData?: ProjectImpactsState["impacts"],
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
              amount: item.total,
            });
          case "avoidedAccidentsMinorInjuriesExpenses":
            return result.concat({
              impact: "avoided_traffic_minor_injuries",
              amount: item.total,
            });

          case "avoidedAccidentsSevereInjuriesExpenses":
            return result.concat({ impact: "avoided_traffic_severe_injuries", amount: item.total });
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
      amount: sumListWithKey(co2, "total"),
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
              amount: item.total,
            });
          case "avoidedCo2eqWithEnergyProduction":
            return result.concat({
              impact: "avoided_co2_eq_with_enr",
              amount: item.total,
            });

          case "avoidedTrafficCo2EqEmissions":
            return result.concat({
              impact: "avoided_traffic_co2_eq_emissions",
              amount: item.total,
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
      amount: sumListWithKey(ecosystemServices, "total"),
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
              amount: item.total,
            });
          case "invasiveSpeciesRegulation":
            return result.concat({
              impact: "invasive_species_regulation",
              amount: item.total,
            });

          case "natureRelatedWelnessAndLeisure":
            return result.concat({
              impact: "nature_related_wellness_and_leisure",
              amount: item.total,
            });
          case "newStoredCo2Eq":
            return result.concat({ impact: "soils_co2_eq_storage", amount: item.total });
          case "nitrogenCycle":
            return result.concat({ impact: "nitrogen_cycle", amount: item.total });
          case "pollination":
            return result.concat({ impact: "pollination", amount: item.total });

          case "waterCycle":
            return result.concat({ impact: "water_cycle", amount: item.total });
          case "soilErosion":
            return result.concat({ impact: "soil_erosion", amount: item.total });
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
      amount: sumListWithKey(taxes, "total"),
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
              amount: item.total,
            });
          case "projectNewHousesTaxesIncome":
            return result.concat({
              impact: "project_new_houses_taxes_income",
              amount: item.total,
            });

          case "projectPhotovoltaicTaxesIncome":
            return result.concat({
              impact: "project_photovoltaic_taxes_income",
              amount: item.total,
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
      amount: sumListWithKey(frichesCostsForOwner, "total"),
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
              amount: item.total,
            });
          case "illegalDumpingCost":
            return result.concat({
              impact: "avoided_illegal_dumping_costs",
              amount: item.total,
            });

          case "maintenance":
            return result.concat({
              impact: "avoided_maintenance_costs",
              amount: item.total,
            });
          case "otherSecuringCosts":
            return result.concat({
              impact: "avoided_other_securing_costs",
              amount: item.total,
            });
          case "security":
            return result.concat({
              impact: "avoided_security_costs",
              amount: item.total,
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
      amount: sumListWithKey(frichesCostsForTenant, "total"),
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
              amount: item.total,
            });
          case "illegalDumpingCost":
            return result.concat({
              impact: "avoided_illegal_dumping_costs",
              amount: item.total,
            });

          case "maintenance":
            return result.concat({
              impact: "avoided_maintenance_costs",
              amount: item.total,
            });
          case "otherSecuringCosts":
            return result.concat({
              impact: "avoided_other_securing_costs",
              amount: item.total,
            });
          case "security":
            return result.concat({
              impact: "avoided_security_costs",
              amount: item.total,
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
            amount: item.total,
          });

        case "avoidedAirPollutionHealthExpenses":
          return result.concat({
            impact: "avoided_air_pollution",
            impactCategory: "social_monetary",
            actor: "french_society",
            amount: item.total,
          });

        case "avoidedCarRelatedExpenses":
          return result.concat({
            impact: "avoided_car_related_expenses",
            impactCategory: "economic_indirect",
            actor: "local_people",
            amount: item.total,
          });

        case "avoidedPropertyDamageExpenses":
          return result.concat({
            impact: "avoided_property_damages_expenses",
            impactCategory: "economic_indirect",
            actor: "french_society",
            amount: item.total,
          });

        case "fricheRoadsAndUtilitiesExpenses":
          return result.concat({
            impact: "roads_and_utilities_maintenance_expenses",
            impactCategory: "economic_direct",
            actor: "community",
            amount: item.total,
          });

        case "localPropertyValueIncrease":
          return result.concat({
            amount: item.total,
            impact: "local_property_value_increase",
            impactCategory: "economic_indirect",
            actor: "local_people",
          });

        case "localTransferDutiesIncrease":
          return result.concat({
            impact: "local_transfer_duties_increase",
            impactCategory: "economic_indirect",
            actor: "community",
            amount: item.total,
          });

        case "oldRentalIncomeLoss":
          return result.concat({
            impact: "site_rental_income_loss",
            impactCategory: "economic_direct",
            amount: item.total,
            actor: impactsData.stakeholders.current.owner?.structureName ?? "Ancien Propriétaire",
          });

        case "previousSiteOperationBenefitLoss":
          return result.concat({
            impact: "site_operation_benefits_loss",
            impactCategory: "economic_indirect",
            amount: item.total,
            actor: impactsData.stakeholders.current.operator?.structureName ?? "Ancien exploitant",
          });

        case "projectedRentalIncome":
          return result.concat({
            impact: "rental_income",
            impactCategory: "economic_direct",
            amount: item.total,
            actor: impactsData.stakeholders.future.owner?.structureName ?? "Nouveau Propriétaire",
          });

        // case "projectOperatingEconomicBalance":
        //   return result.concat({
        //     impact: "project_operation_benefits",
        //     impactCategory: "economic_indirect",
        //     amount: item.total,
        //     actor: impactsData.stakeholders.future.operator?.structureName ?? "Futur exploitant",
        //   });

        case "propertyTransferDutiesIncome":
          return result.concat({
            impact: "property_transfer_duties_income",
            impactCategory: "economic_direct",
            actor: "community",
            amount: item.total,
          });

        case "travelTimeSavedPerTravelerExpenses":
          return result.concat({
            impact: "travel_time_saved",
            impactCategory: "social_monetary",
            actor: "local_people",
            amount: item.total,
          });

        case "waterRegulation":
          return result.concat({
            amount: item.total,
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
    total: impactsData.aggregatedReconversionImpacts.indirectEconomicImpacts.total,
  };
};

export const getSocioEconomicProjectImpactsGroupedByCategory = (
  impactsData?: ProjectImpactsState["impacts"],
): SocioEconomicDetailedImpact => {
  const { impacts: socioEconomicImpacts } = getSocioEconomicProjectImpacts(impactsData);

  const economicDirectImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "economic_direct",
  );
  const economicDirect = {
    total: sumListWithKey(economicDirectImpacts, "amount"),
    impacts: formatImpactsWithActors(economicDirectImpacts),
  };

  const economicIndirectImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "economic_indirect",
  );
  const economicIndirect = {
    total: sumListWithKey(economicIndirectImpacts, "amount"),
    impacts: formatImpactsWithActors(economicIndirectImpacts),
  };

  const socialMonetaryImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "social_monetary",
  );
  const socialMonetary = {
    total: sumListWithKey(socialMonetaryImpacts, "amount"),
    impacts: formatImpactsWithActors(socialMonetaryImpacts),
  };

  const environmentalMonetaryImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impactCategory === "environmental_monetary",
  );
  const environmentalMonetary = {
    total: sumListWithKey(environmentalMonetaryImpacts, "amount"),
    impacts: formatImpactsWithActors(environmentalMonetaryImpacts),
  };

  return {
    total:
      economicDirect.total +
      economicIndirect.total +
      environmentalMonetary.total +
      socialMonetary.total,
    economicDirect,
    economicIndirect,
    socialMonetary,
    environmentalMonetary,
  };
};

type ImpactName = ReconversionProjectImpacts["socioeconomic"]["impacts"][number]["impact"];

const getGroupedByImpactName = (impacts: { amount: number; impact: ImpactName }[]) => {
  const byImpactsName = Array.from(new Set(impacts.map(({ impact }) => impact))).map(
    (impactName) => {
      return {
        name: impactName,
        value: sumListWithKey(
          impacts.filter((impact) => impact.impact === impactName),
          "amount",
        ),
      };
    },
  );
  return {
    impacts: byImpactsName,
    total: sumListWithKey(impacts, "amount"),
  };
};

export type SocioEconomicImpactByActor = {
  name: string;
  total: number;
  impacts: { name: SocioEconomicMainImpactName; value: number }[];
}[];
export const getSocioEconomicProjectImpactsByActor = (
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"] = [],
): SocioEconomicImpactByActor => {
  const mergedActors = socioEconomicImpacts.map((impact) => ({
    ...impact,
    actor: ["local_people", "local_companies"].includes(impact.actor)
      ? "local_people_or_companies"
      : impact.actor,
  }));

  const distinctActors = Array.from(new Set(mergedActors.map(({ actor }) => actor)));

  const byActor = distinctActors.map((actor) => {
    const impacts = mergedActors.filter((impact) => impact.actor === actor);
    return {
      name: actor,
      ...getGroupedByImpactName(impacts),
    };
  });

  return byActor;
};
