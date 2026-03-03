import type { AnswerStepId, RenewableEnergyCreationStep } from "../renewableEnergySteps";
import { InstallationExpensesHandler } from "./expenses/installation.handler";
import { ExpensesIntroductionHandler } from "./expenses/introduction.handler";
import { ReinstatementExpensesHandler } from "./expenses/reinstatement.handler";
import { SitePurchaseAmountsHandler } from "./expenses/sitePurchaseAmounts.handler";
import { YearlyProjectedExpensesHandler } from "./expenses/yearlyProjectedExpenses.handler";
import { NamingHandler } from "./naming/naming.handler";
import { ContractDurationHandler } from "./photovoltaic/contractDuration.handler";
import { ExpectedAnnualProductionHandler } from "./photovoltaic/expectedAnnualProduction.handler";
import { KeyParameterHandler } from "./photovoltaic/keyParameter.handler";
import { PowerHandler } from "./photovoltaic/power.handler";
import { SurfaceHandler } from "./photovoltaic/surface.handler";
import { ProjectPhaseHandler } from "./project-phase/projectPhase.handler";
import { FinancialAssistanceHandler } from "./revenue/financialAssistance.handler";
import { RevenueIntroductionHandler } from "./revenue/introduction.handler";
import { YearlyProjectedRevenueHandler } from "./revenue/yearlyProjectedRevenue.handler";
import { ScheduleProjectionHandler } from "./schedule/scheduleProjection.handler";
import { SoilsDecontaminationIntroductionHandler } from "./soils-decontamination/introduction.handler";
import { SoilsDecontaminationSelectionHandler } from "./soils-decontamination/selection.handler";
import { SoilsDecontaminationSurfaceAreaHandler } from "./soils-decontamination/surfaceArea.handler";
import { ClimateAndBiodiversityImpactNoticeHandler } from "./soils-transformation/climateAndBiodiversityImpactNotice.handler";
import { CustomSoilsSelectionHandler } from "./soils-transformation/customSoilsSelection.handler";
import { CustomSurfaceAreaAllocationHandler } from "./soils-transformation/customSurfaceAreaAllocation.handler";
import { SoilsTransformationIntroductionHandler } from "./soils-transformation/introduction.handler";
import { NonSuitableSoilsNoticeHandler } from "./soils-transformation/nonSuitableSoilsNotice.handler";
import { NonSuitableSoilsSelectionHandler } from "./soils-transformation/nonSuitableSoilsSelection.handler";
import { NonSuitableSoilsSurfaceHandler } from "./soils-transformation/nonSuitableSoilsSurface.handler";
import { ProjectSelectionHandler } from "./soils-transformation/projectSelection.handler";
import { FutureOperatorHandler } from "./stakeholders/futureOperator.handler";
import { FutureSiteOwnerHandler } from "./stakeholders/futureSiteOwner.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/introduction.handler";
import { ProjectDeveloperHandler } from "./stakeholders/projectDeveloper.handler";
import { ReinstatementContractOwnerHandler } from "./stakeholders/reinstatementContractOwner.handler";
import { SitePurchaseHandler } from "./stakeholders/sitePurchase.handler";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";
import { CreationResultHandler } from "./summary/creationResult.handler";
import { FinalSummaryHandler } from "./summary/finalSummary.handler";
import { SoilsCarbonStorageHandler } from "./summary/soilsCarbonStorage.handler";
import { SoilsSummaryHandler } from "./summary/soilsSummary.handler";

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
