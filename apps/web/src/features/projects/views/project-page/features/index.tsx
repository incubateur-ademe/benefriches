import Alert from "@codegouvfr/react-dsfr/Alert";
import { useEffect } from "react";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import {
  selectProjectFeatures,
  selectProjectFeaturesLoadingState,
} from "@/features/projects/application/project-features/projectFeatures.reducer";
import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectFeaturesView from "./ProjectFeaturesView";

type Props = {
  projectId: string;
};

const ProjectFeaturesViewContainer = ({ projectId }: Props) => {
  const projectFeatures = useAppSelector(selectProjectFeatures);
  const loadingState = useAppSelector(selectProjectFeaturesLoadingState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (projectFeatures?.id !== projectId) {
      void dispatch(fetchProjectFeatures({ projectId }));
    }
  }, [dispatch, projectFeatures, projectId]);

  if (loadingState === "loading") {
    return (
      <>
        <HtmlTitle>Chargement... - Caractéristiques du projet</HtmlTitle>
        <LoadingSpinner />
      </>
    );
  }

  if (loadingState === "success") {
    return <ProjectFeaturesView projectData={projectFeatures!} />;
  }

  if (loadingState === "error") {
    return (
      <>
        <HtmlTitle>Erreur - Caractéristiques du projet</HtmlTitle>
        <Alert
          description="Une erreur s'est produite lors du chargement des données, veuillez réessayer."
          severity="error"
          title="Impossible de charger les caractéristiques du projet"
          className="my-7"
        />
      </>
    );
  }
};

export default ProjectFeaturesViewContainer;
