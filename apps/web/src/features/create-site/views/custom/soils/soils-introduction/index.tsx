import {
  soilsIntroductionStepCompleted,
  soilsIntroductionStepReverted,
} from "@/features/create-site/core/actions/spaces.actions";
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
        dispatch(soilsIntroductionStepReverted());
      }}
    />
  );
}

export default SiteSoilsIntroductionContainer;
