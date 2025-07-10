import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { completeSoilsDecontaminationIntroduction } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsDecontaminationIntroduction from "../../../../common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(completeSoilsDecontaminationIntroduction())}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
