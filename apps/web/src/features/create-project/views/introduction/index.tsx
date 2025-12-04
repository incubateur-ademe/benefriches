import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { introductionStepCompleted } from "../../core/actions/introductionStep.actions";
import CreateProjectIntroductionPage from "./CreateProjetIntroductionPage";

function CreateProjectIntroductionContainer() {
  const dispatch = useAppDispatch();
  const { siteData, siteDataLoadingState } = useAppSelector((state) => state.projectCreation);

  return (
    <CreateProjectIntroductionPage
      siteName={siteData?.name ?? ""}
      siteLoadingState={siteDataLoadingState}
      onNext={() => dispatch(introductionStepCompleted())}
    />
  );
}

export default CreateProjectIntroductionContainer;
