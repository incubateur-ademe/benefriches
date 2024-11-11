import { ReactNode } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/application/urban-project/urbanProject.reducer";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "./UrbanProjectCustomSteps";
import BuildingsEconomicActivitySelection from "./buildings/economic-activity-selection";
import BuildingsEconomicActivitySurfaceArea from "./buildings/economic-activity-surface-area";
import BuildingsFloorSurfaceArea from "./buildings/floor-surface-area";
import BuildingsIntroduction from "./buildings/introduction";
import BuildingsUseIntroduction from "./buildings/use-introduction";
import BuildingsUseSelection from "./buildings/use-selection";
import BuildingsUseSurfaceAreas from "./buildings/use-surface-areas";
import InstallationExpensesForm from "./costs/installation-costs";
import ProjectExpensesIntroduction from "./costs/introduction";
import ReinstatementExpensesForm from "./costs/reinstatement-costs";
import SitePurchaseAmounts from "./costs/site-purchase-amounts";
import YearlyProjectedExpensesForm from "./costs/yearly-projected-costs";
import ProjectCreationResult from "./creation-result";
import ProjectNameAndDescriptionForm from "./name-and-description";
import ProjectPhaseForm from "./project-phase";
import ExpectedSiteResaleForm from "./revenues/expected-resale";
import ProjectFinancialAssistanceRevenueForm from "./revenues/financial-assistance";
import ProjectRevenueIntroduction from "./revenues/introduction";
import YearlyProjectedRevenueForm from "./revenues/yearly-projected-revenue";
import ProjectScheduleIntroduction from "./schedule/introduction";
import ScheduleProjectionForm from "./schedule/projection";
import SoilsDecontaminationIntroduction from "./soils-decontamination/intro";
import SoilsDecontaminationSelection from "./soils-decontamination/selection";
import SoilsDecontaminationSurfaceArea from "./soils-decontamination/surface-area";
import UrbanSpacesDevelopmentPlanIntroduction from "./spaces/development-plan-introduction";
import GreenSpacesIntroduction from "./spaces/green-spaces/introduction";
import UrbanGreenSpacesSelection from "./spaces/green-spaces/selection";
import UrbanGreenSpacesDistribution from "./spaces/green-spaces/surface-area-distribution";
import UrbanProjectSpacesIntroduction from "./spaces/introduction";
import LivingAndActivitySpacesIntroduction from "./spaces/living-and-activity-spaces/introduction";
import LivingAndActivitySpacesSelection from "./spaces/living-and-activity-spaces/selection";
import LivingAndActivitySpacesDistribution from "./spaces/living-and-activity-spaces/surface-area-distribution";
import PublicSpacesIntroduction from "./spaces/public-spaces/introduction";
import PublicSpacesSelection from "./spaces/public-spaces/selection";
import PublicSpacesDistribution from "./spaces/public-spaces/surface-area-distribution";
import SpacesCategoriesSelection from "./spaces/selection";
import UrbanProjectSoilsCarbonStorage from "./spaces/soils-carbon-storage";
import UrbanProjectSoilsSummary from "./spaces/soils-summary/";
import UrbanProjectSpaceCategoriesSurfaceAreaDistribution from "./spaces/surface-area";
import DeveloperForm from "./stakeholders/developer";
import ProjectStakeholdersIntroduction from "./stakeholders/introduction";
import SiteReinstatementContractOwnerForm from "./stakeholders/reinstatement-contract-owner";
import ProjectCreationDataSummary from "./summary";

type Props = {
  currentStep: UrbanProjectCustomCreationStep;
};

const getCurrentStepView = (
  step: UrbanProjectCustomCreationStep,
): Exclude<ReactNode, undefined> => {
  switch (step) {
    case "SPACES_CATEGORIES_INTRODUCTION":
      return <UrbanProjectSpacesIntroduction />;
    case "SPACES_CATEGORIES_SELECTION":
      return <SpacesCategoriesSelection />;
    case "SPACES_CATEGORIES_SURFACE_AREA":
      return <UrbanProjectSpaceCategoriesSurfaceAreaDistribution />;
    case "SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
      return <UrbanSpacesDevelopmentPlanIntroduction />;
    case "GREEN_SPACES_INTRODUCTION":
      return <GreenSpacesIntroduction />;
    case "GREEN_SPACES_SELECTION":
      return <UrbanGreenSpacesSelection />;
    case "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
      return <UrbanGreenSpacesDistribution />;
    case "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
      return <LivingAndActivitySpacesIntroduction />;
    case "LIVING_AND_ACTIVITY_SPACES_SELECTION":
      return <LivingAndActivitySpacesSelection />;
    case "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
      return <LivingAndActivitySpacesDistribution />;
    case "PUBLIC_SPACES_INTRODUCTION":
      return <PublicSpacesIntroduction />;
    case "PUBLIC_SPACES_SELECTION":
      return <PublicSpacesSelection />;
    case "PUBLIC_SPACES_DISTRIBUTION":
      return <PublicSpacesDistribution />;
    case "SPACES_SOILS_SUMMARY":
      return <UrbanProjectSoilsSummary />;
    case "SOILS_CARBON_SUMMARY":
      return <UrbanProjectSoilsCarbonStorage />;
    case "SOILS_DECONTAMINATION_INTRODUCTION":
      return <SoilsDecontaminationIntroduction />;
    case "SOILS_DECONTAMINATION_SELECTION":
      return <SoilsDecontaminationSelection />;
    case "SOILS_DECONTAMINATION_SURFACE_AREA":
      return <SoilsDecontaminationSurfaceArea />;
    case "BUILDINGS_INTRODUCTION":
      return <BuildingsIntroduction />;
    case "BUILDINGS_FLOOR_SURFACE_AREA":
      return <BuildingsFloorSurfaceArea />;
    case "BUILDINGS_USE_INTRODUCTION":
      return <BuildingsUseIntroduction />;
    case "BUILDINGS_USE_SELECTION":
      return <BuildingsUseSelection />;
    case "BUILDINGS_USE_SURFACE_AREA":
      return <BuildingsUseSurfaceAreas />;
    case "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION":
      return <BuildingsEconomicActivitySelection />;
    case "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA":
      return <BuildingsEconomicActivitySurfaceArea />;
    case "BUILDINGS_EQUIPMENT_INTRODUCTION":
      return <div>BUILDINGS_EQUIPMENT_INTRODUCTION</div>;
    case "BUILDINGS_EQUIPMENT_SELECTION":
      return <div>BUILDINGS_EQUIPMENT_SELECTION</div>;
    case "STAKEHOLDERS_INTRODUCTION":
      return <ProjectStakeholdersIntroduction />;
    case "STAKEHOLDERS_PROJECT_DEVELOPER":
      return <DeveloperForm />;
    case "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return <SiteReinstatementContractOwnerForm />;
    case "EXPENSES_INTRODUCTION":
      return <ProjectExpensesIntroduction />;
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
      return <SitePurchaseAmounts />;
    case "EXPENSES_INSTALLATION":
      return <InstallationExpensesForm />;
    case "EXPENSES_PROJECTED_YEARLY_EXPENSES":
      return <YearlyProjectedExpensesForm />;
    case "EXPENSES_REINSTATEMENT":
      return <ReinstatementExpensesForm />;
    case "REVENUE_INTRODUCTION":
      return <ProjectRevenueIntroduction />;
    case "REVENUE_FINANCIAL_ASSISTANCE":
      return <ProjectFinancialAssistanceRevenueForm />;
    case "REVENUE_PROJECTED_YEARLY_REVENUE":
      return <YearlyProjectedRevenueForm />;
    case "REVENUE_EXPECTED_SITE_RESALE":
      return <ExpectedSiteResaleForm />;
    case "SCHEDULE_INTRODUCTION":
      return <ProjectScheduleIntroduction />;
    case "SCHEDULE_PROJECTION":
      return <ScheduleProjectionForm />;
    case "PROJECT_PHASE":
      return <ProjectPhaseForm />;
    case "NAMING":
      return <ProjectNameAndDescriptionForm />;
    case "FINAL_SUMMARY":
      return <ProjectCreationDataSummary />;
    case "CREATION_RESULT":
      return <ProjectCreationResult />;
  }
};

export default function UrbanProjectCustomCreationStepWizard({ currentStep }: Props) {
  return (
    <SidebarLayout
      mainChildren={getCurrentStepView(currentStep)}
      title="Renseignement du projet"
      sidebarChildren={<UrbanProjectCustomSteps step={currentStep} />}
    />
  );
}
