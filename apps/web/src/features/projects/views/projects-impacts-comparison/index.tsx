import { useEffect, useMemo } from "react";
import { Route } from "type-route";
import { fetchBaseProjectAndWithProjectData } from "../../application/projectImpactsComparison.actions";
import { Project, ProjectSite } from "../../domain/projects.types";
import ProjectsImpactsComparisonPage from "./ProjectsImpactsComparisonPage";

import { routes } from "@/app/views/router";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.compareProjects>;
};

type SuccessDataProps = {
  baseScenario:
    | {
        type: "STATU_QUO";
        id: string;
        siteData: ProjectSite;
      }
    | {
        type: "PROJECT";
        id: string;
        projectData: Project;
        siteData: ProjectSite;
      };
  withScenario: {
    type: "PROJECT";
    id: string;
    projectData: Project;
    siteData: ProjectSite;
  };
  dataLoadingState: "success";
};

type ErrorOrLoadingDataProps = {
  dataLoadingState: "idle" | "error" | "loading";
  baseScenario: {
    id: undefined;
    type: undefined;
    projectData: undefined;
    siteData: undefined;
  };
  withScenario: {
    id: undefined;
    type: undefined;
    projectData: undefined;
    siteData: undefined;
  };
};

function ProjectsImpactsComparison({ route }: Props) {
  const dispatch = useAppDispatch();

  const { baseProjectId, avecProjet } = useMemo(() => route.params, [route.params]);

  const { baseScenario, withScenario, dataLoadingState } = useAppSelector(
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
        baseScenario={baseScenario}
        withScenario={withScenario}
        loadingState="success"
      />
    );
  }

  return (
    <ProjectsImpactsComparisonPage
      baseScenario={undefined}
      withScenario={undefined}
      loadingState={dataLoadingState}
    />
  );
}

export default ProjectsImpactsComparison;
