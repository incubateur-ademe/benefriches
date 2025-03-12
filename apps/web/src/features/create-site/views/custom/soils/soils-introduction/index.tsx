import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { completeSoilsIntroduction, revertStep } from "../../../../core/createSite.reducer";
import SiteSoilsIntroduction from "./SoilsIntroduction";

function SiteSoilsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteNature = useAppSelector((state) => state.siteCreation.siteData.nature);

  return (
    <SiteSoilsIntroduction
      siteNature={siteNature}
      onNext={() => dispatch(completeSoilsIntroduction())}
      onBack={() => {
        dispatch(revertStep());
      }}
    />
  );
}

export default SiteSoilsIntroductionContainer;
