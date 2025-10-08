import { lazy, ReactNode, Suspense } from "react";

import { UrbanProjectCustomCreationStep } from "@/features/create-project/core/urban-project/creationSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { HTML_URBAN_PROJECT_FORM_MAIN_TITLE } from "../htmlTitle";
import UrbanProjectCustomStepper from "./stepper/Stepper";

const AnswerCascadingUpdateDialog = lazy(() => import("./AnswerCascadingUpdateDialog"));
const BuildingsFloorSurfaceArea = lazy(() => import("./buildings/floor-surface-area"));
const BuildingsIntroduction = lazy(() => import("./buildings/introduction"));
const BuildingsUseIntroduction = lazy(() => import("./buildings/use-introduction"));
const BuildingsUseSurfaceAreas = lazy(() => import("./buildings/use-surface-areas"));
const ProjectCreationResult = lazy(() => import("./creation-result"));
const InstallationExpensesForm = lazy(() => import("./expenses/installation"));
const ProjectExpensesIntroduction = lazy(() => import("./expenses/introduction"));
const ReinstatementExpensesForm = lazy(() => import("./expenses/reinstatement"));
const SitePurchaseAmounts = lazy(() => import("./expenses/site-purchase-amounts"));
const YearlyProjectedExpensesForm = lazy(() => import("./expenses/yearly-projected-costs"));
const ProjectNameAndDescriptionForm = lazy(() => import("./name-and-description"));
const ProjectPhaseForm = lazy(() => import("./project-phase"));
const BuildingsResaleRevenueForm = lazy(() => import("./revenues/buildings-resale"));
const ProjectFinancialAssistanceRevenueForm = lazy(() => import("./revenues/financial-assistance"));
const ProjectRevenueIntroduction = lazy(() => import("./revenues/introduction"));
const SiteResaleRevenueForm = lazy(() => import("./revenues/site-resale"));
const YearlyProjectedRevenueForm = lazy(
  () => import("./revenues/yearly-buildings-operations-revenues"),
);
const ProjectScheduleIntroduction = lazy(() => import("./schedule/introduction"));
const ScheduleProjectionForm = lazy(() => import("./schedule/projection"));
const BuildingsResaleForm = lazy(() => import("./site-resale/buildings-resale"));
const SiteResaleIntroduction = lazy(() => import("./site-resale/introduction"));
const SiteResaleForm = lazy(() => import("./site-resale/selection"));
const SoilsDecontaminationIntroduction = lazy(() => import("./soils-decontamination/intro"));
const SoilsDecontaminationSelection = lazy(() => import("./soils-decontamination/selection"));
const SoilsDecontaminationSurfaceArea = lazy(() => import("./soils-decontamination/surface-area"));
const UrbanSpacesDevelopmentPlanIntroduction = lazy(
  () => import("./spaces/development-plan-introduction"),
);
const GreenSpacesIntroduction = lazy(() => import("./spaces/green-spaces/introduction"));
const UrbanGreenSpacesDistribution = lazy(
  () => import("./spaces/green-spaces/surface-area-distribution"),
);
const UrbanProjectSpacesIntroduction = lazy(() => import("./spaces/introduction"));
const LivingAndActivitySpacesIntroduction = lazy(
  () => import("./spaces/living-and-activity-spaces/introduction"),
);
const LivingAndActivitySpacesDistribution = lazy(
  () => import("./spaces/living-and-activity-spaces/surface-area-distribution"),
);
const PublicSpacesIntroduction = lazy(() => import("./spaces/public-spaces/introduction"));
const PublicSpacesDistribution = lazy(
  () => import("./spaces/public-spaces/surface-area-distribution"),
);
const SpacesCategoriesSelection = lazy(() => import("./spaces/selection"));
const UrbanProjectSoilsCarbonStorage = lazy(() => import("./spaces/soils-carbon-storage"));
const UrbanProjectSoilsSummary = lazy(() => import("./spaces/soils-summary"));
const UrbanProjectSpaceCategoriesSurfaceAreaDistribution = lazy(
  () => import("./spaces/surface-area"),
);
const DeveloperForm = lazy(() => import("./stakeholders/developer"));
const ProjectStakeholdersIntroduction = lazy(() => import("./stakeholders/introduction"));
const SiteReinstatementContractOwnerForm = lazy(
  () => import("./stakeholders/reinstatement-contract-owner"),
);
const ProjectCreationDataSummary = lazy(() => import("./summary"));

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
      title="Renseignement du projet"
      sidebarChildren={<UrbanProjectCustomStepper step={currentStep} />}
      mainChildren={
        <Suspense fallback={<LoadingSpinner />}>
          {getCurrentStepView(currentStep)}
          <AnswerCascadingUpdateDialog />
        </Suspense>
      }
    />
  );
}
