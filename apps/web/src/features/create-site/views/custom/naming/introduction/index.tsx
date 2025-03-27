import { namingIntroductionStepCompleted } from "@/features/create-site/core/actions/naming.actions";
import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteNamingIntroduction
      onNext={() => dispatch(namingIntroductionStepCompleted())}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
