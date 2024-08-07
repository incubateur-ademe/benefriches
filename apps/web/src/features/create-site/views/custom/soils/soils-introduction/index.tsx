import { completeSoilsIntroduction, revertStep } from "../../../../application/createSite.reducer";
import SiteSoilsIntroduction from "./SoilsIntroduction";

import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SiteSoilsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.siteCreation.siteData.isFriche);

  return (
    <SiteSoilsIntroduction
      isFriche={!!isFriche}
      onNext={() => dispatch(completeSoilsIntroduction())}
      onBack={() => {
        dispatch(revertStep());
      }}
    />
  );
}

export default SiteSoilsIntroductionContainer;
