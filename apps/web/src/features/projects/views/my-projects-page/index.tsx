import { useEffect } from "react";
import { fetchReconversionProjects } from "../../application/projectsList.actions";
import MyProjectsPage from "./MyProjectsPage";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function MyProjectsPageContainer() {
  const dispatch = useAppDispatch();
  const { reconversionProjects: projects, reconversionProjectsLoadingState } = useAppSelector(
    (state) => state.reconversionProjectsList,
  );

  useEffect(() => {
    void dispatch(fetchReconversionProjects());
  }, [dispatch]);

  return <MyProjectsPage projectsList={projects} loadingState={reconversionProjectsLoadingState} />;
}

export default MyProjectsPageContainer;
