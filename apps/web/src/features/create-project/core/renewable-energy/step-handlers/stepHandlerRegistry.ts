import type { AnswerStepId, RenewableEnergyCreationStep } from "../renewableEnergySteps";
import { InstallationExpensesHandler } from "./expenses/expenses-installation/expensesInstallation.handler";
import { ExpensesIntroductionHandler } from "./expenses/expenses-introduction/expensesIntroduction.handler";
import { ReinstatementExpensesHandler } from "./expenses/expenses-reinstatement/expensesReinstatement.handler";
import { SitePurchaseAmountsHandler } from "./expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.handler";
import { YearlyProjectedExpensesHandler } from "./expenses/expenses-yearly-projected/expensesYearlyProjected.handler";
import { NamingHandler } from "./naming/naming/naming.handler";
import { ContractDurationHandler } from "./photovoltaic/photovoltaic-contract-duration/photovoltaicContractDuration.handler";
import { ExpectedAnnualProductionHandler } from "./photovoltaic/photovoltaic-expected-annual-production/photovoltaicExpectedAnnualProduction.handler";
import { KeyParameterHandler } from "./photovoltaic/photovoltaic-key-parameter/photovoltaicKeyParameter.handler";
import { PowerHandler } from "./photovoltaic/photovoltaic-power/photovoltaicPower.handler";
import { SurfaceHandler } from "./photovoltaic/photovoltaic-surface/photovoltaicSurface.handler";
import { ProjectPhaseHandler } from "./project-phase/project-phase/projectPhase.handler";
import { FinancialAssistanceHandler } from "./revenue/revenue-financial-assistance/revenueFinancialAssistance.handler";
import { RevenueIntroductionHandler } from "./revenue/revenue-introduction/revenueIntroduction.handler";
import { YearlyProjectedRevenueHandler } from "./revenue/revenue-yearly-projected/revenueYearlyProjected.handler";
import { ScheduleProjectionHandler } from "./schedule/schedule-projection/scheduleProjection.handler";
import { SoilsDecontaminationIntroductionHandler } from "./soils-decontamination/soils-decontamination-introduction/soilsDecontaminationIntroduction.handler";
import { SoilsDecontaminationSelectionHandler } from "./soils-decontamination/soils-decontamination-selection/soilsDecontaminationSelection.handler";
import { SoilsDecontaminationSurfaceAreaHandler } from "./soils-decontamination/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.handler";
import { ClimateAndBiodiversityImpactNoticeHandler } from "./soils-transformation/soils-transformation-climate-and-biodiversity-impact-notice/soilsTransformationClimateAndBiodiversityImpactNotice.handler";
import { CustomSoilsSelectionHandler } from "./soils-transformation/soils-transformation-custom-soils-selection/soilsTransformationCustomSoilsSelection.handler";
import { CustomSurfaceAreaAllocationHandler } from "./soils-transformation/soils-transformation-custom-surface-area-allocation/soilsTransformationCustomSurfaceAreaAllocation.handler";
import { SoilsTransformationIntroductionHandler } from "./soils-transformation/soils-transformation-introduction/soilsTransformationIntroduction.handler";
import { NonSuitableSoilsNoticeHandler } from "./soils-transformation/soils-transformation-non-suitable-soils-notice/soilsTransformationNonSuitableSoilsNotice.handler";
import { NonSuitableSoilsSelectionHandler } from "./soils-transformation/soils-transformation-non-suitable-soils-selection/soilsTransformationNonSuitableSoilsSelection.handler";
import { NonSuitableSoilsSurfaceHandler } from "./soils-transformation/soils-transformation-non-suitable-soils-surface/soilsTransformationNonSuitableSoilsSurface.handler";
import { ProjectSelectionHandler } from "./soils-transformation/soils-transformation-project-selection/soilsTransformationProjectSelection.handler";
import { FutureOperatorHandler } from "./stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.handler";
import { FutureSiteOwnerHandler } from "./stakeholders/stakeholders-future-site-owner/stakeholdersFutureSiteOwner.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/stakeholders-introduction/stakeholdersIntroduction.handler";
import { ProjectDeveloperHandler } from "./stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.handler";
import { ReinstatementContractOwnerHandler } from "./stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.handler";
import { SitePurchaseHandler } from "./stakeholders/stakeholders-site-purchase/stakeholdersSitePurchase.handler";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";
import { CreationResultHandler } from "./summary/summary-creation-result/summaryCreationResult.handler";
import { FinalSummaryHandler } from "./summary/summary-final/summaryFinal.handler";
import { SoilsCarbonStorageHandler } from "./summary/summary-soils-carbon-storage/summarySoilsCarbonStorage.handler";
import { SoilsSummaryHandler } from "./summary/summary-soils/summarySoils.handler";

export const stepHandlerRegistry = {
  // Photovoltaic
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: KeyParameterHandler,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: PowerHandler,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: SurfaceHandler,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: ExpectedAnnualProductionHandler,
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: ContractDurationHandler,

  // Soils decontamination
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION: SoilsDecontaminationIntroductionHandler,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: SoilsDecontaminationSelectionHandler,
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: SoilsDecontaminationSurfaceAreaHandler,

  // Soils transformation
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION: SoilsTransformationIntroductionHandler,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE: NonSuitableSoilsNoticeHandler,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: NonSuitableSoilsSelectionHandler,
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: NonSuitableSoilsSurfaceHandler,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: ProjectSelectionHandler,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: CustomSoilsSelectionHandler,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION:
    CustomSurfaceAreaAllocationHandler,
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE:
    ClimateAndBiodiversityImpactNoticeHandler,

  // Summaries
  RENEWABLE_ENERGY_SOILS_SUMMARY: SoilsSummaryHandler,
  RENEWABLE_ENERGY_SOILS_CARBON_STORAGE: SoilsCarbonStorageHandler,
  RENEWABLE_ENERGY_FINAL_SUMMARY: FinalSummaryHandler,
  RENEWABLE_ENERGY_CREATION_RESULT: CreationResultHandler,

  // Stakeholders
  RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION: StakeholdersIntroductionHandler,
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: ProjectDeveloperHandler,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: FutureOperatorHandler,
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: ReinstatementContractOwnerHandler,
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: SitePurchaseHandler,
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: FutureSiteOwnerHandler,

  // Expenses
  RENEWABLE_ENERGY_EXPENSES_INTRODUCTION: ExpensesIntroductionHandler,
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: SitePurchaseAmountsHandler,
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: ReinstatementExpensesHandler,
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: InstallationExpensesHandler,
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: YearlyProjectedExpensesHandler,

  // Revenue
  RENEWABLE_ENERGY_REVENUE_INTRODUCTION: RevenueIntroductionHandler,
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: YearlyProjectedRevenueHandler,
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: FinancialAssistanceHandler,

  // Schedule, phase, naming
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: ScheduleProjectionHandler,
  RENEWABLE_ENERGY_PROJECT_PHASE: ProjectPhaseHandler,
  RENEWABLE_ENERGY_NAMING: NamingHandler,
} as const satisfies Record<
  RenewableEnergyCreationStep,
  InfoStepHandler | AnswerStepHandler<AnswerStepId>
>;
