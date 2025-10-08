import { BuildingsFloorSurfaceAreaHandler } from "./buildings/buildingsFloorSurfaceArea.handler";
import { BuildingsIntroductionHandler } from "./buildings/buildingsIntroduction.handler";
import { BuildingsUseIntroductionHandler } from "./buildings/buildingsUseIntroduction.handler";
import { BuildingsUseSurfaceAreaDistributionHandler } from "./buildings/buildingsUseSurfaceAreaDistribution.handler";
import { CreationModeSelectionHandler } from "./creation-mode/creationMode.handler";
import { UrbanProjectInstallationExpensesHandler } from "./expenses/expensesInstallation.handler";
import { ExpensesIntroductionHandler } from "./expenses/expensesIntroduction.handler";
import { ExpensesProjectedBuildingsOperatingExpensesHandler } from "./expenses/expensesProjectedBuildingsOperatingExpenses.handler";
import { UrbanProjectReinstatementExpensesHandler } from "./expenses/expensesReinstatement.handler";
import { ExpensesSitePurchaseAmountsHandler } from "./expenses/expensesSitePurchaseAmounts.handler";
import { ExpressCreationResultHandler } from "./express/creationResult.handler";
import { ExpressCategoryHandler } from "./express/expressCategory.handler";
import { UrbanProjectNamingHandler } from "./naming/naming.handler";
import { ProjectPhaseHandler } from "./project-phase/projectPhase.handler";
import { CreationResultHandler } from "./result/creationResult.handler";
import { RevenueBuildingsOperationsYearlyRevenuesHandler } from "./revenues/revenueBuildingsOperationsYearlyRevenues.handler";
import { RevenueBuildingsResaleHandler } from "./revenues/revenueBuildingsResale.handler";
import { RevenueExpectedSiteResaleHandler } from "./revenues/revenueExpectedSiteResale.handler";
import { RevenueFinancialAssistanceHandler } from "./revenues/revenueFinancialAssistance.handler";
import { RevenueIntroductionHandler } from "./revenues/revenueIntroduction.handler";
import { ScheduleIntroductionHandler } from "./schedule/scheduleIntroduction.handler";
import { UrbanProjectScheduleProjectionHandler } from "./schedule/scheduleProjection.handler";
import { BuildingsResaleSelectionHandler } from "./site-and-buildings-resale/buildingsResaleSelection.handler";
import { SiteResaleIntroductionHandler } from "./site-and-buildings-resale/siteResaleIntroduction.handler";
import { SiteResaleSelectionHandler } from "./site-and-buildings-resale/siteResaleSelection.handler";
import { SoilsCarbonSummaryHandler } from "./soils/soilsCarbonSummary.handler";
import { SoilsDecontaminationIntroductionHandler } from "./soils/soilsDecontaminationIntroduction.handler";
import { SoilsDecontaminationSelectionHandler } from "./soils/soilsDecontaminationSelection.handler";
import { SoilsDecontaminationSurfaceAreaHandler } from "./soils/soilsDecontaminationSurfaceArea.handler";
import { SoilsSummaryHandler } from "./soils/soilsSummary.handler";
import { GreenSpacesIntroductionHandler } from "./spaces/greenSpacesIntroduction.handler";
import { GreenSpacesSurfaceAreaDistributionHandler } from "./spaces/greenSpacesSurfaceAreaDistribution.handler";
import { PublicSpacesDistributionHandler } from "./spaces/publicSpacesDistribution.handler";
import { PublicSpacesIntroductionHandler } from "./spaces/publicSpacesIntroduction.handler";
import { ResidentialAndActivitySpacesDistributionHandler } from "./spaces/residentialActivitySpacesDistribution.handler";
import { ResidentialAndActivitySpacesIntroductionHandler } from "./spaces/residentialActivitySpacesIntroduction.handler";
import { SpaceDevelopmentPlanIntroductionHandler } from "./spaces/spaceDevelopmentPlanIntroduction.handler";
import { SpacesCategoriesIntroductionHandler } from "./spaces/spacesCategoriesIntroduction.handler";
import { UrbanProjectSpacesCategoriesSelectionHandler } from "./spaces/spacesCategoriesSelection.handler";
import { UrbanProjectSpacesCategoriesSurfaceAreaHandler } from "./spaces/spacesCategoriesSurfaceArea.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/stakeholdersIntroduction.handler";
import { StakeholdersProjectDeveloperHandler } from "./stakeholders/stakeholdersProjectDeveloper.handler";
import { StakeholdersReinstatementContractOwnerHandler } from "./stakeholders/stakeholdersReinstatementContractOwner.handler";
import { FinalSummaryHandler } from "./summary/finalSummary.handler";

export const stepHandlerRegistry = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: CreationModeSelectionHandler,
  // express
  URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION: ExpressCategoryHandler,
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: ExpressCreationResultHandler,
  // custom
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: SpacesCategoriesIntroductionHandler,
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: SpaceDevelopmentPlanIntroductionHandler,
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: GreenSpacesIntroductionHandler,
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION:
    ResidentialAndActivitySpacesIntroductionHandler,
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: PublicSpacesIntroductionHandler,
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: SoilsSummaryHandler,
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: SoilsCarbonSummaryHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: SoilsDecontaminationIntroductionHandler,
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: BuildingsIntroductionHandler,
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: BuildingsUseIntroductionHandler,
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: StakeholdersIntroductionHandler,
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: SiteResaleIntroductionHandler,
  URBAN_PROJECT_EXPENSES_INTRODUCTION: ExpensesIntroductionHandler,
  URBAN_PROJECT_REVENUE_INTRODUCTION: RevenueIntroductionHandler,
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: ScheduleIntroductionHandler,

  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: UrbanProjectSpacesCategoriesSelectionHandler,
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: UrbanProjectSpacesCategoriesSurfaceAreaHandler,
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: GreenSpacesSurfaceAreaDistributionHandler,
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION:
    ResidentialAndActivitySpacesDistributionHandler,
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: PublicSpacesDistributionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: SoilsDecontaminationSelectionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: SoilsDecontaminationSurfaceAreaHandler,
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: BuildingsFloorSurfaceAreaHandler,
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: BuildingsUseSurfaceAreaDistributionHandler,
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: StakeholdersProjectDeveloperHandler,
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    StakeholdersReinstatementContractOwnerHandler,
  URBAN_PROJECT_SITE_RESALE_SELECTION: SiteResaleSelectionHandler,
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: BuildingsResaleSelectionHandler,
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: ExpensesSitePurchaseAmountsHandler,
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: UrbanProjectReinstatementExpensesHandler,
  URBAN_PROJECT_EXPENSES_INSTALLATION: UrbanProjectInstallationExpensesHandler,
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES:
    ExpensesProjectedBuildingsOperatingExpensesHandler,
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: RevenueExpectedSiteResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: RevenueBuildingsResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES:
    RevenueBuildingsOperationsYearlyRevenuesHandler,
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: RevenueFinancialAssistanceHandler,
  URBAN_PROJECT_SCHEDULE_PROJECTION: UrbanProjectScheduleProjectionHandler,
  URBAN_PROJECT_NAMING: UrbanProjectNamingHandler,
  URBAN_PROJECT_PROJECT_PHASE: ProjectPhaseHandler,

  URBAN_PROJECT_FINAL_SUMMARY: FinalSummaryHandler,
  URBAN_PROJECT_CREATION_RESULT: CreationResultHandler,
} as const;
