import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import {
  isUrbanProjectCreationStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { ProjectFormProvider } from "@/shared/views/project-form/ProjectFormProvider";

import { reconversionProjectCreationInitiated } from "../core/actions/reconversionProjectCreationInitiated.action";
import { ProjectCreationStep } from "../core/createProject.reducer";
import { selectCurrentStep } from "../core/createProject.selectors";
import {
  AllRenewableEnergyStep,
  isRenewableEnergyCreationStep,
} from "../core/renewable-energy/renewableEnergySteps";
import Stepper from "./Stepper";
import ProjectCreationIntroduction from "./introduction";
import { HTML_MAIN_TITLE } from "./mainHtmlTitle";
import PhotovoltaicPowerStationCreationWizard from "./photovoltaic-power-station/PhotovoltaicPowerStationCreationWizard";
import ProjectSuggestionsForm from "./project-suggestions";
import ProjectTypesForm from "./project-types";
import RenewableEnergyTypesForm from "./renewable-energy-types";
import UrbanProjectCreationWizard from "./urban-project/UrbanProjectCreationWizard";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

type Props = {
  route: Route<typeof routes.createProject>;
};
const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  PROJECT_TYPE_SELECTION: "type-de-projet",
  PROJECT_SUGGESTIONS: "projets-suggeres",
} as const satisfies Record<
  Exclude<ProjectCreationStep, UrbanProjectCreationStep | AllRenewableEnergyStep>,
  string
>;

const ProjectCreationIntroductionWizard = ({
  currentStep,
}: {
  currentStep: Exclude<ProjectCreationStep, UrbanProjectCreationStep | AllRenewableEnergyStep>;
}) => {
  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  const getStepComponent = () => {
    switch (currentStep) {
      case "INTRODUCTION":
        return <ProjectCreationIntroduction />;
      case "PROJECT_TYPE_SELECTION":
        return <ProjectTypesForm />;
      case "PROJECT_SUGGESTIONS":
        return <ProjectSuggestionsForm />;
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
    const payload = route.params.projectSuggestions
      ? { relatedSiteId, projectSuggestions: route.params.projectSuggestions }
      : { relatedSiteId };
    void dispatch(reconversionProjectCreationInitiated(payload));
  }, [dispatch, route.params.siteId, route.params.projectSuggestions]);

  if (isUrbanProjectCreationStep(currentStep)) {
    return (
      <ProjectFormProvider mode="create">
        <UrbanProjectCreationWizard />
      </ProjectFormProvider>
    );
  }

  if (isRenewableEnergyCreationStep(currentStep)) {
    return (
      <ProjectFormProvider mode="create">
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
      <ProjectCreationIntroductionWizard currentStep={currentStep} />
    </>
  );
}

export default ProjectCreationWizard;
