import { namingIntroductionStepCompleted } from "@/features/create-site/core/actions/naming.actions";
import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteNamingIntroduction
      onNext={() => dispatch(namingIntroductionStepCompleted())}
      onBack={() => {
        dispatch(stepReverted());
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
