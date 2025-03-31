import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsIntroductionStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSpacesIntroduction from "./SpacesIntroduction";

function SiteSpacesIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteSpacesIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(soilsIntroductionStepCompleted())}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteSpacesIntroductionContainer;
