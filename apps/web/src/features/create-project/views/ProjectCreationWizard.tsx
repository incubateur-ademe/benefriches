import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";
import { Route } from "type-route";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { ProjectFormProvider } from "@/shared/views/project-form/ProjectFormProvider";

import { reconversionProjectCreationInitiated } from "../core/actions/reconversionProjectCreationInitiated.action";
import { selectProjectCreationWizardViewData } from "../core/createProject.selectors";
import DemoProjectCreationWizard from "./demo/DemoProjectCreationWizard";
import PhotovoltaicPowerStationCreationWizard from "./photovoltaic-power-station";
import UrbanProjectCreationWizard from "./urban-project/UrbanProjectCreationWizard";
import UseCaseSelectionProjectCreationWizard from "./usecase-selection/UseCaseSelectionProjectCreationWizard";

type Props = {
  route: Route<typeof routes.createProject>;
};

function ProjectCreationWizard({ route }: Props) {
  const { currentStepGroup, loadingState } = useAppSelector(selectProjectCreationWizardViewData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const relatedSiteId = route.params.siteId;
    const payload = route.params.projectSuggestions
      ? { relatedSiteId, projectSuggestions: route.params.projectSuggestions }
      : { relatedSiteId };
    void dispatch(reconversionProjectCreationInitiated(payload));
  }, [dispatch, route.params.siteId, route.params.projectSuggestions]);

  if (loadingState !== "success") {
    return (
      <SidebarLayout
        title="Renseignement du projet"
        sidebarChildren={null}
        mainChildren={(() => {
          switch (loadingState) {
            case "error":
              return (
                <Alert
                  description="Une erreur s'est produite lors de la récupération des informations du site"
                  severity="error"
                  title="Impossible de charger les informations du site"
                  className="my-7"
                />
              );
            case "loading":
              return <LoadingSpinner />;
            case "idle":
              return null;
          }
        })()}
      />
    );
  }

  switch (currentStepGroup) {
    case "URBAN_PROJECT":
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (
        <ProjectFormProvider mode="create">
          {currentStepGroup === "URBAN_PROJECT" ? (
            <UrbanProjectCreationWizard />
          ) : (
            <PhotovoltaicPowerStationCreationWizard />
          )}
        </ProjectFormProvider>
      );
    case "DEMO":
      return <DemoProjectCreationWizard />;
    case "USE_CASE_SELECTION":
      return <UseCaseSelectionProjectCreationWizard />;
  }
}

export default ProjectCreationWizard;
