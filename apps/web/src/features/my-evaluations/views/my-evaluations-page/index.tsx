import { useEffect } from "react";

import { selectCurrentUserId } from "@/features/onboarding/core/user.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { fetchUserSiteEvaluations } from "../../application/evaluationsList.actions";
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

  return <MyEvaluationsPage evaluations={siteEvaluations} loadingState={loadingState} />;
}

export default MyEvaluationsPageContainer;
