import { useEffect } from "react";
import { useState } from "react";
import { Route } from "type-route";

import { routes } from "@/app/views/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";

import { projectCreationInitiated } from "../application/createProject.actions";
import { selectCurrentStep } from "../application/createProject.reducer";
import { selectProjectDevelopmentPlanCategory } from "../application/createProject.selectors";
import Stepper from "./Stepper";
import ProjectCreationIntroduction from "./introduction";
import PhotovoltaicPowerStationCreationWizard from "./photovoltaic-power-station";
import ProjectTypesForm from "./project-types";
import UrbanProjectCreationWizard from "./urban-project/UrbanProjectCreationWizard";
import { useSyncCreationStepWithRouteQuery } from "./useSyncCreationStepWithRouteQuery";

type Props = {
  route: Route<typeof routes.createProject>;
};

function ProjectCreationWizard({ route }: Props) {
  const currentStep = useAppSelector(selectCurrentStep);
  const projectDevelopmentPlanCategory = useAppSelector(selectProjectDevelopmentPlanCategory);
  const [isOpen, setOpen] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const relatedSiteId = route.params.siteId;
    void dispatch(projectCreationInitiated({ relatedSiteId }));
  }, [dispatch, route.params.siteId]);

  useSyncCreationStepWithRouteQuery();

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
    case "URBAN_BUILDINGS":
      return <UrbanProjectCreationWizard />;
    default:
      return (
        <SidebarLayout
          mainChildren={getStepComponent()}
          title="Renseignement du projet"
          isOpen={isOpen}
          toggleIsOpen={() => {
            setOpen((current) => !current);
          }}
          sidebarChildren={<Stepper isExtended={isOpen} />}
        />
      );
  }
}

export default ProjectCreationWizard;
