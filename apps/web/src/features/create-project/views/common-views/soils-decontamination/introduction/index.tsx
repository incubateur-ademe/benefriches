import {
  completeSoilsDecontaminationIntroduction,
  revertSoilsDecontaminationIntroductionStep,
} from "@/features/create-project/application/createProject.reducer";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationIntroduction from "./SoilsDecontaminationIntroduction";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(completeSoilsDecontaminationIntroduction())}
      onBack={() => dispatch(revertSoilsDecontaminationIntroductionStep())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
