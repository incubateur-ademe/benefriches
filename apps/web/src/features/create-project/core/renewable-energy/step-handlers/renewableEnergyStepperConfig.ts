import type { RenewableEnergyCreationStep } from "../renewableEnergySteps";
import { expensesInstallationStepperConfig } from "./expenses/expenses-installation/expensesInstallation.stepperConfig";
import { expensesIntroductionStepperConfig } from "./expenses/expenses-introduction/expensesIntroduction.stepperConfig";
import { expensesReinstatementStepperConfig } from "./expenses/expenses-reinstatement/expensesReinstatement.stepperConfig";
import { expensesSitePurchaseAmountsStepperConfig } from "./expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.stepperConfig";
import { expensesYearlyProjectedStepperConfig } from "./expenses/expenses-yearly-projected/expensesYearlyProjected.stepperConfig";
import { namingStepperConfig } from "./naming/naming/naming.stepperConfig";
import { photovoltaicContractDurationStepperConfig } from "./photovoltaic/photovoltaic-contract-duration/photovoltaicContractDuration.stepperConfig";
import { photovoltaicExpectedAnnualProductionStepperConfig } from "./photovoltaic/photovoltaic-expected-annual-production/photovoltaicExpectedAnnualProduction.stepperConfig";
import { photovoltaicKeyParameterStepperConfig } from "./photovoltaic/photovoltaic-key-parameter/photovoltaicKeyParameter.stepperConfig";
import { photovoltaicPowerStepperConfig } from "./photovoltaic/photovoltaic-power/photovoltaicPower.stepperConfig";
import { photovoltaicSurfaceStepperConfig } from "./photovoltaic/photovoltaic-surface/photovoltaicSurface.stepperConfig";
import { projectPhaseStepperConfig } from "./project-phase/project-phase/projectPhase.stepperConfig";
import { revenueFinancialAssistanceStepperConfig } from "./revenue/revenue-financial-assistance/revenueFinancialAssistance.stepperConfig";
import { revenueIntroductionStepperConfig } from "./revenue/revenue-introduction/revenueIntroduction.stepperConfig";
import { revenueYearlyProjectedStepperConfig } from "./revenue/revenue-yearly-projected/revenueYearlyProjected.stepperConfig";
import { scheduleProjectionStepperConfig } from "./schedule/schedule-projection/scheduleProjection.stepperConfig";
import { soilsDecontaminationIntroductionStepperConfig } from "./soils-decontamination/soils-decontamination-introduction/soilsDecontaminationIntroduction.stepperConfig";
import { soilsDecontaminationSelectionStepperConfig } from "./soils-decontamination/soils-decontamination-selection/soilsDecontaminationSelection.stepperConfig";
import { soilsDecontaminationSurfaceAreaStepperConfig } from "./soils-decontamination/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.stepperConfig";
import { soilsTransformationClimateAndBiodiversityImpactNoticeStepperConfig } from "./soils-transformation/soils-transformation-climate-and-biodiversity-impact-notice/soilsTransformationClimateAndBiodiversityImpactNotice.stepperConfig";
import { soilsTransformationCustomSoilsSelectionStepperConfig } from "./soils-transformation/soils-transformation-custom-soils-selection/soilsTransformationCustomSoilsSelection.stepperConfig";
import { soilsTransformationCustomSurfaceAreaAllocationStepperConfig } from "./soils-transformation/soils-transformation-custom-surface-area-allocation/soilsTransformationCustomSurfaceAreaAllocation.stepperConfig";
import { soilsTransformationIntroductionStepperConfig } from "./soils-transformation/soils-transformation-introduction/soilsTransformationIntroduction.stepperConfig";
import { soilsTransformationNonSuitableSoilsNoticeStepperConfig } from "./soils-transformation/soils-transformation-non-suitable-soils-notice/soilsTransformationNonSuitableSoilsNotice.stepperConfig";
import { soilsTransformationNonSuitableSoilsSelectionStepperConfig } from "./soils-transformation/soils-transformation-non-suitable-soils-selection/soilsTransformationNonSuitableSoilsSelection.stepperConfig";
import { soilsTransformationNonSuitableSoilsSurfaceStepperConfig } from "./soils-transformation/soils-transformation-non-suitable-soils-surface/soilsTransformationNonSuitableSoilsSurface.stepperConfig";
import { soilsTransformationProjectSelectionStepperConfig } from "./soils-transformation/soils-transformation-project-selection/soilsTransformationProjectSelection.stepperConfig";
import { stakeholdersFutureOperatorStepperConfig } from "./stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.stepperConfig";
import { stakeholdersFutureSiteOwnerStepperConfig } from "./stakeholders/stakeholders-future-site-owner/stakeholdersFutureSiteOwner.stepperConfig";
import { stakeholdersIntroductionStepperConfig } from "./stakeholders/stakeholders-introduction/stakeholdersIntroduction.stepperConfig";
import { stakeholdersProjectDeveloperStepperConfig } from "./stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.stepperConfig";
import { stakeholdersReinstatementContractOwnerStepperConfig } from "./stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.stepperConfig";
import { stakeholdersSitePurchaseStepperConfig } from "./stakeholders/stakeholders-site-purchase/stakeholdersSitePurchase.stepperConfig";
import { summaryCreationResultStepperConfig } from "./summary/summary-creation-result/summaryCreationResult.stepperConfig";
import { summaryFinalStepperConfig } from "./summary/summary-final/summaryFinal.stepperConfig";
import { summarySoilsCarbonStorageStepperConfig } from "./summary/summary-soils-carbon-storage/summarySoilsCarbonStorage.stepperConfig";
import { summarySoilsStepperConfig } from "./summary/summary-soils/summarySoils.stepperConfig";

export type RenewableEnergyStepGroupId =
  | "PHOTOVOLTAIC_PARAMETERS"
  | "SITE_WORKS"
  | "STAKEHOLDERS"
  | "EXPENSES_AND_REVENUE"
  | "SCHEDULE"
  | "PROJECT_PHASE"
  | "NAMING"
  | "SUMMARY";

export const RENEWABLE_ENERGY_STEP_GROUP_IDS = [
  "PHOTOVOLTAIC_PARAMETERS",
  "SITE_WORKS",
  "STAKEHOLDERS",
  "EXPENSES_AND_REVENUE",
  "SCHEDULE",
  "PROJECT_PHASE",
  "NAMING",
  "SUMMARY",
] as const satisfies readonly RenewableEnergyStepGroupId[];

export const RENEWABLE_ENERGY_STEP_GROUP_LABELS: Record<RenewableEnergyStepGroupId, string> = {
  PHOTOVOLTAIC_PARAMETERS: "Paramètres du projet",
  SITE_WORKS: "Travaux",
  STAKEHOLDERS: "Acteurs",
  EXPENSES_AND_REVENUE: "Dépenses et recettes",
  SCHEDULE: "Calendrier",
  PROJECT_PHASE: "Avancement",
  NAMING: "Dénomination",
  SUMMARY: "Récapitulatif",
};

export const RENEWABLE_ENERGY_STEP_TO_GROUP: Record<
  RenewableEnergyCreationStep,
  { groupId: RenewableEnergyStepGroupId }
> = {
  // Photovoltaic
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: photovoltaicKeyParameterStepperConfig,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: photovoltaicPowerStepperConfig,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: photovoltaicSurfaceStepperConfig,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION:
    photovoltaicExpectedAnnualProductionStepperConfig,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: photovoltaicContractDurationStepperConfig,

  // Soils decontamination
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION:
    soilsDecontaminationIntroductionStepperConfig,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: soilsDecontaminationSelectionStepperConfig,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: soilsDecontaminationSurfaceAreaStepperConfig,

  // Soils transformation
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION: soilsTransformationIntroductionStepperConfig,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE:
    soilsTransformationNonSuitableSoilsNoticeStepperConfig,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION:
    soilsTransformationNonSuitableSoilsSelectionStepperConfig,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE:
    soilsTransformationNonSuitableSoilsSurfaceStepperConfig,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION:
    soilsTransformationProjectSelectionStepperConfig,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION:
    soilsTransformationCustomSoilsSelectionStepperConfig,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION:
    soilsTransformationCustomSurfaceAreaAllocationStepperConfig,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE:
    soilsTransformationClimateAndBiodiversityImpactNoticeStepperConfig,

  // Summaries (soils + carbon belong to SOILS_TRANSFORMATION group)
  RENEWABLE_ENERGY_SOILS_SUMMARY: summarySoilsStepperConfig,
  RENEWABLE_ENERGY_SOILS_CARBON_STORAGE: summarySoilsCarbonStorageStepperConfig,
  RENEWABLE_ENERGY_FINAL_SUMMARY: summaryFinalStepperConfig,
  RENEWABLE_ENERGY_CREATION_RESULT: summaryCreationResultStepperConfig,

  // Stakeholders
  RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION: stakeholdersIntroductionStepperConfig,
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: stakeholdersProjectDeveloperStepperConfig,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: stakeholdersFutureOperatorStepperConfig,
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    stakeholdersReinstatementContractOwnerStepperConfig,
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: stakeholdersSitePurchaseStepperConfig,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: stakeholdersFutureSiteOwnerStepperConfig,

  // Expenses
  RENEWABLE_ENERGY_EXPENSES_INTRODUCTION: expensesIntroductionStepperConfig,
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: expensesSitePurchaseAmountsStepperConfig,
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: expensesReinstatementStepperConfig,
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: expensesInstallationStepperConfig,
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: expensesYearlyProjectedStepperConfig,

  // Revenue
  RENEWABLE_ENERGY_REVENUE_INTRODUCTION: revenueIntroductionStepperConfig,
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: revenueYearlyProjectedStepperConfig,
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: revenueFinancialAssistanceStepperConfig,

  // Schedule, phase, naming
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: scheduleProjectionStepperConfig,
  RENEWABLE_ENERGY_PROJECT_PHASE: projectPhaseStepperConfig,
  RENEWABLE_ENERGY_NAMING: namingStepperConfig,
};
