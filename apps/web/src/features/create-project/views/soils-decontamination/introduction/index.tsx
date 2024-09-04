import SoilsDecontaminationIntroduction from "./SoilsDecontaminationIntroduction";

import {
  completeSoilsDecontaminationIntroduction,
  revertSoilsDecontaminationIntroductionStep,
} from "@/features/create-project/application/createProject.reducer";
import { selectSiteData } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector(selectSiteData);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={siteData?.contaminatedSoilSurface ?? 0}
      onNext={() => dispatch(completeSoilsDecontaminationIntroduction())}
      onBack={() => dispatch(revertSoilsDecontaminationIntroductionStep())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
