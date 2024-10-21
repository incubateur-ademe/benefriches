import { createSelector } from "@reduxjs/toolkit";
import { sumList } from "shared";

import { RootState } from "@/app/application/store";

import {
  AvoidedFricheExpensesImpact,
  AvoidedTrafficAccidentsImpact,
  EcosystemServicesImpact,
  ReconversionProjectImpacts,
} from "../domain/impacts.types";
import { ProjectImpactsState } from "./projectImpacts.reducer";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectCurrentFilter = createSelector(
  selectSelf,
  (state): ProjectImpactsState["currentCategoryFilter"] => state.currentCategoryFilter,
);

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
  | AvoidedFricheExpensesImpact["details"][number]["impact"];

export const getDetailedSocioEconomicProjectImpacts = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): SocioEconomicDetailedImpact => {
    const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
      total: 0,
      impacts: [],
    };

    const displayAll = currentFilter === "all";
    const displayEconomicData = displayAll || currentFilter === "economic";
    const displayEnvironmentData = displayAll || currentFilter === "environment";
    const displaySocialData = displayAll || currentFilter === "social";

    const allowedCategories = [
      ...(displayEconomicData ? ["economic_direct", "economic_indirect"] : []),
      ...(displayEnvironmentData ? ["environmental_monetary"] : []),
      ...(displaySocialData ? ["social_monetary"] : []),
    ];

    const economicDirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
    const economicIndirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
    const socialMonetary: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
    const environmentalMonetary: SocioEconomicImpactByCategory = { total: 0, impacts: [] };

    if (allowedCategories.includes("economic_direct")) {
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
        economicDirect.total += sumList(avoidedFricheExpensesImpacts.map(({ amount }) => amount));
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
        economicDirect.total += sumList(rentalIncomeImpacts.map(({ amount }) => amount));
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
    }

    if (allowedCategories.includes("economic_indirect")) {
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
        economicIndirect.total += sumList(taxesIncomeImpacts.map(({ amount }) => amount));
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
        economicIndirect.total += sumList(localPropertyValueIncrease.map(({ amount }) => amount));
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
        economicIndirect.total += sumList(
          localPropertyTransferDutiesIncrease.map(({ amount }) => amount),
        );
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
        economicIndirect.total += sumList(avoidedCarRelatedExpenses.map(({ amount }) => amount));
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
        economicIndirect.total += sumList(
          avoidedPropertyDamagesExpenses.map(({ amount }) => amount),
        );
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
        economicIndirect.total += sumList(
          avoidedAirConditioningExpenses.map(({ amount }) => amount),
        );
      }
    }

    if (allowedCategories.includes("social_monetary")) {
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
        socialMonetary.total += sumList(travelTimeSaved.map(({ amount }) => amount));
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
    }

    if (allowedCategories.includes("environmental_monetary")) {
      const avoidedCO2WithEnrImpact = socioEconomicImpacts.find(
        (impact) => impact.impact === "avoided_co2_eq_with_enr",
      );

      const avoidedTrafficCO2Emissions = socioEconomicImpacts.find(
        (impact) => impact.impact === "avoided_traffic_co2_eq_emissions",
      );

      const avoidedAirConditioningCO2Emissions = socioEconomicImpacts.find(
        (impact) => impact.impact === "avoided_air_conditioning_co2_eq_emissions",
      );

      if (
        avoidedCO2WithEnrImpact ||
        avoidedAirConditioningCO2Emissions ||
        avoidedTrafficCO2Emissions
      ) {
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

        const total = sumList(details.map(({ value }) => value));

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
  },
);

type ImpactName = ReconversionProjectImpacts["socioeconomic"]["impacts"][number]["impact"];

const getGroupedByImpactName = (impacts: { amount: number; impact: ImpactName }[]) => {
  const byImpactsName = Array.from(new Set(impacts.map(({ impact }) => impact))).map(
    (impactName) => {
      return {
        name: impactName,
        value: sumList(
          impacts.filter((impact) => impact.impact === impactName).map(({ amount }) => amount),
        ),
      };
    },
  );
  return {
    impacts: byImpactsName,
    total: sumList(impacts.map(({ amount }) => amount)),
  };
};

export type SocioEconomicImpactByActor = {
  name: string;
  total: number;
  impacts: { name: SocioEconomicImpactName; value: number }[];
}[];
export const getSocioEconomicProjectImpactsByActor = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): SocioEconomicImpactByActor => {
    const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
      total: 0,
      impacts: [],
    };

    const displayAll = currentFilter === "all";
    const displayEconomicData = displayAll || currentFilter === "economic";
    const displayEnvironmentData = displayAll || currentFilter === "environment";
    const displaySocialData = displayAll || currentFilter === "social";

    const allowedCategories = [
      ...(displayEconomicData ? ["economic_direct", "economic_indirect"] : []),
      ...(displayEnvironmentData ? ["environmental_monetary"] : []),
      ...(displaySocialData ? ["social_monetary"] : []),
    ];

    const impactsFiltered = socioEconomicImpacts.filter(({ impactCategory }) =>
      allowedCategories.includes(impactCategory),
    );

    const mergedActors = impactsFiltered.map((impact) => ({
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
  },
);
