import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectCurrentUserId } from "@/features/onboarding/core/user.reducer";

import {
  fetchUserSiteEvaluations,
  projectRemovedFromEvaluationList,
} from "../../application/evaluationsList.actions";
import MyEvaluationsPage from "./MyEvaluationsPage";

function MyEvaluationsPageContainer() {
  const dispatch = useAppDispatch();
  const { siteEvaluations, loadingState } = useAppSelector((state) => state.evaluationsList);
  const currentUserId = useAppSelector(selectCurrentUserId);

  useEffect(() => {
    if (currentUserId) {
      void dispatch(fetchUserSiteEvaluations());
    }
  }, [dispatch, currentUserId]);

  const onRemoveProjectFromList = (props: { siteId: string; projectId: string }) => {
    dispatch(projectRemovedFromEvaluationList(props));
  };

  return (
    <MyEvaluationsPage
      evaluations={siteEvaluations}
      loadingState={loadingState}
      onRemoveProjectFromList={onRemoveProjectFromList}
    />
  );
}

export default MyEvaluationsPageContainer;
