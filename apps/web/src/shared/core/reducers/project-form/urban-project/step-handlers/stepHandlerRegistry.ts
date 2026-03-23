import type { AnswerStepId, UrbanProjectCreationStep } from "../urbanProjectSteps";
import { BuildingsIntroductionHandler } from "./buildings/buildings-introduction/buildingsIntroduction.handler";
import { BuildingsUsesFloorSurfaceAreaHandler } from "./buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler";
import { CreationModeSelectionHandler } from "./creation-mode/creation-mode-selection/creationModeSelection.handler";
import { UrbanProjectInstallationExpensesHandler } from "./expenses/expenses-installation/expensesInstallation.handler";
import { ExpensesIntroductionHandler } from "./expenses/expenses-introduction/expensesIntroduction.handler";
import { ExpensesProjectedBuildingsOperatingExpensesHandler } from "./expenses/expenses-projected-buildings-operating-expenses/expensesProjectedBuildingsOperatingExpenses.handler";
import { UrbanProjectReinstatementExpensesHandler } from "./expenses/expenses-reinstatement/expensesReinstatement.handler";
import { ExpensesSitePurchaseAmountsHandler } from "./expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.handler";
import { ExpressCreationResultHandler } from "./express/express-creation-result/expressCreationResult.handler";
import { ExpressSummaryHandler } from "./express/express-summary/expressSummary.handler";
import { ExpressTemplateSelectionHandler } from "./express/express-template-selection/expressTemplateSelection.handler";
import { UrbanProjectNamingHandler } from "./naming/naming/naming.handler";
import { ProjectPhaseHandler } from "./project-phase/project-phase/projectPhase.handler";
import { CreationResultHandler } from "./result/creation-result/creationResult.handler";
import { RevenueBuildingsOperationsYearlyRevenuesHandler } from "./revenues/revenue-buildings-operations-yearly-revenues/revenueBuildingsOperationsYearlyRevenues.handler";
import { RevenueBuildingsResaleHandler } from "./revenues/revenue-buildings-resale/revenueBuildingsResale.handler";
import { RevenueExpectedSiteResaleHandler } from "./revenues/revenue-expected-site-resale/revenueExpectedSiteResale.handler";
import { RevenueFinancialAssistanceHandler } from "./revenues/revenue-financial-assistance/revenueFinancialAssistance.handler";
import { RevenueIntroductionHandler } from "./revenues/revenue-introduction/revenueIntroduction.handler";
import { UrbanProjectScheduleProjectionHandler } from "./schedule/schedule-projection/scheduleProjection.handler";
import { BuildingsResaleSelectionHandler } from "./site-and-buildings-resale/buildings-resale-selection/buildingsResaleSelection.handler";
import { SiteResaleIntroductionHandler } from "./site-and-buildings-resale/site-resale-introduction/siteResaleIntroduction.handler";
import { SiteResaleSelectionHandler } from "./site-and-buildings-resale/site-resale-selection/siteResaleSelection.handler";
import { SoilsCarbonSummaryHandler } from "./soils/soils-carbon-summary/soilsCarbonSummary.handler";
import { SoilsDecontaminationIntroductionHandler } from "./soils/soils-decontamination-introduction/soilsDecontaminationIntroduction.handler";
import { SoilsDecontaminationSelectionHandler } from "./soils/soils-decontamination-selection/soilsDecontaminationSelection.handler";
import { SoilsDecontaminationSurfaceAreaHandler } from "./soils/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.handler";
import { SoilsSummaryHandler } from "./soils/soils-summary/soilsSummary.handler";
import { PublicGreenSpacesIntroductionHandler } from "./spaces/public-green-spaces-introduction/publicGreenSpacesIntroduction.handler";
import { PublicGreenSpacesSoilsDistributionHandler } from "./spaces/public-green-spaces-soils-distribution/publicGreenSpacesSoilsDistribution.handler";
import { SpacesIntroductionHandler } from "./spaces/spaces-introduction/spacesIntroduction.handler";
import { SpacesSelectionHandler } from "./spaces/spaces-selection/spacesSelection.handler";
import { SpacesSurfaceAreaHandler } from "./spaces/spaces-surface-area/spacesSurfaceArea.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/stakeholders-introduction/stakeholdersIntroduction.handler";
import { StakeholdersProjectDeveloperHandler } from "./stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.handler";
import { StakeholdersReinstatementContractOwnerHandler } from "./stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.handler";
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";
import { FinalSummaryHandler } from "./summary/final-summary/finalSummary.handler";
import { UsesIntroductionHandler } from "./uses/introduction/usesIntroduction.handler";
import { PublicGreenSpacesSurfaceAreaHandler } from "./uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.handler";
import { UsesSelectionHandler } from "./uses/selection/usesSelection.handler";

// Correlated mapped type: lookup with generic T yields AnswerStepHandler<T>
type AnswerStepHandlerMap = {
  [K in AnswerStepId]: AnswerStepHandler<K>;
};

export const answerStepHandlers: AnswerStepHandlerMap = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: CreationModeSelectionHandler,
  // express
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: ExpressTemplateSelectionHandler,
  // custom - uses
  URBAN_PROJECT_USES_SELECTION: UsesSelectionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: PublicGreenSpacesSurfaceAreaHandler,
  // custom - new spaces flow (uses flow)
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: PublicGreenSpacesSoilsDistributionHandler,
  URBAN_PROJECT_SPACES_SELECTION: SpacesSelectionHandler,
  URBAN_PROJECT_SPACES_SURFACE_AREA: SpacesSurfaceAreaHandler,
  // custom - buildings
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: BuildingsUsesFloorSurfaceAreaHandler,
  // custom - decontamination
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: SoilsDecontaminationSelectionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: SoilsDecontaminationSurfaceAreaHandler,
  // stakeholders and site/buildings resale
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: StakeholdersProjectDeveloperHandler,
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    StakeholdersReinstatementContractOwnerHandler,
  URBAN_PROJECT_SITE_RESALE_SELECTION: SiteResaleSelectionHandler,
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: BuildingsResaleSelectionHandler,
  // expenses
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: ExpensesSitePurchaseAmountsHandler,
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: UrbanProjectReinstatementExpensesHandler,
  URBAN_PROJECT_EXPENSES_INSTALLATION: UrbanProjectInstallationExpensesHandler,
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES:
    ExpensesProjectedBuildingsOperatingExpensesHandler,
  // revenues
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: RevenueExpectedSiteResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: RevenueBuildingsResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES:
    RevenueBuildingsOperationsYearlyRevenuesHandler,
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: RevenueFinancialAssistanceHandler,
  // schedule, phase and naming
  URBAN_PROJECT_SCHEDULE_PROJECTION: UrbanProjectScheduleProjectionHandler,
  URBAN_PROJECT_PROJECT_PHASE: ProjectPhaseHandler,
  URBAN_PROJECT_NAMING: UrbanProjectNamingHandler,
};

// Combined registry for navigation (step sequence walk, back navigation)
export const stepHandlerRegistry: Record<
  UrbanProjectCreationStep,
  InfoStepHandler | AnswerStepHandler<AnswerStepId>
> = {
  ...answerStepHandlers,
  // express
  URBAN_PROJECT_EXPRESS_SUMMARY: ExpressSummaryHandler,
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: ExpressCreationResultHandler,
  // custom - uses
  URBAN_PROJECT_USES_INTRODUCTION: UsesIntroductionHandler,
  // custom - new spaces flow (uses flow)
  URBAN_PROJECT_SPACES_INTRODUCTION: SpacesIntroductionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: PublicGreenSpacesIntroductionHandler,
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: SoilsSummaryHandler,
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: SoilsCarbonSummaryHandler,
  // custom - buildings
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: BuildingsIntroductionHandler,
  // custom - decontamination
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: SoilsDecontaminationIntroductionHandler,
  // stakeholders and site/buildings resale
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: StakeholdersIntroductionHandler,
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: SiteResaleIntroductionHandler,
  URBAN_PROJECT_EXPENSES_INTRODUCTION: ExpensesIntroductionHandler,
  URBAN_PROJECT_REVENUE_INTRODUCTION: RevenueIntroductionHandler,
  URBAN_PROJECT_FINAL_SUMMARY: FinalSummaryHandler,
  URBAN_PROJECT_CREATION_RESULT: CreationResultHandler,
};
