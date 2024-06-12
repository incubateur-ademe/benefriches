import { createSelector } from "@reduxjs/toolkit";
import { EcosystemServicesImpact, ReconversionProjectImpacts } from "../domain/impacts.types";
import { ProjectImpactsState } from "./projectImpacts.reducer";

import { RootState } from "@/app/application/store";
import { sumList } from "@/shared/services/sum/sum";

const selectSelf = (state: RootState) => state.projectImpacts;

const selectImpactsData = createSelector(
  selectSelf,
  (state): ProjectImpactsState["impactsData"] => state.impactsData,
);

const selectCurrentFilter = createSelector(
  selectSelf,
  (state): ProjectImpactsState["currentCategoryFilter"] => state.currentCategoryFilter,
);

type SocioEconomicImpacts = ReconversionProjectImpacts["socioeconomic"]["impacts"];
type SocioEconomicImpactByCategory = {
  total: number;
  impacts: {
    name: SocioEconomicMainImpactName;
    actors: {
      name: SocioEconomicImpacts[number]["actor"];
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
  environmentalMonetary: SocioEconomicImpactByCategory;
};

export type SocioEconomicImpactName = SocioEconomicMainImpactName | SocioEconomicDetailsName;
type SocioEconomicMainImpactName =
  | "rental_income"
  | "avoided_friche_costs"
  | "taxes_income"
  | "property_transfer_duties_income"
  | "co2_benefit_monetary"
  | "ecosystem_services"
  | "water_regulation";

type SocioEconomicDetailsName =
  | "avoided_co2_eq_with_enr"
  | EcosystemServicesImpact["details"][number]["impact"];

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

    const allowedCategories = [
      ...(displayEconomicData ? ["economic_direct", "economic_indirect"] : []),
      ...(displayEnvironmentData ? ["environmental_monetary"] : []),
    ];

    const economicDirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
    const economicIndirect: SocioEconomicImpactByCategory = { total: 0, impacts: [] };
    const environmentalMonetary: SocioEconomicImpactByCategory = { total: 0, impacts: [] };

    if (allowedCategories.includes("economic_direct")) {
      const avoidedFricheCostsImpacts = socioEconomicImpacts.filter(
        (impact) => impact.impact === "avoided_friche_costs",
      );

      if (avoidedFricheCostsImpacts.length > 0) {
        economicDirect.impacts.push({
          name: "avoided_friche_costs",
          actors: avoidedFricheCostsImpacts.map(({ amount, actor }) => ({
            value: amount,
            name: actor,
          })),
        });
        economicDirect.total += sumList(avoidedFricheCostsImpacts.map(({ amount }) => amount));
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

      const propertyTransferDutiesIncomeImpact = socioEconomicImpacts.find(
        (impact) => impact.impact === "property_transfer_duties_income",
      );

      if (propertyTransferDutiesIncomeImpact) {
        economicIndirect.impacts.push({
          name: "property_transfer_duties_income",
          actors: [
            {
              value: propertyTransferDutiesIncomeImpact.amount,
              name: propertyTransferDutiesIncomeImpact.actor,
            },
          ],
        });
        economicIndirect.total += propertyTransferDutiesIncomeImpact.amount;
      }
    }

    if (allowedCategories.includes("environmental_monetary")) {
      const avoidedCO2WithEnrImpact = socioEconomicImpacts.find(
        (impact) => impact.impact === "avoided_co2_eq_with_enr",
      );
      if (avoidedCO2WithEnrImpact) {
        environmentalMonetary.impacts.push({
          name: "co2_benefit_monetary",
          actors: [
            {
              value: avoidedCO2WithEnrImpact.amount,
              name: avoidedCO2WithEnrImpact.actor,
              details: [
                {
                  value: avoidedCO2WithEnrImpact.amount,
                  name: "avoided_co2_eq_with_enr",
                },
              ],
            },
          ],
        });
        environmentalMonetary.total += avoidedCO2WithEnrImpact.amount;
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
      total: economicDirect.total + economicIndirect.total + environmentalMonetary.total,
      economicDirect,
      economicIndirect,
      environmentalMonetary,
    };
  },
);

type ImpactCategory =
  ReconversionProjectImpacts["socioeconomic"]["impacts"][number]["impactCategory"];

export type SocioEconomicImpactByActorAndCategory = {
  total: number;
  byActor: {
    name: string;
    total: number;
    impacts: { name: SocioEconomicImpactName; value: number }[];
  }[];
  byCategory: {
    name: ImpactCategory;
    total: number;
    impacts: { name: SocioEconomicImpactName; value: number }[];
  }[];
};
export const getSocioEconomicProjectImpactsByActorAndCategory = createSelector(
  selectCurrentFilter,
  selectImpactsData,
  (currentFilter, impactsData): SocioEconomicImpactByActorAndCategory => {
    const { impacts: socioEconomicImpacts } = impactsData?.socioeconomic ?? {
      total: 0,
      impacts: [],
    };

    const displayAll = currentFilter === "all";
    const displayEconomicData = displayAll || currentFilter === "economic";
    const displayEnvironmentData = displayAll || currentFilter === "environment";

    const allowedCategories = [
      ...(displayEconomicData ? ["economic_direct", "economic_indirect"] : []),
      ...(displayEnvironmentData ? ["environmental_monetary"] : []),
    ];

    const impactsFiltered = socioEconomicImpacts.filter(({ impactCategory }) =>
      allowedCategories.includes(impactCategory),
    );

    const byActor = Array.from(new Set(impactsFiltered.map(({ actor }) => actor))).map((actor) => {
      const impacts = impactsFiltered.filter((impact) => impact.actor === actor);
      return {
        name: actor,
        impacts: impacts.map(({ amount, impact }) => ({ value: amount, name: impact })),
        total: sumList(impacts.map(({ amount }) => amount)),
      };
    });

    const byCategory = (
      ["economic_direct", "economic_indirect", "environmental_monetary"] as ImpactCategory[]
    )
      .map((category) => {
        const impacts = impactsFiltered.filter((impact) => impact.impactCategory === category);
        return {
          name: category,
          impacts: impacts.map(({ amount, impact }) => ({ value: amount, name: impact })),
          total: sumList(impacts.map(({ amount }) => amount)),
        };
      })
      .filter(({ total }) => total !== 0);

    return {
      total: sumList(impactsFiltered.map(({ amount }) => amount)),
      byActor,
      byCategory,
    };
  },
);
