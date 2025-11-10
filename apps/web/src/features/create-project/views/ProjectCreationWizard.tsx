import { useEffect } from "react";
import { Route } from "type-route";

import { isUrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { ProjectFormProvider } from "@/shared/views/project-form/ProjectFormProvider";
import { routes } from "@/shared/views/router";

import { reconversionProjectCreationInitiated } from "../core/actions/reconversionProjectCreationInitiated.action";
import { ProjectCreationStep } from "../core/createProject.reducer";
import { selectCurrentStep } from "../core/createProject.selectors";
import { isRenewableEnergyCreationStep } from "../core/renewable-energy/creationSteps";
import Stepper from "./Stepper";
import StepRevertConfirmationModal from "./common-views/step-revert-confirmation-modal";
import ProjectCreationIntroduction from "./introduction";
import { HTML_MAIN_TITLE } from "./mainHtmlTitle";
import PhotovoltaicPowerStationCreationWizard from "./photovoltaic-power-station/PhotovoltaicPowerStationCreationWizard";
import { RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "./photovoltaic-power-station/custom-form/creationStepQueryStringMap";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import UrbanProjectCreationWizard from "./urban-project/UrbanProjectCreationWizard";
import { URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP } from "./urban-project/creationStepQueryStringMap";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

type Props = {
  route: Route<typeof routes.createProject>;
};
const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  PROJECT_TYPES: "type-de-projet",
  PROJECT_SUGGESTIONS: "projets-suggeres",
  ...URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP,
  ...RENEWABLE_ENERGY_PROJECT_CREATION_STEP_QUERY_STRING_MAP,
} as const satisfies Record<ProjectCreationStep, string>;

const ProjectCreationIntroductionWizard = ({
  currentStep,
}: {
  currentStep: ProjectCreationStep;
}) => {
  const getStepComponent = () => {
    switch (currentStep) {
      case "INTRODUCTION":
        return <ProjectCreationIntroduction />;
      case "PROJECT_TYPES":
        return <ProjectTypesForm />;
      case "PROJECT_SUGGESTIONS":
        return <div>En construction</div>;
    }
  };
  return (
    <SidebarLayout
      mainChildren={getStepComponent()}
      title="Renseignement du projet"
      sidebarChildren={<Stepper />}
    />
  );
};

function ProjectCreationWizard({ route }: Props) {
  const currentStep = useAppSelector(selectCurrentStep);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const relatedSiteId = route.params.siteId;
    void dispatch(reconversionProjectCreationInitiated({ relatedSiteId }));
  }, [dispatch, route.params.siteId]);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  if (isUrbanProjectCreationStep(currentStep)) {
    return (
      <ProjectFormProvider mode="create">
        <StepRevertConfirmationModal />
        <UrbanProjectCreationWizard />
      </ProjectFormProvider>
    );
  }

  if (isRenewableEnergyCreationStep(currentStep)) {
    return (
      <ProjectFormProvider mode="create">
        <StepRevertConfirmationModal />
        {currentStep === "RENEWABLE_ENERGY_TYPES" ? (
          <>
            <HtmlTitle>{`Système d'EnR - Type de projet - ${HTML_MAIN_TITLE}`}</HtmlTitle>
            <SidebarLayout
              mainChildren={<RenewableEnergyTypesForm />}
              title="Renseignement du projet"
              sidebarChildren={<Stepper />}
            />
          </>
        ) : (
          <PhotovoltaicPowerStationCreationWizard currentStep={currentStep} />
        )}
      </ProjectFormProvider>
    );
  }

  return (
    <>
      <HtmlTitle>{`Introduction - ${HTML_MAIN_TITLE}`}</HtmlTitle>
      <StepRevertConfirmationModal />
      <ProjectCreationIntroductionWizard currentStep={currentStep} />
    </>
  );
}

export default ProjectCreationWizard;
