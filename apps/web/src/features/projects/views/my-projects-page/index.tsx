import { useEffect } from "react";
import {
  fetchProjects,
  fetchSites,
} from "../../application/projectsList.actions";
import {
  selectProjectsGroupedBySite,
  selectSitesAndProjectsLoadingState,
} from "../../application/projectsList.reducer";
import MyProjectsPage from "./MyProjectsPage";

import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";

function MyProjectsPageContainer() {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector(selectSitesAndProjectsLoadingState);
  const projectsGroupedBySite = useAppSelector(selectProjectsGroupedBySite);

  useEffect(() => {
    void dispatch(fetchProjects());
    void dispatch(fetchSites());
  }, [dispatch]);

  return (
    <MyProjectsPage
      projectsList={projectsGroupedBySite}
      loadingState={loadingState}
    />
  );
}

export default MyProjectsPageContainer;
