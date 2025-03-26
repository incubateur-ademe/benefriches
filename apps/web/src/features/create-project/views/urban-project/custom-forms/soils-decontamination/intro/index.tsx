import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { soilsDecontaminationIntroductionCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import SoilsDecontaminationIntroduction from "@/features/create-project/views/common-views/soils-decontamination/introduction/SoilsDecontaminationIntroduction";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function SoilsDecontaminationIntroductionContainer() {
  const dispatch = useAppDispatch();
  const contaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationIntroduction
      contaminatedSurfaceArea={contaminatedSurfaceArea}
      onNext={() => dispatch(soilsDecontaminationIntroductionCompleted())}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default SoilsDecontaminationIntroductionContainer;
