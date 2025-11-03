import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";
import { Route } from "type-route";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SidebarLayout from "@/shared/views/layout/SidebarLayout/SidebarLayout";
import { routes } from "@/shared/views/router";

import { reconversionProjectUpdateInitiated } from "../core/updateProject.actions";
import UnavailableFeatureView from "./UnavailableFeatureView";
import UrbanProjectUpdateView from "./UrbanProjectUpdateView";

type Props = {
  route: Route<typeof routes.updateProject>;
};

function UpdateProjectPage({ route }: Props) {
  const dispatch = useAppDispatch();

  const {
    loadingState,
    projectType,
    isExpress: isExpressProject,
  } = useAppSelector((state) => state.projectUpdate.projectData);

  useEffect(() => {
    const projectId = route.params.projectId;
    void dispatch(reconversionProjectUpdateInitiated(projectId));
  }, [dispatch, route.params.projectId]);

  if (loadingState !== "success") {
    return (
      <>
        <HtmlTitle>Modifier un projet</HtmlTitle>
        <SidebarLayout
          title="Modification du projet"
          sidebarChildren={null}
          mainChildren={(() => {
            switch (loadingState) {
              case "error":
                return (
                  <Alert
                    className="md:max-w-xl"
                    severity="error"
                    title="Impossible de charger le projet"
                    description="Une erreur s'est produite lors de la récupération du projet."
                  />
                );
              case "idle":
              case "loading":
                return <LoadingSpinner />;
            }
          })()}
        />
      </>
    );
  }

  if (projectType === "URBAN_PROJECT" && !isExpressProject) {
    return <UrbanProjectUpdateView />;
  }

  return <UnavailableFeatureView />;
}

export default UpdateProjectPage;
