import { differenceInDays } from "date-fns";
import type { AgriculturalOperationActivity, ReinstatementExpense, SiteNature } from "shared";
import {
  computeAgriculturalOperationEtpFromSurface,
  computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution,
  computeDefaultPhotovoltaicConversionFullTimeJobs,
  computeDefaultPhotovoltaicOperationsFullTimeJobs,
  computeReinstatementFullTimeJobs,
  roundTo1Digit,
  roundTo2Digits,
} from "shared";

import type { PhotovoltaicPowerStationFeatures, Schedule } from "../../reconversionProject";
import type { UrbanProjectFeatures } from "../../urbanProjects";
import { Impact } from "../impact";

type SpreadTemporaryFullTimeJobsOverInput = {
  temporaryFullTimeJobs: number;
  currentDurationInYears: number;
  targetDurationInYears: number;
};

export const spreadTemporaryFullTimeJobsOver = (input: SpreadTemporaryFullTimeJobsOverInput) => {
  return (input.temporaryFullTimeJobs * input.currentDurationInYears) / input.targetDurationInYears;
};

export const getDurationFromScheduleInYears = ({ startDate, endDate }: Schedule) => {
  const durationInDays = differenceInDays(endDate, startDate);

  return durationInDays / 365;
};

type DevelopmentPlan =
  | {
      type: "PHOTOVOLTAIC_POWER_PLANT";
      features: Pick<PhotovoltaicPowerStationFeatures, "electricalPowerKWc">;
    }
  | {
      type: "URBAN_PROJECT";
      features: Pick<UrbanProjectFeatures, "buildingsFloorAreaDistribution">;
    };

type FullTimeJobsImpactServiceProps = {
  siteData?: {
    nature: SiteNature;
    surfaceArea: number;
    agriculturalOperationActivity?: AgriculturalOperationActivity;
    isSiteOperated?: boolean;
  };
  developmentPlan: DevelopmentPlan;
  conversionSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
  evaluationPeriodInYears: number;
  reinstatementExpenses: ReinstatementExpense[];
};

export class FullTimeJobsImpactService {
  private readonly developmentPlan: FullTimeJobsImpactServiceProps["developmentPlan"];
  private readonly siteData: FullTimeJobsImpactServiceProps["siteData"];

  private readonly conversionSchedule: Schedule | undefined;
  private readonly reinstatementSchedule: Schedule | undefined;
  private readonly evaluationPeriodInYears: number;

  private readonly reinstatementExpenses: ReinstatementExpense[];

  constructor({
    siteData,
    developmentPlan,
    conversionSchedule,
    reinstatementSchedule,
    reinstatementExpenses,
    evaluationPeriodInYears,
  }: FullTimeJobsImpactServiceProps) {
    this.developmentPlan = developmentPlan;
    this.siteData = siteData;

    this.conversionSchedule = conversionSchedule;
    this.reinstatementSchedule = reinstatementSchedule;
    this.evaluationPeriodInYears = evaluationPeriodInYears;

    this.reinstatementExpenses = reinstatementExpenses;
  }

  private get statuQuoOperationsFullTimeJobs() {
    if (this.siteData?.agriculturalOperationActivity && this.siteData.isSiteOperated) {
      return computeAgriculturalOperationEtpFromSurface({
        operationActivity: this.siteData.agriculturalOperationActivity,
        surfaceArea: this.siteData.surfaceArea,
      });
    }
    return 0;
  }

  private get reinstatementFullTimeJobs() {
    return roundTo1Digit(computeReinstatementFullTimeJobs(this.reinstatementExpenses));
  }

  private get conversionFullTimeJobs() {
    switch (this.developmentPlan.type) {
      case "PHOTOVOLTAIC_POWER_PLANT":
        return roundTo1Digit(
          computeDefaultPhotovoltaicConversionFullTimeJobs(
            this.developmentPlan.features.electricalPowerKWc,
          ),
        );
      default:
        return 0;
    }
  }

  private get projectOperationsFullTimeJobs() {
    switch (this.developmentPlan.type) {
      case "PHOTOVOLTAIC_POWER_PLANT":
        return computeDefaultPhotovoltaicOperationsFullTimeJobs(
          this.developmentPlan.features.electricalPowerKWc,
        );
      case "URBAN_PROJECT":
        return (
          computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution(
            this.developmentPlan.features.buildingsFloorAreaDistribution,
          ) ?? 0
        );
      default:
        return 0;
    }
  }

  private get conversionDurationInYears() {
    if (!this.conversionSchedule) {
      return undefined;
    }
    return roundTo2Digits(getDurationFromScheduleInYears(this.conversionSchedule));
  }

  private get reinstatementDurationInYears() {
    if (!this.reinstatementSchedule) {
      return undefined;
    }
    return roundTo2Digits(getDurationFromScheduleInYears(this.reinstatementSchedule));
  }

  private get conversionJobsSpreadOverEvaluationPeriod() {
    if (!this.conversionDurationInYears) {
      return 0;
    }
    return roundTo1Digit(
      spreadTemporaryFullTimeJobsOver({
        targetDurationInYears: this.evaluationPeriodInYears,
        currentDurationInYears: this.conversionDurationInYears,
        temporaryFullTimeJobs: this.conversionFullTimeJobs,
      }),
    );
  }

  private get reinstatementJobsSpreadOverEvaluationPeriod() {
    if (!this.reinstatementDurationInYears) {
      return 0;
    }
    return roundTo1Digit(
      spreadTemporaryFullTimeJobsOver({
        targetDurationInYears: this.evaluationPeriodInYears,
        currentDurationInYears: this.reinstatementDurationInYears,
        temporaryFullTimeJobs: this.reinstatementFullTimeJobs,
      }),
    );
  }

  private get totalCurrentFullTimeJobs() {
    return this.statuQuoOperationsFullTimeJobs;
  }

  private get totalForecastFullTimeJobs() {
    return (
      this.projectOperationsFullTimeJobs +
      this.reinstatementJobsSpreadOverEvaluationPeriod +
      this.conversionJobsSpreadOverEvaluationPeriod
    );
  }

  getFullTimeJobsImpacts() {
    if (this.totalCurrentFullTimeJobs === 0 && this.totalForecastFullTimeJobs === 0) {
      return undefined;
    }
    return {
      ...Impact.get({
        base: this.totalCurrentFullTimeJobs,
        forecast: this.totalForecastFullTimeJobs,
      }),
      operations: Impact.get({
        base: this.statuQuoOperationsFullTimeJobs,
        forecast: this.projectOperationsFullTimeJobs,
      }),
      conversion: Impact.get({
        base: 0,
        forecast:
          this.conversionJobsSpreadOverEvaluationPeriod +
          this.reinstatementJobsSpreadOverEvaluationPeriod,
      }),
    };
  }
}
