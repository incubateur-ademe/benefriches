import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import {
  completeSoilsDecontaminationIntroduction,
  revertSoilsDecontaminationIntroductionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationIntroduction from "../../../common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction";

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
