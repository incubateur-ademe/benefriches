import { createSelector } from "@reduxjs/toolkit";
import { sumListWithKey } from "shared";

import { RootState } from "@/app/store/store";

import { IndirectEconomicImpactsByBearer } from "../../../domain/groupIndirectImpactsByBearer";
import {
  selectImpactsCroppedByEvaluationPeriod,
  selectIndirectEconomicImpactsByBearer,
} from "./projectBreakEvenLevel.selectors";

const selectSelf = (state: RootState) => state.projectImpacts;

type Score = { isSuccess: boolean; value: number };
export type DevelopmentScoreDataView = {
  evaluationPeriodInYears: number;
  localAuthorityEconomicScore: Score & {
    metrics: IndirectEconomicImpactsByBearer["local_authority"]["details"];
  };
  fullTimeJobsScore: Score & { metrics: { base: number; forecast: number; difference: number } };
  environmentScore: Score & {
    metrics: {
      avoidedCo2eqEmissions: {
        base: number;
        forecast: number;
        difference: number;
      };
      permeableSurfaceAreaDifference?: number;
      hasDecontamination: boolean;
      waterRegulation?: number;
      avoidedVehiculeKilometers?: number;
      ecosystemicServices?: number;
      zanCompliance: boolean;
    };
  };
  macroEconomicScore: Score & { metrics: IndirectEconomicImpactsByBearer };
  localPeopleAndCompanyScore: Score & {
    metrics: {
      localPropertyValueIncrease?: number;
      avoidedAirPollutionHealthExpenses?: number;
      hasDecontamination: boolean;
      travelTimeSaved?: number;
      avoidedTrafficAccidents?: number;
      avoidedFrichesAccidents?: number;
    };
  };
};

const INDIRECT_ECONOMIC_IMPACTS_SCORE = {
  environmental: [
    "avoidedAirConditioningCo2eqEmissions",
    "avoidedCo2eqWithEnergyProduction",
    "avoidedTrafficCo2EqEmissions",
    "newStoredCo2Eq",
    "forestRelatedProduct",
    "invasiveSpeciesRegulation",
    "natureRelatedWelnessAndLeisure",
    "nitrogenCycle",
    "pollination",
    "soilErosion",
    "waterCycle",
    "waterRegulation",
    "avoidedAirPollutionHealthExpenses",
  ],
  localPeopleOrCompany: [
    "localPropertyValueIncrease",
    "travelTimeSavedPerTravelerExpenses",
    "avoidedPropertyDamageExpenses",
    "avoidedAccidentsDeathsExpenses",
    "avoidedAccidentsMinorInjuriesExpenses",
    "avoidedAccidentsSevereInjuriesExpenses",
    "avoidedAirPollutionHealthExpenses",
  ],
  macroEconomy: [
    "localPropertyValueIncrease",
    "avoidedCarRelatedExpenses",
    "travelTimeSavedPerTravelerExpenses",
    "avoidedPropertyDamageExpenses",
    "avoidedCo2eqWithEnergyProduction",
    "avoidedAirConditioningCo2eqEmissions",
    "avoidedTrafficCo2EqEmissions",
    "newStoredCo2Eq",
    "natureRelatedWelnessAndLeisure",
    "forestRelatedProduct",
    "pollination",
    "invasiveSpeciesRegulation",
    "waterCycle",
    "nitrogenCycle",
    "soilErosion",
    "avoidedAirPollutionHealthExpenses",
    "avoidedAccidentsMinorInjuriesExpenses",
    "avoidedAccidentsSevereInjuriesExpenses",
    "avoidedAccidentsDeathsExpenses",
  ],
  ecosystemicServices: [
    "newStoredCo2Eq",
    "forestRelatedProduct",
    "invasiveSpeciesRegulation",
    "natureRelatedWelnessAndLeisure",
    "nitrogenCycle",
    "pollination",
    "soilErosion",
    "waterCycle",
  ],
} as const;

export const selectDevelopmentScoreDataView = createSelector(
  [selectSelf, selectImpactsCroppedByEvaluationPeriod, selectIndirectEconomicImpactsByBearer],
  (
    state,
    breakEvenLevelForEvaluationPeriod,
    indirectEconomicImpactsByBearer,
  ): DevelopmentScoreDataView | undefined => {
    if (!breakEvenLevelForEvaluationPeriod) {
      return undefined;
    }

    const localPeopleAndCompanyIndirectImpacts = sumListWithKey(
      (
        breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts
          .details ?? []
      ).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.localPeopleOrCompany.some((item) => item === name),
      ),
      "total",
    );

    const environmentalIndirectImpacts = sumListWithKey(
      (
        breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts
          .details ?? []
      ).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.environmental.some((item) => item === name),
      ),
      "total",
    );

    const macroEconomicIndirectImpacts = sumListWithKey(
      (
        breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts
          .details ?? []
      ).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.macroEconomy.some((item) => item === name),
      ),
      "total",
    );

    const localAuthorityEconomicImpacts =
      indirectEconomicImpactsByBearer.local_authority.total ?? 0;

    const avoidedCo2eqEmissions = sumListWithKey(
      breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.filter(
        ({ name }) =>
          name === "avoidedAirConditioningCo2eqEmissions" ||
          name === "avoidedCO2TonsWithEnergyProduction" ||
          name === "avoidedTrafficCo2EqEmissions" ||
          name === "newStoredCo2Eq",
      ),
      "total",
    );

    const newDecontaminatedSurface =
      breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.find(
        ({ name }) => name === "decontaminatedSurface",
      )?.total ?? 0;

    const hasDecontamination = newDecontaminatedSurface > 0;

    const newFullTimeJobs = sumListWithKey(
      breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.filter(
        ({ name }) =>
          name === "conversionFullTimeJobs" ||
          name === "operationsFullTimeJobs" ||
          name === "oldOperationsFullTimeJobsLoss" ||
          name === "reinstatementFullTimeJobs",
      ),
      "total",
    );
    const oldFullTimeJobs =
      breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.find(
        ({ name }) => name === "oldOperationsFullTimeJobsLoss",
      )?.total;

    const siteStatuQuoStoredCo2Eq =
      breakEvenLevelForEvaluationPeriod.reconversionImpactsBreakdown.siteStatuQuoImpactMetrics.find(
        ({ name }) => name === "storedCo2Eq",
      )?.total ?? 0;
    return {
      evaluationPeriodInYears: state.evaluationPeriod ?? 50,
      localAuthorityEconomicScore: {
        isSuccess: localAuthorityEconomicImpacts > 0,
        value: localAuthorityEconomicImpacts,
        metrics: indirectEconomicImpactsByBearer.local_authority.details,
      },
      fullTimeJobsScore: {
        isSuccess: Boolean(newFullTimeJobs && newFullTimeJobs > 0),
        value: newFullTimeJobs,
        metrics: {
          base: oldFullTimeJobs ?? 0,
          forecast: newFullTimeJobs,
          difference: newFullTimeJobs,
        },
      },
      environmentScore: {
        isSuccess: environmentalIndirectImpacts > 0,
        value: environmentalIndirectImpacts,
        metrics: {
          avoidedCo2eqEmissions: {
            base: siteStatuQuoStoredCo2Eq,
            forecast: avoidedCo2eqEmissions + siteStatuQuoStoredCo2Eq,
            difference: avoidedCo2eqEmissions,
          },
          permeableSurfaceAreaDifference: sumListWithKey(
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.filter(
              ({ name }) =>
                name === "newPermeableMineralSurface" || name === "newPermeableGreenSurface",
            ),
            "total",
          ),
          hasDecontamination,
          avoidedVehiculeKilometers:
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.find(
              ({ name }) => name === "avoidedVehiculeKilometers",
            )?.total,
          waterRegulation:
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
              ({ name }) => name === "waterRegulation",
            )?.total,
          zanCompliance:
            state.contextData?.siteNature === "FRICHE" &&
            state.contextData?.fricheActivity !== "AGRICULTURE",

          ecosystemicServices: sumListWithKey(
            (
              breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts
                .indirectEconomicImpacts.details ?? []
            ).filter(({ name }) =>
              INDIRECT_ECONOMIC_IMPACTS_SCORE.ecosystemicServices.some((item) => item === name),
            ),
            "total",
          ),
        },
      },
      macroEconomicScore: {
        isSuccess: macroEconomicIndirectImpacts > 0,
        value: macroEconomicIndirectImpacts,
        metrics: indirectEconomicImpactsByBearer,
      },
      localPeopleAndCompanyScore: {
        isSuccess: localPeopleAndCompanyIndirectImpacts > 0,
        value: localPeopleAndCompanyIndirectImpacts,
        metrics: {
          localPropertyValueIncrease:
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
              ({ name }) => name === "localPropertyValueIncrease",
            )?.total,
          avoidedAirPollutionHealthExpenses:
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.indirectEconomicImpacts.details.find(
              ({ name }) => name === "avoidedAirPollutionHealthExpenses",
            )?.total,
          hasDecontamination,
          travelTimeSaved:
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.find(
              ({ name }) => name === "timeTravelSavedInHours",
            )?.total,
          avoidedTrafficAccidents: sumListWithKey(
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.filter(
              ({ name }) =>
                name === "avoidedTrafficAccidentsDeaths" ||
                name === "avoidedTrafficAccidentsSevereInjuries" ||
                name === "avoidedTrafficAccidentsMinorInjuries",
            ),
            "total",
          ),
          avoidedFrichesAccidents: sumListWithKey(
            breakEvenLevelForEvaluationPeriod.aggregatedReconversionImpacts.impactsMetrics.filter(
              ({ name }) =>
                name === "avoidedFricheAccidentsDeaths" ||
                name === "avoidedFricheAccidentsSevereInjuries" ||
                name === "avoidedFricheAccidentsMinorInjuries",
            ),
            "total",
          ),
        },
      },
    };
  },
);
