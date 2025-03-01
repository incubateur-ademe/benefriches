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
    case "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
      return <UrbanGreenSpacesDistribution />;
    case "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
      return <LivingAndActivitySpacesIntroduction />;
    case "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
      return <LivingAndActivitySpacesDistribution />;
    case "PUBLIC_SPACES_INTRODUCTION":
      return <PublicSpacesIntroduction />;
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
    case "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
      return <BuildingsUseSurfaceAreas />;
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
    case "SITE_RESALE_INTRODUCTION":
      return <SiteResaleIntroduction />;
    case "SITE_RESALE_SELECTION":
      return <SiteResaleForm />;
    case "BUILDINGS_RESALE_SELECTION":
      return <BuildingsResaleForm />;
    case "EXPENSES_INTRODUCTION":
      return <ProjectExpensesIntroduction />;
    case "EXPENSES_SITE_PURCHASE_AMOUNTS":
      return <SitePurchaseAmounts />;
    case "EXPENSES_INSTALLATION":
      return <InstallationExpensesForm />;
    case "EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
      return <YearlyProjectedExpensesForm />;
    case "EXPENSES_REINSTATEMENT":
      return <ReinstatementExpensesForm />;
    case "REVENUE_INTRODUCTION":
      return <ProjectRevenueIntroduction />;
    case "REVENUE_FINANCIAL_ASSISTANCE":
      return <ProjectFinancialAssistanceRevenueForm />;
    case "REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
      return <YearlyProjectedRevenueForm />;
    case "REVENUE_EXPECTED_SITE_RESALE":
      return <SiteResaleRevenueForm />;
    case "REVENUE_BUILDINGS_RESALE":
      return <BuildingsResaleRevenueForm />;
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
