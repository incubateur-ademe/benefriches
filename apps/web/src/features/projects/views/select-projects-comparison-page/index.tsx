import { useEffect } from "react";
import { Route } from "type-route";
import { fetchProjects } from "../../application/projectsList.actions";
import {
  selectProjectById,
  selectProjects,
} from "../../application/projectsList.reducer";
import ProjectsComparisonSelectionPage from "./ProjectsComparisonSelection.page";

import { routes } from "@/router";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.selectProjectToCompare>;
};

function ProjectsComparisonSelectionPageContainer({ route }: Props) {
  const dispatch = useAppDispatch();

  const baseProject = useAppSelector((state) =>
    selectProjectById(state, route.params.baseProjectId),
  );
  const allProjects = useAppSelector(selectProjects);
  const projectsToCompare = allProjects.filter(
    (project) =>
      project.site.id === baseProject?.site.id && project.id !== baseProject.id,
  );

  useEffect(() => {
    const effect = () => {
      void dispatch(fetchProjects());
    };
    effect();
  }, [dispatch]);

  if (!baseProject) return null;

  return (
    <ProjectsComparisonSelectionPage
      baseProject={baseProject}
      projectsToCompare={projectsToCompare}
    />
  );
}

export default ProjectsComparisonSelectionPageContainer;
