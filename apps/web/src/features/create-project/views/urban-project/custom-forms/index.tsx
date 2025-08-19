import { ReactNode } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { HTML_URBAN_PROJECT_FORM_MAIN_TITLE } from "../htmlTitle";
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
      return (
        <>
          <HtmlTitle>{`Introduction - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanProjectSpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SpacesCategoriesSelection />
        </>
      );
    case "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Répartition - Espaces  - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanProjectSpaceCategoriesSurfaceAreaDistribution />
        </>
      );
    case "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanSpacesDevelopmentPlanIntroduction />
        </>
      );
    case "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Espaces verts - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <GreenSpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Répartition - Espaces verts - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanGreenSpacesDistribution />
        </>
      );
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Lieux d'habitation et d'activité - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <LivingAndActivitySpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Répartition - Lieux d'habitation et d'activité - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <LivingAndActivitySpacesDistribution />
        </>
      );
    case "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Espaces publics - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PublicSpacesIntroduction />
        </>
      );
    case "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Répartition - Espaces publics - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <PublicSpacesDistribution />
        </>
      );
    case "URBAN_PROJECT_SPACES_SOILS_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanProjectSoilsSummary />
        </>
      );
    case "URBAN_PROJECT_SOILS_CARBON_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Carbone stocké dans les sols - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <UrbanProjectSoilsCarbonStorage />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationIntroduction />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
      return (
        <>
          <HtmlTitle>{`Mode de saisie - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationSelection />
        </>
      );
    case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surface - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SoilsDecontaminationSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsIntroduction />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
      return (
        <>
          <HtmlTitle>{`Surfaces - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsFloorSurfaceArea />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Usages - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsUseIntroduction />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
      return (
        <>
          <HtmlTitle>{`Répartition - Usages - Bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsUseSurfaceAreas />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectStakeholdersIntroduction />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER":
      return (
        <>
          <HtmlTitle>{`Aménageur - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <DeveloperForm />
        </>
      );
    case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
      return (
        <>
          <HtmlTitle>{`Maître d'ouvrage de la réhabilitation - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteReinstatementContractOwnerForm />
        </>
      );
    case "URBAN_PROJECT_SITE_RESALE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Revente - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteResaleIntroduction />
        </>
      );
    case "URBAN_PROJECT_SITE_RESALE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Revente - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteResaleForm />
        </>
      );
    case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
      return (
        <>
          <HtmlTitle>{`Sélection - Revente des bâtiments - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsResaleForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectExpensesIntroduction />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
      return (
        <>
          <HtmlTitle>{`Achat du site - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SitePurchaseAmounts />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_INSTALLATION":
      return (
        <>
          <HtmlTitle>{`Aménagement - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <InstallationExpensesForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
      return (
        <>
          <HtmlTitle>{`Exploitation - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <YearlyProjectedExpensesForm />
        </>
      );
    case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
      return (
        <>
          <HtmlTitle>{`Remise en état - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ReinstatementExpensesForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectRevenueIntroduction />
        </>
      );
    case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
      return (
        <>
          <HtmlTitle>{`Aides financières - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectFinancialAssistanceRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
      return (
        <>
          <HtmlTitle>{`Exploitation - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <YearlyProjectedRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
      return (
        <>
          <HtmlTitle>{`Revente du site - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <SiteResaleRevenueForm />
        </>
      );
    case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
      return (
        <>
          <HtmlTitle>{`Revente des bâtiments - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <BuildingsResaleRevenueForm />
        </>
      );
    case "URBAN_PROJECT_SCHEDULE_INTRODUCTION":
      return (
        <>
          <HtmlTitle>{`Introduction - Calendrier - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectScheduleIntroduction />
        </>
      );
    case "URBAN_PROJECT_SCHEDULE_PROJECTION":
      return (
        <>
          <HtmlTitle>{`Saisie - Calendrier - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ScheduleProjectionForm />
        </>
      );
    case "URBAN_PROJECT_PROJECT_PHASE":
      return (
        <>
          <HtmlTitle>{`Avancement - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectPhaseForm />
        </>
      );
    case "URBAN_PROJECT_NAMING":
      return (
        <>
          <HtmlTitle>{`Dénomination - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectNameAndDescriptionForm />
        </>
      );
    case "URBAN_PROJECT_FINAL_SUMMARY":
      return (
        <>
          <HtmlTitle>{`Récapitulatif - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectCreationDataSummary />
        </>
      );
    case "URBAN_PROJECT_CREATION_RESULT":
      return (
        <>
          <HtmlTitle>{`Résultat - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`}</HtmlTitle>
          <ProjectCreationResult />
        </>
      );
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
