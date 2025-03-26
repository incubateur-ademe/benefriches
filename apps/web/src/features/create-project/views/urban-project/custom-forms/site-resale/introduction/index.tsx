import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { siteResaleIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteResaleIntroduction from "./SiteResaleIntroduction";

function SiteResaleIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteResaleIntroduction
      onNext={() => {
        dispatch(siteResaleIntroductionCompleted());
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteResaleIntroductionContainer;
