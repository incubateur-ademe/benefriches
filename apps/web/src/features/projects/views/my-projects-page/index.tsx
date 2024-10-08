import { useEffect } from "react";

import { selectCurrentUserId } from "@/features/users/application/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchReconversionProjects } from "../../application/projectsList.actions";
import MyProjectsPage from "./MyProjectsPage";

function MyProjectsPageContainer() {
  const dispatch = useAppDispatch();
  const { reconversionProjects: projects, reconversionProjectsLoadingState } = useAppSelector(
    (state) => state.reconversionProjectsList,
  );
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserId) {
      void dispatch(fetchReconversionProjects({ userId: currentUserId }));
    }
  }, [dispatch, currentUserId]);

  return <MyProjectsPage projectsList={projects} loadingState={reconversionProjectsLoadingState} />;
}

export default MyProjectsPageContainer;
