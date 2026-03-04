import { createSelector } from "@reduxjs/toolkit";
import type {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilsDistribution,
} from "shared";

import { RootState } from "@/app/store/store";
import type { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";
import type { SoilsCarbonStorageResult } from "@/shared/core/reducers/project-form/soilsCarbonStorage.action";

import { selectSiteData } from "../../../../createProject.selectors";
import type { Schedule } from "../../../../project.types";
import { ReadStateHelper } from "../../../helpers/readState";
import {
  selectProjectSoilsDistribution,
  selectRenewableEnergyType,
  selectSteps,
} from "../../../selectors/renewableEnergy.selector";

const selectSoilsCarbonStorage = (state: RootState) =>
  state.projectCreation.renewableEnergyProject.soilsCarbonStorage;

type FinalSummaryViewData = {
  projectData: {
    name: string;
    description?: string;
    decontaminatedSurfaceArea?: number;
    developmentPlanCategory: "RENEWABLE_ENERGY";
    renewableEnergy: RenewableEnergyDevelopmentPlanType;
    photovoltaicElectricalPowerKWc: number;
    photovoltaicSurfaceArea: number;
    photovoltaicExpectedAnnualProduction: number;
    photovoltaicContractDuration: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
    futureOwner?: string;
    futureOperator?: string;
    projectDeveloper?: string;
    reinstatementContractOwner?: string;
    sitePurchaseTotalCost?: number;
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    reinstatementExpenses?: ReinstatementExpense[];
    photovoltaicPanelsInstallationExpenses?: PhotovoltaicInstallationExpense[];
    yearlyProjectedExpenses: RecurringExpense[];
    yearlyProjectedRevenues: RecurringRevenue[];
    reinstatementSchedule?: Schedule;
    photovoltaicInstallationSchedule?: Schedule;
    firstYearOfOperation?: number;
  };
  siteData: {
    surfaceArea: number;
    soilsDistribution: SoilsDistribution;
    soilsCarbonStorage?: SoilsCarbonStorageResult;
    name: string;
  };
};

export const selectPhotovoltaicFinalSummaryViewData = createSelector(
  [
    selectSteps,
    selectSiteData,
    selectSoilsCarbonStorage,
    selectRenewableEnergyType,
    selectProjectSoilsDistribution,
  ],
  (
    steps,
    siteData,
    soilsCarbonStorage,
    renewableEnergyType,
    soilsDistribution,
  ): FinalSummaryViewData => {
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    const power = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    const surface = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    const annualProduction = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    const contractDuration = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    );
    const developer = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
    );
    const futureOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
    );
    const operator = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
    );
    const reinstatementOwner = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    );
    const sitePurchase = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    const financialAssistance = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
    );
    const reinstatementExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
    );
    const installationExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
    const yearlyExpenses = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
    );
    const yearlyRevenues = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
    );
    const schedule = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
    const decontamination = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );

    return {
      projectData: {
        name: naming?.name ?? "",
        description: naming?.description,
        developmentPlanCategory: "RENEWABLE_ENERGY",
        renewableEnergy: renewableEnergyType!,
        photovoltaicElectricalPowerKWc: power?.photovoltaicInstallationElectricalPowerKWc ?? 0,
        photovoltaicSurfaceArea: surface?.photovoltaicInstallationSurfaceSquareMeters ?? 0,
        photovoltaicExpectedAnnualProduction:
          annualProduction?.photovoltaicExpectedAnnualProduction ?? 0,
        photovoltaicContractDuration: contractDuration?.photovoltaicContractDuration ?? 0,
        soilsDistribution,
        soilsCarbonStorage: soilsCarbonStorage.projected,
        projectDeveloper: developer?.projectDeveloper?.name,
        futureOwner: futureOwner?.futureSiteOwner?.name,
        futureOperator: operator?.futureOperator?.name,
        reinstatementContractOwner: reinstatementOwner?.reinstatementContractOwner?.name,
        sitePurchaseTotalCost: sitePurchase?.sellingPrice
          ? sitePurchase.sellingPrice + (sitePurchase.propertyTransferDuties ?? 0)
          : 0,
        financialAssistanceRevenues: financialAssistance?.financialAssistanceRevenues,
        reinstatementExpenses: reinstatementExpenses?.reinstatementExpenses ?? [],
        photovoltaicPanelsInstallationExpenses:
          installationExpenses?.photovoltaicPanelsInstallationExpenses,
        yearlyProjectedExpenses: yearlyExpenses?.yearlyProjectedExpenses ?? [],
        yearlyProjectedRevenues: yearlyRevenues?.yearlyProjectedRevenues ?? [],
        reinstatementSchedule: schedule?.reinstatementSchedule,
        photovoltaicInstallationSchedule: schedule?.photovoltaicInstallationSchedule,
        decontaminatedSurfaceArea:
          decontamination?.decontaminatedSurfaceArea ??
          decontaminationSelection?.decontaminatedSurfaceArea,
        firstYearOfOperation: schedule?.firstYearOfOperation,
      },
      siteData: {
        surfaceArea: siteData?.surfaceArea ?? 0,
        soilsDistribution: siteData?.soilsDistribution ?? {},
        soilsCarbonStorage: soilsCarbonStorage.current,
        name: siteData?.name ?? "",
      },
    };
  },
);
