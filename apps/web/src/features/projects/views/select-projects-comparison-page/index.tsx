import { useEffect } from "react";
import { Route } from "type-route";
import { fetchReconversionProjects } from "../../application/projectsList.actions";
import {
  selectComparableProjects,
  selectReconversionProjectById,
} from "../../application/projectsList.reducer";
import ProjectsComparisonSelectionPage from "./ProjectsComparisonSelection.page";

import { routes } from "@/app/views/router";
import { selectCurrentUserId } from "@/features/users/application/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

type Props = {
  route: Route<typeof routes.selectProjectToCompare>;
};

function ProjectsComparisonSelectionPageContainer({ route }: Props) {
  const dispatch = useAppDispatch();

  const baseProject = useAppSelector((state) =>
    selectReconversionProjectById(state, route.params.baseProjectId),
  );
  const projectsToCompare = useAppSelector((state) =>
    selectComparableProjects(state, baseProject?.id ?? ""),
  );

  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserId) {
      void dispatch(fetchReconversionProjects({ userId: currentUserId }));
    }
  }, [dispatch, currentUserId]);

  if (!baseProject) return null;

  return (
    <ProjectsComparisonSelectionPage
      baseProject={baseProject}
      projectsToCompare={projectsToCompare}
    />
  );
}

export default ProjectsComparisonSelectionPageContainer;
