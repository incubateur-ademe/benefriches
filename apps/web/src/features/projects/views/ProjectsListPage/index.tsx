import { useEffect } from "react";
import { fetchProjectsListBySite } from "../../application/projectsList.actions";
import ProjectsListPage from "./ProjectsListPage";

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function ProjectsListPageContainer() {
  const dispatch = useAppDispatch();
  const { loadingState, projectsList } = useAppSelector(
    (state) => state.projectsList,
  );

  useEffect(() => {
    void dispatch(fetchProjectsListBySite());
  }, [dispatch]);

  return (
    <ProjectsListPage
      projectsList={projectsList}
      projectsListFetchingState={loadingState}
    />
  );
}

export default ProjectsListPageContainer;
