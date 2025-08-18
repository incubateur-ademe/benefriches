import { AnswerStepId, InformationalStep, AnswersByStep } from "../urbanProjectSteps";
import { AnswerStepHandler } from "./answerStep.handler";
import { BuildingsFloorSurfaceAreaHandler } from "./buildings/buildingsFloorSurfaceArea.handler";
import { BuildingsIntroductionHandler } from "./buildings/buildingsIntroduction.handler";
import { BuildingsUseIntroductionHandler } from "./buildings/buildingsUseIntroduction.handler";
import { BuildingsUseSurfaceAreaDistributionHandler } from "./buildings/buildingsUseSurfaceAreaDistribution.handler";
import { UrbanProjectInstallationExpensesHandler } from "./expenses/expensesInstallation.handler";
import { ExpensesIntroductionHandler } from "./expenses/expensesIntroduction.handler";
import { ExpensesProjectedBuildingsOperatingExpensesHandler } from "./expenses/expensesProjectedBuildingsOperatingExpenses.handler";
import { UrbanProjectReinstatementExpensesHandler } from "./expenses/expensesReinstatement.handler";
import { ExpensesSitePurchaseAmountsHandler } from "./expenses/expensesSitePurchaseAmounts.handler";
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
// New handlers imports
import { SpaceDevelopmentPlanIntroductionHandler } from "./spaces/spaceDevelopmentPlanIntroduction.handler";
import { SpacesCategoriesIntroductionHandler } from "./spaces/spacesCategoriesIntroduction.handler";
import { UrbanProjectSpacesCategoriesSelectionHandler } from "./spaces/spacesCategoriesSelection.handler";
import { UrbanProjectSpacesCategoriesSurfaceAreaHandler } from "./spaces/spacesCategoriesSurfaceArea.handler";
import { StakeholdersIntroductionHandler } from "./stakeholders/stakeholdersIntroduction.handler";
import { StakeholdersProjectDeveloperHandler } from "./stakeholders/stakeholdersProjectDeveloper.handler";
import { StakeholdersReinstatementContractOwnerHandler } from "./stakeholders/stakeholdersReinstatementContractOwner.handler";
import { BaseStepHandler } from "./step.handler";
import { FinalSummaryHandler } from "./summary/finalSummary.handler";

const informationalStepHandlers: Record<InformationalStep, BaseStepHandler> = {
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: new SpacesCategoriesIntroductionHandler(),
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: new SpaceDevelopmentPlanIntroductionHandler(),
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: new GreenSpacesIntroductionHandler(),
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION:
    new ResidentialAndActivitySpacesIntroductionHandler(),
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: new PublicSpacesIntroductionHandler(),
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: new SoilsSummaryHandler(),
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: new SoilsCarbonSummaryHandler(),
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: new SoilsDecontaminationIntroductionHandler(),
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: new BuildingsIntroductionHandler(),
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: new BuildingsUseIntroductionHandler(),
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: new StakeholdersIntroductionHandler(),
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: new SiteResaleIntroductionHandler(),
  URBAN_PROJECT_EXPENSES_INTRODUCTION: new ExpensesIntroductionHandler(),
  URBAN_PROJECT_REVENUE_INTRODUCTION: new RevenueIntroductionHandler(),
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: new ScheduleIntroductionHandler(),
  URBAN_PROJECT_FINAL_SUMMARY: new FinalSummaryHandler(),
  URBAN_PROJECT_CREATION_RESULT: new CreationResultHandler(),
} as const;

const answerStepHandlers: Record<AnswerStepId, AnswerStepHandler<AnswersByStep[AnswerStepId]>> = {
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: new UrbanProjectSpacesCategoriesSelectionHandler(),
  URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA:
    new UrbanProjectSpacesCategoriesSurfaceAreaHandler(),
  URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION:
    new GreenSpacesSurfaceAreaDistributionHandler(),
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION:
    new ResidentialAndActivitySpacesDistributionHandler(),
  URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: new PublicSpacesDistributionHandler(),
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: new SoilsDecontaminationSelectionHandler(),
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: new SoilsDecontaminationSurfaceAreaHandler(),
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: new BuildingsFloorSurfaceAreaHandler(),
  URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION:
    new BuildingsUseSurfaceAreaDistributionHandler(),
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: new StakeholdersProjectDeveloperHandler(),
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER:
    new StakeholdersReinstatementContractOwnerHandler(),
  URBAN_PROJECT_SITE_RESALE_SELECTION: new SiteResaleSelectionHandler(),
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: new BuildingsResaleSelectionHandler(),
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: new ExpensesSitePurchaseAmountsHandler(),
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: new UrbanProjectReinstatementExpensesHandler(),
  URBAN_PROJECT_EXPENSES_INSTALLATION: new UrbanProjectInstallationExpensesHandler(),
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES:
    new ExpensesProjectedBuildingsOperatingExpensesHandler(),
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: new RevenueExpectedSiteResaleHandler(),
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: new RevenueBuildingsResaleHandler(),
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES:
    new RevenueBuildingsOperationsYearlyRevenuesHandler(),
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: new RevenueFinancialAssistanceHandler(),
  URBAN_PROJECT_SCHEDULE_PROJECTION: new UrbanProjectScheduleProjectionHandler(),
  URBAN_PROJECT_NAMING: new UrbanProjectNamingHandler(),
  URBAN_PROJECT_PROJECT_PHASE: new ProjectPhaseHandler(),
} as const;

export const stepHandlerRegistry = {
  getAnswerStepHandler<T extends AnswerStepId>(stepId: T): AnswerStepHandler<AnswersByStep[T]> {
    return answerStepHandlers[stepId];
  },

  getInformationalStepHandler(stepId: InformationalStep): BaseStepHandler {
    return informationalStepHandlers[stepId];
  },
} as const;
