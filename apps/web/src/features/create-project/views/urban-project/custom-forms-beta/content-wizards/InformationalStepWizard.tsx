import { lazy, Suspense, useEffect } from "react";

import {
  selectProjectId,
  selectSiteContaminatedSurfaceArea,
  selectSiteSoilsDistribution,
} from "@/features/create-project/core/createProject.selectors";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/urban-project-event-sourcing/soils-carbon-storage/soilsCarbonStorage.action";
import {
  selectCurrentAndProjectedSoilsCarbonStorage,
  selectLoadingState,
} from "@/features/create-project/core/urban-project-event-sourcing/soils-carbon-storage/soilsCarbonStorage.selectors";
import {
  navigateToNext,
  navigateToPrevious,
  navigateToStep,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProject.actions";
import {
  selectFormAnswers,
  selectProjectSoilDistribution,
  selectProjectSpaces,
  selectStepAnswers,
} from "@/features/create-project/core/urban-project-event-sourcing/urbanProject.selectors";
import { customUrbanProjectSaved } from "@/features/create-project/core/urban-project-event-sourcing/urbanProjectSave.action";
import { InformationalStep } from "@/features/create-project/core/urban-project-event-sourcing/urbanProjectSteps";
import { RootState } from "@/shared/core/store-config/store";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "../../../common-views/result/ProjectCreationResult";
import { HTML_URBAN_PROJECT_FORM_MAIN_TITLE } from "../../htmlTitle";

const BuildingsIntroduction = lazy(
  () => import("../../custom-forms/buildings/introduction/BuildingsIntroduction"),
);
const BuildingsUseIntroduction = lazy(
  () => import("../../custom-forms/buildings/use-introduction/BuildingsUseIntroduction"),
);
const ProjectExpensesIntroduction = lazy(
  () => import("../../custom-forms/expenses/introduction/ProjectExpensesIntroduction"),
);
const ProjectRevenueIntroduction = lazy(
  () => import("../../custom-forms/revenues/introduction/ProjectRevenueIntroduction"),
);
const ProjectScheduleIntroduction = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/schedule/introduction/ScheduleIntroduction"
    ),
);
const SiteResaleIntroduction = lazy(
  () => import("../../custom-forms/site-resale/introduction/SiteResaleIntroduction"),
);
const SoilsDecontaminationIntroduction = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction"
    ),
);
const UrbanSpacesDevelopmentPlanIntroduction = lazy(
  () =>
    import(
      "../../custom-forms/spaces/development-plan-introduction/UrbanSpacesDevelopmentPlanIntroduction"
    ),
);
const GreenSpacesIntroduction = lazy(
  () => import("../../custom-forms/spaces/green-spaces/introduction/UrbanGreenSpacesIntroduction"),
);
const UrbanProjectSpacesIntroduction = lazy(
  () => import("../../custom-forms/spaces/introduction/SpacesIntroduction"),
);
const LivingAndActivitySpacesIntroduction = lazy(
  () =>
    import(
      "../../custom-forms/spaces/living-and-activity-spaces/introduction/LivingAndActivitySpacesIntroduction"
    ),
);
const PublicSpacesIntroduction = lazy(
  () => import("../../custom-forms/spaces/public-spaces/introduction/PublicSpacesIntroduction"),
);
const UrbanProjectSoilsCarbonStorage = lazy(
  () => import("@/features/create-project/views/common-views/soils-carbon-storage-comparison"),
);
const UrbanProjectSoilsSummary = lazy(
  () => import("../../custom-forms/spaces/soils-summary/UrbanProjectSoilsSummary"),
);
const ProjectStakeholdersIntroduction = lazy(
  () =>
    import(
      "@/features/create-project/views/common-views/stakeholder-introduction/StakeholdersIntroduction"
    ),
);
const ProjectCreationDataSummary = lazy(
  () => import("../../custom-forms/summary/ProjectCreationDataSummary"),
);

const GreenSpacesIntroductionWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  return (
    <GreenSpacesIntroduction
      onNext={onNext}
      onBack={onBack}
      greenSpacesSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
    />
  );
};

const LivingAndActivitySpacesIntroductionWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  return (
    <LivingAndActivitySpacesIntroduction
      onNext={onNext}
      onBack={onBack}
      livingAndActivitySpacesSurfaceArea={
        spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES ?? 0
      }
    />
  );
};

const PublicSpacesIntroductionWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};

  return (
    <PublicSpacesIntroduction
      onNext={onNext}
      onBack={onBack}
      publicSpacesSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
    />
  );
};

const UrbanProjectSoilsSummaryWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const siteSoilsDistribution = useAppSelector(selectSiteSoilsDistribution);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilDistribution);

  return (
    <UrbanProjectSoilsSummary
      onNext={onNext}
      onBack={onBack}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
    />
  );
};

const UrbanProjectSoilsCarbonStorageWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector(selectLoadingState);
  const { current, projected } = useAppSelector(selectCurrentAndProjectedSoilsCarbonStorage);

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  if (loadingState === "error") {
    onNext();
  }

  if (loadingState === "loading" || loadingState === "idle") {
    return <LoadingSpinner />;
  }

  return (
    <UrbanProjectSoilsCarbonStorage
      onNext={onNext}
      onBack={onBack}
      loadingState="success"
      currentCarbonStorage={current!}
      projectedCarbonStorage={projected!}
    />
  );
};

const SoilsDecontaminationIntroductionWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const siteContaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      onNext={onNext}
      onBack={onBack}
      contaminatedSurfaceArea={siteContaminatedSurfaceArea}
    />
  );
};

const BuildingsIntroductionWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};

  return (
    <BuildingsIntroduction
      onNext={onNext}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
    />
  );
};

const ProjectCreationDataSummaryWrapper = ({ onNext, onBack }: StepComponentProps) => {
  const projectData = useAppSelector(selectFormAnswers);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilDistribution);
  const projectSpaces = useAppSelector(selectProjectSpaces);
  const projectId = useAppSelector(selectProjectId);
  const dispatch = useAppDispatch();

  return (
    <ProjectCreationDataSummary
      onNext={() => {
        void dispatch(customUrbanProjectSaved());
        onNext();
      }}
      onBack={onBack}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      projectId={projectId}
      projectSpaces={projectSpaces}
      onExpensesAndRevenuesTitleClick={() => {
        dispatch(navigateToStep({ stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION" }));
      }}
    />
  );
};

const ProjectCreationResultContainer = ({ onBack }: StepComponentProps) => {
  const { saveState, projectId } = useAppSelector((state: RootState) => ({
    saveState: state.projectCreation.urbanProjectEventSourcing.saveState,
    projectId: state.projectCreation.projectId,
  }));
  const { name: projectName } = useAppSelector(selectStepAnswers("URBAN_PROJECT_NAMING")) ?? {};

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName ?? ""}
      loadingState={saveState}
      onBack={onBack}
    />
  );
};

interface StepComponentProps {
  onNext: () => void;
  onBack: () => void;
}

interface StepConfig {
  htmlTitle: string;
  Component: React.ComponentType<StepComponentProps>;
}

const STEP_CONFIGS: Record<InformationalStep, StepConfig> = {
  URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION: {
    htmlTitle: `Introduction - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: UrbanProjectSpacesIntroduction,
  },
  URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION: {
    htmlTitle: `Introduction - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: UrbanSpacesDevelopmentPlanIntroduction,
  },
  URBAN_PROJECT_GREEN_SPACES_INTRODUCTION: {
    htmlTitle: `Introduction - Espaces verts - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: GreenSpacesIntroductionWrapper,
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION: {
    htmlTitle: `Introduction - Lieux d'habitation et d'activité - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: LivingAndActivitySpacesIntroductionWrapper,
  },
  URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION: {
    htmlTitle: `Introduction - Espaces publics - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: PublicSpacesIntroductionWrapper,
  },
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: {
    htmlTitle: `Récapitulatif - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: UrbanProjectSoilsSummaryWrapper,
  },
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: {
    htmlTitle: `Carbone stocké dans les sols - Espaces - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: UrbanProjectSoilsCarbonStorageWrapper,
  },
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: {
    htmlTitle: `Introduction - Dépollution - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SoilsDecontaminationIntroductionWrapper,
  },
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: {
    htmlTitle: `Introduction - BÃ¢timents - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsIntroductionWrapper,
  },
  URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION: {
    htmlTitle: `Introduction - Usages - BÃ¢timents - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: BuildingsUseIntroduction,
  },
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: {
    htmlTitle: `Introduction - Acteurs - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectStakeholdersIntroduction,
  },
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: {
    htmlTitle: `Introduction - Revente - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: SiteResaleIntroduction,
  },
  URBAN_PROJECT_EXPENSES_INTRODUCTION: {
    htmlTitle: `Introduction - Dépenses - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectExpensesIntroduction,
  },
  URBAN_PROJECT_REVENUE_INTRODUCTION: {
    htmlTitle: `Introduction - Revenus - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectRevenueIntroduction,
  },
  URBAN_PROJECT_SCHEDULE_INTRODUCTION: {
    htmlTitle: `Introduction - Calendrier - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectScheduleIntroduction,
  },
  URBAN_PROJECT_FINAL_SUMMARY: {
    htmlTitle: `Récapitulatif - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectCreationDataSummaryWrapper,
  },
  URBAN_PROJECT_CREATION_RESULT: {
    htmlTitle: `Résultat - ${HTML_URBAN_PROJECT_FORM_MAIN_TITLE}`,
    Component: ProjectCreationResultContainer,
  },
};

type Props = {
  currentStep: InformationalStep;
};

export default function InformationalStepWizard({ currentStep }: Props) {
  const dispatch = useAppDispatch();

  const onBack = () => {
    dispatch(navigateToPrevious({ stepId: currentStep }));
  };

  const onNext = () => {
    dispatch(navigateToNext({ stepId: currentStep }));
  };

  const stepConfig = STEP_CONFIGS[currentStep];
  const { htmlTitle, Component } = stepConfig;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HtmlTitle>{htmlTitle}</HtmlTitle>
      <Component onNext={onNext} onBack={onBack} />
    </Suspense>
  );
}
