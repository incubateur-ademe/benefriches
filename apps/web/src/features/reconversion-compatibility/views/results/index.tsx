import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes, useRoute } from "@/shared/views/router";

import { reconversionCompatibilityEvaluationReset } from "../../core/actions/compatibilityEvaluationReset.actions";
import { reconversionCompatibilityEvaluationResultsRequested } from "../../core/actions/compatibilityEvaluationResultsRequested.actions";
import { fricheSavedFromCompatibilityEvaluation } from "../../core/actions/fricheSavedFromCompatibilityEvaluation.actions";
import { selectReconversionCompatibilityViewData } from "../../core/reconversionCompatibilityEvaluation.selectors";
import ReconversionCompatibilityResultsPage from "./ReconversionCompatibilityResultsPage";

export default function ReconversionCompatibilityResultsPageContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectReconversionCompatibilityViewData);
  const { params } = useRoute();
  const queryParams = params as { mutafrichesId: string };

  useEffect(() => {
    void dispatch(
      reconversionCompatibilityEvaluationResultsRequested({
        mutafrichesId: queryParams.mutafrichesId,
      }),
    );
  }, [dispatch, queryParams.mutafrichesId]);

  const handleResetAnalysis = () => {
    dispatch(reconversionCompatibilityEvaluationReset());
    routes.evaluateReconversionCompatibility().push();
  };

  return (
    <ReconversionCompatibilityResultsPage
      onFricheSaved={() => {
        void dispatch(fricheSavedFromCompatibilityEvaluation());
      }}
      onResetAnalysis={handleResetAnalysis}
      viewData={viewData}
    />
  );
}
