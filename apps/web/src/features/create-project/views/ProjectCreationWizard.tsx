import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { routes } from "@/shared/views/router";

import { reconversionProjectCreationInitiated } from "../core/actions/urbanProjectCreationInitiated.action";
import { ProjectCreationStep } from "../core/createProject.reducer";
import {
  selectCurrentStep,
  selectProjectDevelopmentPlanCategory,
} from "../core/createProject.selectors";
import Stepper from "./Stepper";
import ProjectCreationIntroduction from "./introduction";
import PhotovoltaicPowerStationCreationWizard from "./photovoltaic-power-station";
import ProjectTypesForm from "./project-types";
import UrbanProjectCreationWizard from "./urban-project/UrbanProjectCreationWizard";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

type Props = {
  route: Route<typeof routes.createProject>;
};
const PROJECT_CREATION_STEP_QUERY_STRING_MAP = {
  INTRODUCTION: "introduction",
  PROJECT_TYPES: "type-de-projet",
} as const satisfies Record<ProjectCreationStep, string>;

function ProjectCreationWizard({ route }: Props) {
  const currentStep = useAppSelector(selectCurrentStep);
  const projectDevelopmentPlanCategory = useAppSelector(selectProjectDevelopmentPlanCategory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const relatedSiteId = route.params.siteId;
    void dispatch(reconversionProjectCreationInitiated({ relatedSiteId }));
  }, [dispatch, route.params.siteId]);

  useSyncCreationStepWithRouteQuery(PROJECT_CREATION_STEP_QUERY_STRING_MAP[currentStep]);

  const getStepComponent = () => {
    switch (currentStep) {
      case "INTRODUCTION":
        return <ProjectCreationIntroduction />;
      case "PROJECT_TYPES":
        return <ProjectTypesForm />;
    }
  };

  switch (projectDevelopmentPlanCategory) {
    case "RENEWABLE_ENERGY":
      return <PhotovoltaicPowerStationCreationWizard />;
    case "URBAN_PROJECT":
      return <UrbanProjectCreationWizard />;
    default:
      return (
        <SidebarLayout
          mainChildren={getStepComponent()}
          title="Renseignement du projet"
          sidebarChildren={<Stepper />}
        />
      );
  }
}

export default ProjectCreationWizard;
