import SiteNamingIntroduction from "./SiteNamingIntroduction";

import { namingIntroductionStepReverted } from "@/features/create-site/application/createSite.actions";
import { namingIntroductionStepCompleted } from "@/features/create-site/application/createSite.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

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
