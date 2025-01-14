import { namingIntroductionStepReverted } from "@/features/create-site/core/actions/createSite.actions";
import { namingIntroductionStepCompleted } from "@/features/create-site/core/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SiteNamingIntroduction from "./SiteNamingIntroduction";

function SiteNamingIntroductionContainer() {
  const dispatch = useAppDispatch();

  return (
    <SiteNamingIntroduction
      onNext={() => dispatch(namingIntroductionStepCompleted())}
      onBack={() => {
        dispatch(namingIntroductionStepReverted());
      }}
    />
  );
}

export default SiteNamingIntroductionContainer;
