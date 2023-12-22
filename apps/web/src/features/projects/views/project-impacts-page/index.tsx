import { useEffect } from "react";
import { fetchProjectAndSiteData } from "../../application/projectImpacts.actions";
import { ProjectImpactsState } from "../../application/projectImpacts.reducer";
import ProjectsImpactsPage from "./ProjectImpactsPage";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  projectId: string;
};

type SuccessDataProps = {
  siteData: Exclude<ProjectImpactsState["siteData"], undefined>;
  projectData: Exclude<ProjectImpactsState["projectData"], undefined>;
  dataLoadingState: "success";
};

type ErrorOrLoadingDataProps = {
  siteData: undefined;
  projectData: undefined;
  dataLoadingState: "idle" | "error" | "loading";
};

function ProjectsImpacts({ projectId }: Props) {
  const dispatch = useAppDispatch();

  const { siteData, projectData, dataLoadingState } = useAppSelector(
    (state) => state.projectImpacts,
  ) as SuccessDataProps | ErrorOrLoadingDataProps;

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchProjectAndSiteData(projectId));
    }
    void fetchData();
  }, [projectId, dispatch]);

  if (dataLoadingState === "success") {
    return (
      <ProjectsImpactsPage
        projectData={projectData}
        projectId={projectId}
        siteName={siteData.name}
        loadingState="success"
      />
    );
  }

  return (
    <ProjectsImpactsPage
      projectData={undefined}
      projectId={projectId}
      siteName={undefined}
      loadingState={dataLoadingState}
    />
  );
}

export default ProjectsImpacts;
