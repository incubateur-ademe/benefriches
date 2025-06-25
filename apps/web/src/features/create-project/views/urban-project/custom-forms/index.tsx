import { ReactNode } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import UrbanProjectCustomSteps from "./UrbanProjectCustomSteps";
import BuildingsFloorSurfaceArea from "./buildings/floor-surface-area";
import BuildingsIntroduction from "./buildings/introduction";
import BuildingsUseIntroduction from "./buildings/use-introduction";
import BuildingsUseSurfaceAreas from "./buildings/use-surface-areas";
import ProjectCreationResult from "./creation-result";
import InstallationExpensesForm from "./expenses/installation";
import ProjectExpensesIntroduction from "./expenses/introduction";
import ReinstatementExpensesForm from "./expenses/reinstatement";
import SitePurchaseAmounts from "./expenses/site-purchase-amounts";
import YearlyProjectedExpensesForm from "./expenses/yearly-projected-costs";
import ProjectNameAndDescriptionForm from "./name-and-description";
import ProjectPhaseForm from "./project-phase";
import BuildingsResaleRevenueForm from "./revenues/buildings-resale";
import ProjectFinancialAssistanceRevenueForm from "./revenues/financial-assistance";
import ProjectRevenueIntroduction from "./revenues/introduction";
import SiteResaleRevenueForm from "./revenues/site-resale";
import YearlyProjectedRevenueForm from "./revenues/yearly-buildings-operations-revenues";
import ProjectScheduleIntroduction from "./schedule/introduction";
import ScheduleProjectionForm from "./schedule/projection";
import BuildingsResaleForm from "./site-resale/buildings-resale";
import SiteResaleIntroduction from "./site-resale/introduction";
import SiteResaleForm from "./site-resale/selection";
import SoilsDecontaminationIntroduction from "./soils-decontamination/intro";
import SoilsDecontaminationSelection from "./soils-decontamination/selection";
import SoilsDecontaminationSurfaceArea from "./soils-decontamination/surface-area";
import UrbanSpacesDevelopmentPlanIntroduction from "./spaces/development-plan-introduction";
import GreenSpacesIntroduction from "./spaces/green-spaces/introduction";
import UrbanGreenSpacesDistribution from "./spaces/green-spaces/surface-area-distribution";
import UrbanProjectSpacesIntroduction from "./spaces/introduction";
import LivingAndActivitySpacesIntroduction from "./spaces/living-and-activity-spaces/introduction";
import LivingAndActivitySpacesDistribution from "./spaces/living-and-activity-spaces/surface-area-distribution";
import PublicSpacesIntroduction from "./spaces/public-spaces/introduction";
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
    case "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION":
      return <UrbanProjectSpacesIntroduction />;
    case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
      return <SpacesCategoriesSelection />;
    case "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA":
      return <UrbanProjectSpaceCategoriesSurfaceAreaDistribution />;
    case "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
      return <UrbanSpacesDevelopmentPlanIntroduction />;
    case "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION":
      return <GreenSpacesIntroduction />;
    case "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
      return <UrbanGreenSpacesDistribution />;
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION":
      return <LivingAndActivitySpacesIntroduction />;
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
      return <LivingAndActivitySpacesDistribution />;
    case "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION":
      return <PublicSpacesIntroduction />;
    case "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION":
      return <PublicSpacesDistribution />;
    case "URBAN_PROJECT_SPACES_SOILS_SUMMARY":
      return <UrbanProjectSoilsSummary />;
    case "URBAN_PROJECT_SOILS_CARBON_SUMMARY":
      return <UrbanProjectSoilsCarbonStorage />;
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION":
      return <SoilsDecontaminationIntroduction />;
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
      return <SoilsDecontaminationSelection />;
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
      return <SoilsDecontaminationSurfaceArea />;
    case "URBAN_PROJECT_BUILDINGS_INTRODUCTION":
      return <BuildingsIntroduction />;
    case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
      return <BuildingsFloorSurfaceArea />;
    case "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION":
      return <BuildingsUseIntroduction />;
    case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
      return <BuildingsUseSurfaceAreas />;
    case "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION":
      return <ProjectStakeholdersIntroduction />;
    case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER":
      return <DeveloperForm />;
    case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return <SiteReinstatementContractOwnerForm />;
    case "URBAN_PROJECT_SITE_RESALE_INTRODUCTION":
      return <SiteResaleIntroduction />;
    case "URBAN_PROJECT_SITE_RESALE_SELECTION":
      return <SiteResaleForm />;
    case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
      return <BuildingsResaleForm />;
    case "URBAN_PROJECT_EXPENSES_INTRODUCTION":
      return <ProjectExpensesIntroduction />;
    case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return <SitePurchaseAmounts />;
    case "URBAN_PROJECT_EXPENSES_INSTALLATION":
      return <InstallationExpensesForm />;
    case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
      return <YearlyProjectedExpensesForm />;
    case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
      return <ReinstatementExpensesForm />;
    case "URBAN_PROJECT_REVENUE_INTRODUCTION":
      return <ProjectRevenueIntroduction />;
    case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
      return <ProjectFinancialAssistanceRevenueForm />;
    case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
      return <YearlyProjectedRevenueForm />;
    case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
      return <SiteResaleRevenueForm />;
    case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
      return <BuildingsResaleRevenueForm />;
    case "URBAN_PROJECT_SCHEDULE_INTRODUCTION":
      return <ProjectScheduleIntroduction />;
    case "URBAN_PROJECT_SCHEDULE_PROJECTION":
      return <ScheduleProjectionForm />;
    case "URBAN_PROJECT_PROJECT_PHASE":
      return <ProjectPhaseForm />;
    case "URBAN_PROJECT_NAMING":
      return <ProjectNameAndDescriptionForm />;
    case "URBAN_PROJECT_FINAL_SUMMARY":
      return <ProjectCreationDataSummary />;
    case "URBAN_PROJECT_CREATION_RESULT":
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
