import { createSelector } from "@reduxjs/toolkit";
import { sumListWithKey } from "shared";

import { RootState } from "@/app/store/store";

import {
  EnvironmentalAreaChartImpactsData,
  getEnvironmentalAreaChartImpactsData,
  getSocialAreaChartImpactsData,
  SocialAreaChartImpactsData,
} from "../../domain/projectImpactsAreaChartsData";
import {
  IndirectEconomicImpactsByBearer,
  selectBreakEvenLevelByEvaluationPeriod,
  selectIndirectEconomicImpactsByBearer,
} from "./projectBreakEvenLevel.selectors";

const selectSelf = (state: RootState) => state.projectImpacts;

type Score = { isSuccess: boolean; value: number };
export type DevelopmentScoreDataView = {
  evaluationPeriodInYears: number;
  localAuthorityEconomicScore: Score & {
    metrics: IndirectEconomicImpactsByBearer["local_authority"]["details"];
  };
  fullTimeJobsScore: Score & { metrics: SocialAreaChartImpactsData["fullTimeJobs"] };
  environmentScore: Score & {
    metrics: {
      avoidedCo2eqEmissions: EnvironmentalAreaChartImpactsData["avoidedCo2eqEmissions"];
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
    "storedCo2Eq",
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
    "avoidedCarAccidents",
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
    "storedCo2Eq",
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
    "storedCo2Eq",
    "forestRelatedProduct",
    "invasiveSpeciesRegulation",
    "natureRelatedWelnessAndLeisure",
    "nitrogenCycle",
    "pollination",
    "soilErosion",
    "waterCycle",
  ],
} as const;

const getDecontaminationState = (props: {
  contaminatedSoilSurface?: number;
  decontaminatedSoilSurface?: number;
}) => {
  if (!props.contaminatedSoilSurface) {
    return "useless";
  }
  if (props.decontaminatedSoilSurface === props.contaminatedSoilSurface) {
    return "total";
  }
  if (props.decontaminatedSoilSurface) {
    return "partial";
  }
  return "none";
};

export const selectDevelopmentScoreDataView = createSelector(
  [selectSelf, selectBreakEvenLevelByEvaluationPeriod, selectIndirectEconomicImpactsByBearer],
  (
    state,
    breakEvenLevelForEvaluationPeriod,
    indirectEconomicImpactsByBearer,
  ): DevelopmentScoreDataView | undefined => {
    if (!breakEvenLevelForEvaluationPeriod) {
      return undefined;
    }

    const localPeopleAndCompanyIndirectImpacts = sumListWithKey(
      (breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details ?? []).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.localPeopleOrCompany.some((item) => item === name),
      ),
      "total",
    );

    const environmentalIndirectImpacts = sumListWithKey(
      (breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details ?? []).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.environmental.some((item) => item === name),
      ),
      "total",
    );

    const macroEconomicIndirectImpacts = sumListWithKey(
      (breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details ?? []).filter(({ name }) =>
        INDIRECT_ECONOMIC_IMPACTS_SCORE.macroEconomy.some((item) => item === name),
      ),
      "total",
    );

    const localAuthorityEconomicImpacts =
      indirectEconomicImpactsByBearer.local_authority.total ?? 0;

    const { avoidedCo2eqEmissions, permeableSurfaceArea, nonContaminatedSurfaceArea } =
      getEnvironmentalAreaChartImpactsData({
        projectContaminatedSurfaceArea: state.projectData?.contaminatedSoilSurface,
        siteContaminatedSurfaceArea: state.relatedSiteData?.contaminatedSoilSurface,
        impactsData: state.impactsData,
      });

    const { fullTimeJobs } = getSocialAreaChartImpactsData(state.impactsData);

    const decontaminationState = getDecontaminationState({
      contaminatedSoilSurface: state.relatedSiteData?.contaminatedSoilSurface,
      decontaminatedSoilSurface: nonContaminatedSurfaceArea?.difference,
    });

    return {
      evaluationPeriodInYears: state.evaluationPeriod ?? 50,
      localAuthorityEconomicScore: {
        isSuccess: localAuthorityEconomicImpacts > 0,
        value: localAuthorityEconomicImpacts,
        metrics: indirectEconomicImpactsByBearer.local_authority.details,
      },
      fullTimeJobsScore: {
        isSuccess: Boolean(fullTimeJobs && fullTimeJobs?.difference > 0),
        value: fullTimeJobs?.difference ?? 0,
        metrics: fullTimeJobs,
      },
      environmentScore: {
        isSuccess: environmentalIndirectImpacts > 0,
        value: environmentalIndirectImpacts,
        metrics: {
          avoidedCo2eqEmissions,
          permeableSurfaceAreaDifference: permeableSurfaceArea?.difference,
          hasDecontamination:
            decontaminationState === "partial" || decontaminationState === "total",
          avoidedVehiculeKilometers: state.impactsData?.social.avoidedVehiculeKilometers,
          waterRegulation: breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details.find(
            ({ name }) => name === "waterRegulation",
          )?.total,
          zanCompliance:
            state.relatedSiteData?.nature === "FRICHE" &&
            state.relatedSiteData?.fricheActivity !== "AGRICULTURE",

          ecosystemicServices: sumListWithKey(
            (breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details ?? []).filter(
              ({ name }) =>
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
            breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details.find(
              ({ name }) => name === "localPropertyValueIncrease",
            )?.total,
          avoidedAirPollutionHealthExpenses:
            breakEvenLevelForEvaluationPeriod.indirectEconomicImpacts.details.find(
              ({ name }) => name === "avoidedAirPollutionHealthExpenses",
            )?.total,
          hasDecontamination:
            decontaminationState === "partial" || decontaminationState === "total",
          travelTimeSaved: state.impactsData?.social.travelTimeSaved,
          avoidedTrafficAccidents: state.impactsData?.social.avoidedTrafficAccidents?.total,
          avoidedFrichesAccidents: state.impactsData?.social.accidents?.difference,
        },
      },
    };
  },
);
