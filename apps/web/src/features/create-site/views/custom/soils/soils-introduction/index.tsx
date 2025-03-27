import { stepRevertAttempted } from "@/features/create-site/core/actions/revert.actions";
import { soilsIntroductionStepCompleted } from "@/features/create-site/core/actions/spaces.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsIntroduction from "./SoilsIntroduction";

function SiteSoilsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteSoilsIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(soilsIntroductionStepCompleted())}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default SiteSoilsIntroductionContainer;
