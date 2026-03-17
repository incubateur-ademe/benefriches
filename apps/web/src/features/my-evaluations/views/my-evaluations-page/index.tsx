import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { selectMyEvaluationsViewData } from "@/features/my-evaluations/core/myEvaluations.selectors";

import {
  fetchUserSiteEvaluations,
  projectRemovedFromEvaluationList,
  siteRemovedFromEvaluationList,
} from "../../application/evaluationsList.actions";
import MyEvaluationsPage from "./MyEvaluationsPage";

function MyEvaluationsPageContainer() {
  const dispatch = useAppDispatch();
  const { siteEvaluations, loadingState, currentUserId } = useAppSelector(
    selectMyEvaluationsViewData,
  );

  useEffect(() => {
    if (currentUserId) {
      void dispatch(fetchUserSiteEvaluations());
    }
  }, [dispatch, currentUserId]);

  const onRemoveProjectFromList = (props: { siteId: string; projectId: string }) => {
    dispatch(projectRemovedFromEvaluationList(props));
  };

  const onRemoveSiteFromList = (siteId: string) => {
    dispatch(siteRemovedFromEvaluationList(siteId));
  };

  return (
    <MyEvaluationsPage
      evaluations={siteEvaluations}
      loadingState={loadingState}
      onRemoveProjectFromList={onRemoveProjectFromList}
      onRemoveSiteFromList={onRemoveSiteFromList}
    />
  );
}

export default MyEvaluationsPageContainer;
