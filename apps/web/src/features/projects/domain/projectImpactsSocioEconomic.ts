import {
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  sumListWithKey,
  AvoidedFricheCostsImpact,
  ReconversionProjectImpacts,
} from "shared";

import { ReconversionProjectImpactsResult } from "../application/fetchReconversionProjectImpacts.action";

type SocioEconomicImpactByCategory = {
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
type SocioEconomicMainImpactName =
  | "rental_income"
  | "avoided_friche_costs"
  | "avoided_car_related_expenses"
  | "avoided_property_damages_expenses"
  | "avoided_air_conditioning_expenses"
  | "travel_time_saved"
  | "avoided_traffic_accidents"
  | "avoided_traffic_co2_eq_emissions"
  | "avoided_air_conditioning_co2_eq_emissions"
  | "avoided_air_pollution"
  | "taxes_income"
  | "local_property_value_increase"
  | "property_transfer_duties_income"
  | "local_transfer_duties_increase"
  | "co2_benefit_monetary"
  | "ecosystem_services"
  | "water_regulation";

type SocioEconomicDetailsName =
  | "avoided_co2_eq_with_enr"
  | "avoided_traffic_co2_eq_emissions"
  | "avoided_air_conditioning_co2_eq_emissions"
  | EcosystemServicesImpact["details"][number]["impact"]
  | AvoidedTrafficAccidentsImpact["details"][number]["impact"]
  | AvoidedFricheCostsImpact["details"][number]["impact"];

export const getDetailedSocioEconomicProjectImpacts = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): SocioEconomicDetailedImpact => {
  const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
    total: 0,
    impacts: [],
  };

  const economicDirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
  const economicIndirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
  const socialMonetary: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
  const environmentalMonetary: SocioEconomicImpactByCategory = { total: 0, impacts: [] };

  const avoidedFricheExpensesImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "avoided_friche_costs",
  );

  if (avoidedFricheExpensesImpacts.length > 0) {
    economicDirect.impacts.push({
      name: "avoided_friche_costs",
      actors: avoidedFricheExpensesImpacts.map(({ amount, actor, details }) => ({
        value: amount,
        name: actor,
        details: details.map(({ amount, impact }) => ({ name: impact, value: amount })),
      })),
    });
    economicDirect.total += sumListWithKey(avoidedFricheExpensesImpacts, "amount");
  }

  const rentalIncomeImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "rental_income",
  );
  if (rentalIncomeImpacts.length > 0) {
    economicDirect.impacts.push({
      name: "rental_income",
      actors: rentalIncomeImpacts.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicDirect.total += sumListWithKey(rentalIncomeImpacts, "amount");
  }

  const propertyTransferDutiesIncomeImpact = socioEconomicImpacts.find(
    (impact) => impact.impact === "property_transfer_duties_income",
  );

  if (propertyTransferDutiesIncomeImpact) {
    economicDirect.impacts.push({
      name: "property_transfer_duties_income",
      actors: [
        {
          value: propertyTransferDutiesIncomeImpact.amount,
          name: propertyTransferDutiesIncomeImpact.actor,
        },
      ],
    });
    economicDirect.total += propertyTransferDutiesIncomeImpact.amount;
  }

  const taxesIncomeImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "taxes_income",
  );
  if (taxesIncomeImpacts.length > 0) {
    economicIndirect.impacts.push({
      name: "taxes_income",
      actors: taxesIncomeImpacts.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(taxesIncomeImpacts, "amount");
  }

  const localPropertyValueIncrease = socioEconomicImpacts.filter(
    (impact) => impact.impact === "local_property_value_increase",
  );
  if (localPropertyValueIncrease.length > 0) {
    economicIndirect.impacts.push({
      name: "local_property_value_increase",
      actors: localPropertyValueIncrease.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(localPropertyValueIncrease, "amount");
  }

  const localPropertyTransferDutiesIncrease = socioEconomicImpacts.filter(
    (impact) => impact.impact === "local_transfer_duties_increase",
  );
  if (localPropertyTransferDutiesIncrease.length > 0) {
    economicIndirect.impacts.push({
      name: "local_transfer_duties_increase",
      actors: localPropertyTransferDutiesIncrease.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(localPropertyTransferDutiesIncrease, "amount");
  }

  const avoidedCarRelatedExpenses = socioEconomicImpacts.filter(
    (impact) => impact.impact === "avoided_car_related_expenses",
  );

  if (avoidedCarRelatedExpenses.length > 0) {
    economicIndirect.impacts.push({
      name: "avoided_car_related_expenses",
      actors: avoidedCarRelatedExpenses.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(avoidedCarRelatedExpenses, "amount");
  }

  const avoidedPropertyDamagesExpenses = socioEconomicImpacts.filter(
    (impact) => impact.impact === "avoided_property_damages_expenses",
  );

  if (avoidedPropertyDamagesExpenses.length > 0) {
    economicIndirect.impacts.push({
      name: "avoided_property_damages_expenses",
      actors: avoidedPropertyDamagesExpenses.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(avoidedPropertyDamagesExpenses, "amount");
  }

  const avoidedAirConditioningExpenses = socioEconomicImpacts.filter(
    (impact) => impact.impact === "avoided_air_conditioning_expenses",
  );

  if (avoidedAirConditioningExpenses.length > 0) {
    economicIndirect.impacts.push({
      name: "avoided_air_conditioning_expenses",
      actors: avoidedAirConditioningExpenses.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    economicIndirect.total += sumListWithKey(avoidedAirConditioningExpenses, "amount");
  }

  const travelTimeSaved = socioEconomicImpacts.filter(
    (impact) => impact.impact === "travel_time_saved",
  );

  if (travelTimeSaved.length > 0) {
    socialMonetary.impacts.push({
      name: "travel_time_saved",
      actors: travelTimeSaved.map(({ amount, actor }) => ({
        value: amount,
        name: actor,
      })),
    });
    socialMonetary.total += sumListWithKey(travelTimeSaved, "amount");
  }

  const avoidedTrafficAccidents = socioEconomicImpacts.find(
    (impact): impact is AvoidedTrafficAccidentsImpact =>
      impact.impact === "avoided_traffic_accidents",
  );

  if (avoidedTrafficAccidents) {
    socialMonetary.impacts.push({
      name: "avoided_traffic_accidents",
      actors: [
        {
          value: avoidedTrafficAccidents.amount,
          name: "french_society",
          details: avoidedTrafficAccidents.details
            .filter(({ amount }) => amount !== 0)
            .map(({ amount, impact }) => ({
              value: amount,
              name: impact,
            })),
        },
      ],
    });
    socialMonetary.total += avoidedTrafficAccidents.amount;
  }

  const avoidedCO2WithEnrImpact = socioEconomicImpacts.find(
    (impact) => impact.impact === "avoided_co2_eq_with_enr",
  );

  const avoidedTrafficCO2Emissions = socioEconomicImpacts.find(
    (impact) => impact.impact === "avoided_traffic_co2_eq_emissions",
  );

  const avoidedAirConditioningCO2Emissions = socioEconomicImpacts.find(
    (impact) => impact.impact === "avoided_air_conditioning_co2_eq_emissions",
  );

  if (avoidedCO2WithEnrImpact || avoidedAirConditioningCO2Emissions || avoidedTrafficCO2Emissions) {
    const details: {
      value: number;
      name:
        | "avoided_co2_eq_with_enr"
        | "avoided_air_conditioning_co2_eq_emissions"
        | "avoided_traffic_co2_eq_emissions";
    }[] = [];

    if (avoidedCO2WithEnrImpact) {
      details.push({
        value: avoidedCO2WithEnrImpact.amount,
        name: "avoided_co2_eq_with_enr",
      });
    }

    if (avoidedAirConditioningCO2Emissions) {
      details.push({
        value: avoidedAirConditioningCO2Emissions.amount,
        name: "avoided_air_conditioning_co2_eq_emissions",
      });
    }

    if (avoidedTrafficCO2Emissions) {
      details.push({
        value: avoidedTrafficCO2Emissions.amount,
        name: "avoided_traffic_co2_eq_emissions",
      });
    }

    const total = sumListWithKey(details, "value");

    environmentalMonetary.impacts.push({
      name: "co2_benefit_monetary",
      actors: [
        {
          value: total,
          name: "human_society",
          details,
        },
      ],
    });
    environmentalMonetary.total += total;
  }

  const avoidedAirPollution = socioEconomicImpacts.find(
    (impact) => impact.impact === "avoided_air_pollution",
  );

  if (avoidedAirPollution) {
    environmentalMonetary.impacts.push({
      name: "avoided_air_pollution",
      actors: [
        {
          value: avoidedAirPollution.amount,
          name: avoidedAirPollution.actor,
        },
      ],
    });
    environmentalMonetary.total += avoidedAirPollution.amount;
  }

  const waterRegulationImpact = socioEconomicImpacts.find(
    (impact) => impact.impact === "water_regulation",
  );

  if (waterRegulationImpact) {
    environmentalMonetary.impacts.push({
      name: "water_regulation",
      actors: [
        {
          value: waterRegulationImpact.amount,
          name: waterRegulationImpact.actor,
        },
      ],
    });
    environmentalMonetary.total += waterRegulationImpact.amount;
  }

  const ecosystemServicesImpact = socioEconomicImpacts.find(
    (impact): impact is EcosystemServicesImpact => impact.impact === "ecosystem_services",
  );
  if (ecosystemServicesImpact) {
    environmentalMonetary.impacts.push({
      name: "ecosystem_services",
      actors: [
        {
          value: ecosystemServicesImpact.amount,
          name: ecosystemServicesImpact.actor,
          details: ecosystemServicesImpact.details.map(({ amount, impact }) => ({
            value: amount,
            name: impact,
          })),
        },
      ],
    });
    environmentalMonetary.total += ecosystemServicesImpact.amount;
  }

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
  impacts: { name: SocioEconomicImpactName; value: number }[];
}[];
export const getSocioEconomicProjectImpactsByActor = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): SocioEconomicImpactByActor => {
  const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
    total: 0,
    impacts: [],
  };

  const mergedActors = socioEconomicImpacts.map((impact) => ({
    ...impact,
    actor: ["local_residents", "local_companies", "local_workers"].includes(impact.actor)
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
