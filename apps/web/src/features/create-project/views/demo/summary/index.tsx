import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { nextStepRequested } from "@/features/create-project/core/demo/demoProject.reducer";
import { selectDemoProjectSummaryViewData } from "@/features/create-project/core/demo/demoProject.selectors";
import { demoProjectSaved } from "@/features/create-project/core/demo/demoProjectSaved.action";

import { useStepBack } from "../useStepBack";
import DemoProjectSummary from "./DemoProjectSummary";

function DemoProjectSummaryContainer() {
  const dispatch = useAppDispatch();
  const { loadingState, data, siteName } = useAppSelector(selectDemoProjectSummaryViewData);

  const onNext = () => {
    void dispatch(demoProjectSaved());
    void dispatch(nextStepRequested());
  };
  const onBack = useStepBack();

  return (
    <DemoProjectSummary
      onBack={onBack}
      projectData={data}
      onNext={onNext}
      loadingState={loadingState}
      siteName={siteName}
    />
  );
}

export default DemoProjectSummaryContainer;
