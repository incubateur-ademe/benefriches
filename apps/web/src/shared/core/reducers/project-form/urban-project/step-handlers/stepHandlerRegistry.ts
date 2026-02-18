import { BuildingsIntroductionHandler } from "./buildings/buildingsIntroduction.handler";
import { CreationModeSelectionHandler } from "./creation-mode/creationMode.handler";
import { UrbanProjectInstallationExpensesHandler } from "./expenses/expensesInstallation.handler";
import { ExpensesIntroductionHandler } from "./expenses/expensesIntroduction.handler";
import { ExpensesProjectedBuildingsOperatingExpensesHandler } from "./expenses/expensesProjectedBuildingsOperatingExpenses.handler";
import { UrbanProjectReinstatementExpensesHandler } from "./expenses/expensesReinstatement.handler";
import { ExpensesSitePurchaseAmountsHandler } from "./expenses/expensesSitePurchaseAmounts.handler";
import { ExpressCreationResultHandler } from "./express/creationResult.handler";
import { ExpressSummaryHandler } from "./express/expressSummary.handler";
import { ExpressTemplateSelectionHandler } from "./express/expressTemplateSelection.handler";
import { UrbanProjectNamingHandler } from "./naming/naming.handler";
import { ProjectPhaseHandler } from "./project-phase/projectPhase.handler";
import { CreationResultHandler } from "./result/creationResult.handler";
import { RevenueBuildingsOperationsYearlyRevenuesHandler } from "./revenues/revenueBuildingsOperationsYearlyRevenues.handler";
import { RevenueBuildingsResaleHandler } from "./revenues/revenueBuildingsResale.handler";
import { RevenueExpectedSiteResaleHandler } from "./revenues/revenueExpectedSiteResale.handler";
import { RevenueFinancialAssistanceHandler } from "./revenues/revenueFinancialAssistance.handler";
import { RevenueIntroductionHandler } from "./revenues/revenueIntroduction.handler";
import { UrbanProjectScheduleProjectionHandler } from "./schedule/scheduleProjection.handler";
import { BuildingsResaleSelectionHandler } from "./site-and-buildings-resale/buildingsResaleSelection.handler";
import { SiteResaleIntroductionHandler } from "./site-and-buildings-resale/siteResaleIntroduction.handler";
import { SiteResaleSelectionHandler } from "./site-and-buildings-resale/siteResaleSelection.handler";
import { SoilsCarbonSummaryHandler } from "./soils/soilsCarbonSummary.handler";
import { SoilsDecontaminationIntroductionHandler } from "./soils/soilsDecontaminationIntroduction.handler";
import { SoilsDecontaminationSelectionHandler } from "./soils/soilsDecontaminationSelection.handler";
import { SoilsDecontaminationSurfaceAreaHandler } from "./soils/soilsDecontaminationSurfaceArea.handler";
import { SoilsSummaryHandler } from "./soils/soilsSummary.handler";
import { PublicGreenSpacesIntroductionHandler } from "./spaces/new-public-green-spaces/publicGreenSpacesIntroduction.handler";
import { PublicGreenSpacesSoilsDistributionHandler } from "./spaces/new-public-green-spaces/publicGreenSpacesSoilsDistribution.handler";
import { PublicGreenSpacesSurfaceAreaHandler } from "./spaces/new-public-green-spaces/publicGreenSpacesSurfaceArea.handler";
import { SpacesIntroductionHandler } from "./spaces/spacesIntroduction.handler";
import { SpacesSelectionHandler } from "./spaces/spacesSelection.handler";
import { SpacesSurfaceAreaHandler } from "./spaces/spacesSurfaceArea.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/stakeholdersIntroduction.handler";
import { StakeholdersProjectDeveloperHandler } from "./stakeholders/stakeholdersProjectDeveloper.handler";
import { StakeholdersReinstatementContractOwnerHandler } from "./stakeholders/stakeholdersReinstatementContractOwner.handler";
import { FinalSummaryHandler } from "./summary/finalSummary.handler";
import { UsesFloorSurfaceAreaHandler } from "./uses/usesFloorSurfaceArea.handler";
import { UsesIntroductionHandler } from "./uses/usesIntroduction.handler";
import { UsesSelectionHandler } from "./uses/usesSelection.handler";

export const stepHandlerRegistry = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: CreationModeSelectionHandler,
  // express
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: ExpressTemplateSelectionHandler,
  URBAN_PROJECT_EXPRESS_SUMMARY: ExpressSummaryHandler,
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: ExpressCreationResultHandler,
  // custom - uses
  URBAN_PROJECT_USES_INTRODUCTION: UsesIntroductionHandler,
  URBAN_PROJECT_USES_SELECTION: UsesSelectionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: PublicGreenSpacesSurfaceAreaHandler,
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: UsesFloorSurfaceAreaHandler,
  // custom - new spaces flow (uses flow)
  URBAN_PROJECT_SPACES_INTRODUCTION: SpacesIntroductionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: PublicGreenSpacesIntroductionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: PublicGreenSpacesSoilsDistributionHandler,
  URBAN_PROJECT_SPACES_SELECTION: SpacesSelectionHandler,
  URBAN_PROJECT_SPACES_SURFACE_AREA: SpacesSurfaceAreaHandler,
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: SoilsSummaryHandler,
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: SoilsCarbonSummaryHandler,
  // custom - buildings
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: BuildingsIntroductionHandler,
  // custom - decontamination
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: SoilsDecontaminationIntroductionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: SoilsDecontaminationSelectionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: SoilsDecontaminationSurfaceAreaHandler,
  // stakeholders and site/buildings resale
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: StakeholdersIntroductionHandler,
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: SiteResaleIntroductionHandler,
  URBAN_PROJECT_EXPENSES_INTRODUCTION: ExpensesIntroductionHandler,
  URBAN_PROJECT_REVENUE_INTRODUCTION: RevenueIntroductionHandler,
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

  URBAN_PROJECT_FINAL_SUMMARY: FinalSummaryHandler,
  URBAN_PROJECT_CREATION_RESULT: CreationResultHandler,
} as const;
