import { useEffect, useMemo } from "react";
import { Route } from "type-route";
import { fetchBaseProjectAndWithProjectData } from "../../application/projectImpactsComparison.actions";
import { ProjectImpactsComparisonState } from "../../application/projectImpactsComparison.reducer";
import ProjectsImpactsComparisonPage from "./ProjectsImpactsComparisonPage";

import { routes } from "@/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.compareProjects>;
};

type SuccessDataProps = {
  siteData: Exclude<ProjectImpactsComparisonState["siteData"], undefined>;
  projectData: Exclude<ProjectImpactsComparisonState["projectData"], undefined>;
  dataLoadingState: "success";
};

type ErrorOrLoadingDataProps = {
  siteData: undefined;
  projectData: undefined;
  dataLoadingState: "idle" | "error" | "loading";
};

function ProjectsImpactsComparison({ route }: Props) {
  const dispatch = useAppDispatch();

  const { baseProjectId, avecProjet } = useMemo(() => route.params, [route.params]);

  const { siteData, projectData, dataLoadingState } = useAppSelector(
    (state) => state.projectImpactsComparison,
  ) as SuccessDataProps | ErrorOrLoadingDataProps;

  useEffect(() => {
    async function fetchData() {
      await dispatch(
        fetchBaseProjectAndWithProjectData({
          baseProjectId,
          withProject: avecProjet,
        }),
      );
    }
    void fetchData();
  }, [avecProjet, baseProjectId, dispatch]);

  if (dataLoadingState === "success") {
    return (
      <ProjectsImpactsComparisonPage
        siteData={siteData}
        projectData={projectData}
        loadingState="success"
      />
    );
  }

  return (
    <ProjectsImpactsComparisonPage
      siteData={undefined}
      projectData={undefined}
      loadingState={dataLoadingState}
    />
  );
}

export default ProjectsImpactsComparison;
